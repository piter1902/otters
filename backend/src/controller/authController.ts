import User from "../models/User"
import Express, { NextFunction } from 'express';
import logger from "@poppinss/fancy-logs";
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import emailService from "../service/emailService";


const loginUser = async (req: Express.Request, res: Express.Response, next: NextFunction) => {
  passport.authenticate("local", { session: false }, (err: any, user: any) => {
    logger.info("Authenticate con estrategia local");
    if (err) {
      logger.error(err);
      return next(err);
    }
    if (!user) {
      res
        .status(401)
        .json({
          error: `User does not exists`
        });
    } else {
      logger.info("Comienza generacion del token")

      // Usuario baneado o o verificado?
      if (user.bannedObject.banned) {
        // El usuario está baneado
        res
          .status(401)
          .json({
            error: `User is banned until ${new Date(user.bannedObject.bannedUntil).toLocaleDateString("es-ES")}`
          })
      } else if (!user.isVerified) {
        // El usuario no está verificado
        res
          .status(401)
          .json({
            error: `User's email hasn't been verified`
          });
      } else {
        // El usuario no está baneado
        const payload = {
          id: user._id
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' });

        res
          .status(200)
          .json({ data: { token: token, userId: user._id } });
      }
    }
  })(req, res);
}

const registerUser = async (req: Express.Request, res: Express.Response) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (user != null) {
      res
        .status(400)
        .send("User already exists");
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        sanitaryZone: req.body.sanitaryZone,
        password: hashedPassword,
        bannedObject: { "banned": false },
        isAdmin: false,
        isVerified: false
      });
      // Save to mongoDb
      await newUser.save();
      await emailService.sendVerificationEmail(newUser);
      res
        .status(201)
        .send(newUser);
      logger.info("Creating a new user");
    }
  } catch (err) {
    logger.error("ERROR!" + err);

    res
      .status(400)
      .json(err);
  }
}


const verifyUser = async (req: Express.Request, res: Express.Response) => {
  // Query param
  const id = req.query.id;
  // Comprobación de que existe el id
  const user = await User.findById(id).exec();
  if (user != null && !user.isVerified) {
    // Existe, actualizamos el usuario con el verificado
    user.isVerified = true;
    await user.save();  
  }
  res.status(200).send("Usuario verificado. Puedes iniciar sesión.");
}


export default {
  registerUser,
  loginUser,
  verifyUser
}