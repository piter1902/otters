import logger from '@poppinss/fancy-logs';
import Express from 'express';
import passport from 'passport';
import authController from '../controller/authController';
import '../service/passportConfig';

let succesLoginUrl: string = 'http://localhost:3000/login/success'; // React app location
let errorLoginUrl: string = 'http://localhost:3000/login/error'; // React app location

if (process.env.PRODUCTION === "true") {
  succesLoginUrl = process.env.CORS_URI!.toString() + "/login/success";
  errorLoginUrl = process.env.CORS_URI!.toString() + "/login/error";
}

const authRoute = Express.Router();

authRoute.route("/login")
  .post(authController.loginUser);

authRoute.route("/register")
  .post(authController.registerUser);

authRoute.route("/verifyUser")
  .get(authController.verifyUser);

authRoute.route("/google")
  .get(passport.authenticate("google", { session: false, scope: ["profile", "email"] }));

authRoute.route("/google/redirect")
  .get(passport.authenticate("google",
    {
      session: false,
      failureMessage: "Cannot login to Google , please try again later!",
      failureRedirect: errorLoginUrl,
      successRedirect: succesLoginUrl
    }), authController.loginGoogle);

authRoute.route("/:uid")
  .post(authController.checkPasswords);

export default authRoute;