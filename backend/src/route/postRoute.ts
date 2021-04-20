import Express from 'express';
import postsController from '../controller/postsController';
const postRoute = Express.Router();

postRoute.route("/")
    .post(postsController.createNewPost)
    .get(postsController.getAllPosts);

postRoute.route("/:id")
    .get(postsController.getPostByID)
    .delete(postsController.deletePostByID)

    //Comentarios
postRoute.route("/:id/comment")
    .get(postsController.getComments)
    .post(postsController.createComment)
    
postRoute.route("/:id/comment/:cid")
    .get(postsController.getCommentById)
    .delete(postsController.deleteCommentById)

    //Valoraciones positivas
postRoute.route("/:id/postitivevaloration")
    .get(postsController.getPositiveValoration)
    .post(postsController.addPositiveValoration)

postRoute.route("/:id/postitivevaloration/:pvid")
    .delete(postsController.deletePositiveValoration)

        //Valoraciones negativas
postRoute.route("/:id/negativevaloration")
    .get(postsController.getNegativeValoration)
    .post(postsController.addNegativeValoration)

postRoute.route("/:id/negativevaloration/:nvid")
    .delete(postsController.deleteNegativeValoration)

export default postRoute;