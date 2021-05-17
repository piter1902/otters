import logger from '@poppinss/fancy-logs';
import Express from 'express';
import passport from 'passport';
import authController from '../controller/authController';
import '../service/passportConfig';

const authRoute = Express.Router();

authRoute.route("/login")
  .post(authController.loginUser);

authRoute.route("/register")
  .post(authController.registerUser);

authRoute.route("/:uid")
  .post(authController.checkPasswords);
  
authRoute.route("/verifyUser")
  .get(authController.verifyUser);
  
authRoute.route("/google")
  .post(passport.authenticate("google", { session: false, scope: ["profile", "email"] }, (req, res) => {logger.info("Hola")}));

authRoute.route("/google/redirect")
  .get(authController.loginGoogle);

export default authRoute;