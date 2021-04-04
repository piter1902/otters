import Express from 'express';
import userController from '../controller/userController';
import petitionsController from '../controller/petitionsController';
const userRoute = Express.Router();

userRoute.route("/")
    .post(userController.createNewUser)
    .get(userController.getAllUsers);

userRoute.route("/:uid")
    .get(userController.getUserByUID)
    .delete(userController.deleteUserByUID);

// Petitions
userRoute.route("/:uid/petitions")
    .get(petitionsController.getPetitions)
    .post(petitionsController.petitionsCreate);

userRoute.route("/:uid/petitions/:petitionId")
    .get(petitionsController.readOnePetition)
    .put(petitionsController.updateOnePetition)
    .delete(petitionsController.deleteOnePetition);

export default userRoute;