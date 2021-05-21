import User from "../models/User"
import Express, { NextFunction } from 'express';
import logger from "@poppinss/fancy-logs";
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import emailService from "../service/emailService";
import '../service/passportConfig';
import userPicture from '../UserPicture';

const loginUser = async (req: Express.Request, res: Express.Response, next: NextFunction) => {
  passport.authenticate("local", { session: false }, (err: any, user: any) => {
    logger.info("Authenticate con estrategia local");
    if (err) {
      logger.error(err);
      return next(err);
    }
    if (!user || (user && !user.isLocal)) {
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
          .setHeader('x-auth-token', token);

        res
          .status(200)
          .json({ userId: user._id });
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
        picture: userPicture,
        bannedObject: { "banned": false },
        isAdmin: false,
        isVerified: false,
        isLocal: true,
        petitions: [],
        posts: []
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


const checkPasswords = async (req: Express.Request, res: Express.Response) => {
  try {
    const uid = req.params.uid;
    logger.info(`Getting user with uid = ${uid} checkPasswords`);
    // Obtenemos al usuario de la bd
    const user = await User.findById(uid).exec();
    if (user != null) {
      logger.info("new pass: " + req.body.newPassword);
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result) {
          // coinciden

          user.password = hashedPassword;
          // Save to mongoDb
          user.save((err: any, user: typeof User) => {
            if (err) {
              res
                .status(404)
                .json(err);
            } else {
              res
                .status(200)
                .json(user);
            }
          });
          logger.info("contraseñas actualizadas");
        } else {
          //no coinciden
          res
            .status(400)
            .send("contraseñas no coinciden");
          logger.info("contraseñas no coinciden");
        }

      });
    } else {
      res.status(404).send("Usuario no encontrado");
    }


  } catch (err) {
    logger.error("ERROR!" + err);

    res
      .status(400)
      .json(err);
  }
}

const loginGoogle = (req: any, res: Express.Response, next: NextFunction) => {

  // Una vez hecho el log por google, creamos el token JWt como en el loggin normal
  logger.info("Comienza generacion del token por GoogleAuth")
  const payload = {
    id: req.user._id
  }
  // Creación del token JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' });

  // Introducimos el token en la cabecera 'x-auth-token' de la respuesta
  res
    .setHeader('x-auth-token', token);

  res
    .status(200)
    .json({ userId: req.user._id });
  next();

}


export default {
  registerUser,
  loginUser,
  checkPasswords,
  verifyUser,
  loginGoogle
}