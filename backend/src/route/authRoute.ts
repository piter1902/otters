import Express from 'express';
import authController from '../controller/authController';
import '../service/passportConfig';


const authRoute = Express.Router();

authRoute.route("/login")
  .post(authController.loginUser);

authRoute.route("/register")
  .post(authController.registerUser);

authRoute.route("/verifyUser")
  .get(authController.verifyUser);

authRoute.route("/google")
  .post(authController.loginGoogle);

authRoute.route("/facebook")
  .post(authController.loginFacebook);

authRoute.route("/:uid")
  .post(authController.checkPasswords);

export default authRoute;