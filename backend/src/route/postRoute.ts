import Express from 'express';
import postsController from '../controller/postsController';
const postRoute = Express.Router();

postRoute.route("/")
    .post(postsController.createNewPost)
    .get(postsController.getAllPosts);

postRoute.route("/:id")
    .get(postsController.getPostByID)
    .delete(postsController.deletePostByID)

postRoute.route("/:id/comment")
    .get(postsController.getComments)
    .post(postsController.createComment)
    
postRoute.route("/:id/comment/:cid")
    .get(postsController.getCommentById)
    .delete(postsController.deleteCommentById)

export default postRoute;