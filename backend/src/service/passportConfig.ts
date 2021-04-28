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

passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
  logger.info("Usando estrategia local: " + email);
  User.findOne({ email: email.toLowerCase() }, async (err: any, user: any) => {
    if (err) { return done(err); }
    if (!user) {
      logger.info("No se ha encontrado user");
      return done(null, false, { message: `Email ${email} not found.` });
    }

    bcrypt.compare(password, user.password, (err: Error, result: any) => {
      if (err) { return done(err); }
      if (result === true) {
        logger.info("Password correcta");
        return done(undefined, user);
      }
      logger.error("Password incorrecta: " + password + " --- " + user.password);
      return done(null, false, { message: "Invalid email or password." });
    });
  });
}));

