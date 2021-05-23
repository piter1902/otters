import Express from 'express';
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

export default authRoute;