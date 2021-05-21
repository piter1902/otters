import User from '../models/User';
import bcrypt from 'bcrypt';
import passportLocal from 'passport-local';
import logger from '@poppinss/fancy-logs';
import passport from 'passport';
import passportJwt, { ExtractJwt } from 'passport-jwt';
import passportGoogleAuth from 'passport-google-oauth';
import userPicture from '../UserPicture';
import emailService from "../service/emailService";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const GoogleStrategy = passportGoogleAuth.OAuth2Strategy;

/**
 * Estrategia JWT
 * Source: https://davidinformatico.com/jwt-express-js-passport/
 */

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!
},
  async (jwt_payload, done) => {
    logger.info("Ejecutando estrategia JWT");
    try {
      const user = await User.findOne({ _id: jwt_payload.id });
      if (!user) {
        logger.info("No se ha encontrado user - JWTStrategy");
        return done(null, false);
      } else {
        logger.info("User admitido - JWTStrategy")
        return done(undefined, user);
      }
    } catch (err) {
      logger.error(err);
      return done(err, null);
    }
  }));

/**
 * Sign in using Google authentication 
 */

passport.use(new GoogleStrategy(
  {
    clientID: process.env.OAUTH_CLIENT_ID!,
    clientSecret: process.env.OAUTH_CLIENT_SECRET!,
    callbackURL: process.env.BACK_BASEURL! + "/auth/google/redirect"
  },
  async (accesToken, refreshToken, profile, done) => {
    logger.info("Ejecutando estrategia Google Oauth");

    try {
      const user = await User.findOne({ email: profile.emails![0].value });
      if (!user) {
        logger.info("Creando nuevo user - GoogleAuth");
        // TODO: Esta pass por defecto deberia estar en el env

        const newUser = new User({
          name: profile.name?.givenName,
          picture: userPicture,
          email: profile.emails![0].value,
          sanitaryZone: 1, // TODO: No puede ser 1
          password: "contraseñaInaccesible",
          bannedObject: { "banned": false },
          isAdmin: false,
          isLocal: false,
          isVerified: false,
          petitions: [],
          posts: []
        })

        await newUser.save();
        await emailService.sendVerificationEmail(newUser);
        return done(null, newUser);
      } else {
        logger.info("User admitido - GoogleAuth")
        return done(undefined, user);
      }
    } catch (err) {
      logger.error(err);
      return done(err, false);
    }
  }
))
/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({
  usernameField: "email",
  session: false
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      logger.info("No se ha encontrado user - LocalStrategy");
      return done(null, false, { message: `Email ${email} not found.` });
    }

    const result = await bcrypt.compare(password, user.password);
    if (result === true) {
      logger.info("Password correcta");
      return done(undefined, user);
    } else {

      logger.error("Password incorrecta: " + password + " --- " + user.password);
      return done(null, false, { message: "Invalid email or password." });
    }
  } catch (err) {
    logger.error(err);
    return done(err, null);
  }
}));

