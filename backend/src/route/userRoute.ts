import Express from 'express';
import userController from '../controller/userController';
import petitionsController from '../controller/petitionsController';
import postsController from '../controller/postsController';
const userRoute = Express.Router();

userRoute.route("/")
    .post(userController.createNewUser)
    .get(userController.getAllUsers);

userRoute.route("/:uid")
    .get(userController.getUserByUID)
    .delete(userController.deleteUserByUID)
    .post(userController.updateUser);

userRoute.route("/:uid/ban/:uidAdmin")
    .post(userController.banUser);

userRoute.route("/:uid/strike")
    .post(userController.strikeUser);

    userRoute.route("/:uid/strike/:petId")
    .post(userController.strikeUserInPet);

// Petitions
userRoute.route("/:uid/petitions")
    .get(petitionsController.getUserPetitions);
    

// Posts
userRoute.route("/:uid/posts")
    .get(postsController.getPosts)
    .post(postsController.postsCreate);

userRoute.route("/:uid/posts/:postId")
    .get(postsController.readOnePost)
    .delete(postsController.deleteOnePost);

export default userRoute;