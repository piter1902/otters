import User from '../models/User';
import bcrypt from 'bcrypt';
import passportLocal from 'passport-local';
import logger from '@poppinss/fancy-logs';
import passport from 'passport';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser((user: any, done: any) => {
  logger.info("User en serialze: " + user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err: any, user: any) => done(err, user));
});

/**
 * Sign in using Email and Password.
 */

passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      logger.info("No se ha encontrado user");
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
    return done(err);
  }
}));

