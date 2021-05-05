import User from "../models/User"
import Express, { NextFunction } from 'express';
import logger from "@poppinss/fancy-logs";
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


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
      const payload = {
        sub: user._id,
        iat: Date.now() + parseInt(process.env.JWT_EXPIRATION!),
        username: user.name
      }

      const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET!);
      res
        .status(200)
        .json({ data: { token: token } });
      /*En caso de usar sessions deberiamos llamar al logIn */
      // req.logIn(user, (err) => {
      //   if (err) {
      //     logger.error(err);
      //     return next(err);
      //   }
      //   res
      //     .status(200)
      //     .send('User authenticated')
      //   console.log(req.user);
      // })
    }
  })(req, res);
}
const registerUser = async (req: Express.Request, res: Express.Response) => {

  try {
    const user = await User.findOne({ name: req.body.name }).exec();
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
        isAdmin: false
      });
      // Save to mongoDb
      await newUser.save();
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


export default {
  registerUser,
  loginUser
}