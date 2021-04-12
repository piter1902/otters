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
    .post(userController.banUser);

// Petitions
userRoute.route("/:uid/petitions")
    .get(petitionsController.getPetitions)
    .post(petitionsController.petitionsCreate);

userRoute.route("/:uid/petitions/:petitionId")
    .get(petitionsController.readOnePetition)
    .put(petitionsController.updateOnePetition)
    .delete(petitionsController.deleteOnePetition);

// Posts
userRoute.route("/:uid/posts")
    .get(postsController.getPosts)
    .post(postsController.postsCreate);

userRoute.route("/:uid/posts/:postId")
    .get(postsController.readOnePost)
    .delete(postsController.deleteOnePost);

// TODO: Valoraciones de un post
// userRoute.route("/:uid/posts/:postId/valoration")
//     .get(postsController.readValoration)
//     .post(postsController.addValoration)

// userRoute.route("/:uid/posts/:postId/valoration/:valorationId")
//     .delete(postsController.deleteOneValoration);

export default userRoute;