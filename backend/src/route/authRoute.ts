import logger from '@poppinss/fancy-logs';
import Express from 'express';
import authController from '../controller/authController';
import passport from 'passport';
import '../service/passportConfig';

const authRoute = Express.Router();

authRoute.post("/login", (req, res, next) => {
  logger.info("Intento de login");
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) {
      logger.error(err);
      return next(err);
    }

    if (!user) {
      res
        .status(404)
        .json({
          error: `User does not exists`
        });
    } else {
      req.logIn(user, (err) => {
        if (err) {
          logger.error(err);
          return next(err);
        }
        res
          .status(200)
          .send('User authenticated')
        console.log(req.user);
      })

    }

  })(req, res, next);
});

authRoute.route("/register")
  .post(authController.registerUser);

export default authRoute;