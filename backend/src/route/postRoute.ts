import Express from 'express';
import passport from 'passport';
import postsController from '../controller/postsController';
const postRoute = Express.Router();

postRoute.route("/")
    .get(postsController.getAllPosts)
    .post(passport.authenticate('jwt', { session: false }), postsController.createNewPost);

postRoute.route("/:id")
    .get(postsController.getPostByID)
    .delete( postsController.deletePostByID)

//Comentarios
postRoute.route("/:id/comment")
    .get(postsController.getComments)
    .post(passport.authenticate('jwt', { session: false }), postsController.createComment)

postRoute.route("/:id/comment/:cid")
    .get(postsController.getCommentById)
    .delete(passport.authenticate('jwt', { session: false }), postsController.deleteCommentById)

//Valoraciones positivas
postRoute.route("/:id/positivevaloration")
    .get(postsController.getPositiveValoration)
    .post(passport.authenticate('jwt', { session: false }), postsController.addPositiveValoration)

postRoute.route("/:id/positivevaloration/:pvid")
    .delete(passport.authenticate('jwt', { session: false }), postsController.deletePositiveValoration)

//Valoraciones negativas
postRoute.route("/:id/negativevaloration")
    .get(postsController.getNegativeValoration)
    .post(passport.authenticate('jwt', { session: false }), postsController.addNegativeValoration)

postRoute.route("/:id/negativevaloration/:nvid")
    .delete(passport.authenticate('jwt', { session: false }), postsController.deleteNegativeValoration)

export default postRoute;