import User from "../models/User"
import Express, { NextFunction } from 'express';
import logger from "@poppinss/fancy-logs";
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import emailService from "../service/emailService";
import '../service/passportConfig';
import { OAuth2Client } from 'google-auth-library';
import userPicture from '../UserPicture';
import fetch from 'isomorphic-fetch';

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
  // Verify user token (recaptcha)
  const response: boolean = await _verifyUserCaptcha(req.body.captchaResponse);
  if (!response) {
    // Ha fallado la comprobación con la API de google
    res
      .status(400)
      .send("Fallo en la verifiación del reCaptcha");
  } else {
    // Ha ido bien
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
<<<<<<< HEAD
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
=======
        .json(err);
>>>>>>> master
    }
  }
}

// Private function to verify captcha with google API
const _verifyUserCaptcha = async (response: string) => {
  const resp = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${response}`, {
    method: "POST"
  });
  const jsonbody = await resp.json();
  // console.log(JSON.stringify(jsonbody));
  return jsonbody.success as boolean;
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

const loginGoogle = async (req: any, res: Express.Response) => {
  try {
    // UserId
    var userId;
    // Indica si el usuario existia anteriormente
    var userExists;

    const googleClient = new OAuth2Client(process.env.OAUTH_CLIENT_ID!);
    logger.info("Loggin por Google")
    const reqToken = req.body.token;

    // Verificamos el token de google obtenido en la petición
    const ticket = await googleClient.verifyIdToken({
      idToken: reqToken,
      audience: process.env.OAUTH_CLIENT_ID!
    });

    const { name, email } = ticket.getPayload()!;

    logger.info("Email en google: " + email);
    logger.info("Nombre en google: " + name);

    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      logger.info("Creando nuevo user - GoogleAuth");
      // TODO: Esta pass por defecto deberia estar en el env

      const newUser = new User({
        name: name,
        picture: userPicture,
        email: email,
        sanitaryZone: 1, // TODO: No puede ser 1
        password: "contraseñaInaccesible",
        bannedObject: { "banned": false },
        isAdmin: false,
        isLocal: false,
        isVerified: true,
        petitions: [],
        posts: []
      })

      await newUser.save();

      userId = newUser._id;
      userExists = false;
    } else {
      logger.info("User existente - GoogleAuth");
      userId = user._id;
      userExists = true;
    }

    // Una vez hecho el log por google, creamos el token JWt como en el loggin normal

    const payload = {
      id: userId
    }
    // Creación del token JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' });

    // Introducimos el token en la cabecera 'x-auth-token' de la respuesta
    res
      .setHeader('x-auth-token', token);

    res
      .status(200)
      .json(
        {
          userId: userId,
          userExists: userExists
        });

  } catch (err) {
    logger.error(err);
    res
      .status(400)
      .json(err)
  }
}

const loginFacebook = async (req: any, res: Express.Response) => {

  try {

    logger.info("Loggin por Facebook")
    const { accessToken, userId } = req.body;

    var urlGraphFacebook = `https://graph.facebook.com/v2.11/${userId}/?fields=id,name,email&access_token=${accessToken}`
    // Realizamos consulta a la api de facebook
    const response = await fetch(urlGraphFacebook,
      {
        method: 'GET'
      });

    if (response.ok) {
      // Logged UserId
      var loggedUserID;
      // Indica si el usuario existia anteriormente
      var userExists;

      const resultJson = await response.json();
      logger.info("Respuesta de facebook: " + response)
      const { email, name } = resultJson;
      logger.info("Email " + email)
      logger.info("Name: " + name)

      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        logger.info("Creando nuevo user - FacebookLogin");
        // TODO: Esta pass por defecto deberia estar en el env

        const newUser = new User({
          name: name,
          picture: userPicture,
          email: email,
          sanitaryZone: 1, // TODO: No puede ser 1
          password: "contraseñaInaccesible",
          bannedObject: { "banned": false },
          isAdmin: false,
          isLocal: false,
          isVerified: true,
          petitions: [],
          posts: []
        })

        await newUser.save();

        loggedUserID = newUser._id;
        userExists = false;
      } else {
        logger.info("User existente - FacebookLogin");
        loggedUserID = user._id;
        userExists = true;
      }

      // Una vez hecho el log por Facebook, creamos el token JWt como en el loggin normal

      const payload = {
        id: loggedUserID
      }
      // Creación del token JWT
      const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' });

      // Introducimos el token en la cabecera 'x-auth-token' de la respuesta
      res
        .setHeader('x-auth-token', token);

      res
        .status(200)
        .json(
          {
            userId: loggedUserID,
            userExists: userExists
          });
    } else {
      res
        .status(400)
        .json(response.text)
    }
  } catch (err) {
    logger.error(err);
    res
      .status(400)
      .json(err)
  }
}

export default {
  registerUser,
  loginUser,
  checkPasswords,
  verifyUser,
  loginGoogle,
  loginFacebook
}