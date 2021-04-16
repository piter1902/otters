import Express from 'express';
import postsController from '../controller/postsController';
const postRoute = Express.Router();

postRoute.route("/")
    .post(postsController.createNewPost)
    .get(postsController.getAllPosts);

postRoute.route("/:id")
    .get(postsController.getPostByID)
    .delete(postsController.deletePostByID)

export default postRoute;