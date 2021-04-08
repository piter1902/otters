import logger from '@poppinss/fancy-logs';
import Express from 'express';
import User from '../models/User';

const postsCreate = (req: Express.Request, res: Express.Response) => {
  // Get query params
  const userId = req.params.uid;
  logger.info(`Creando nuevo post para user = ${userId}`);
  if (userId) {
    User
      .findById(userId)
      .select('posts')
      .exec((err: any, user: typeof User) => {
        if (err) {
          res
            .status(400)
            .json(err);
        } else {
          _doAddPost(req, res, user);
        }
      });
  } else {
    res
      .status(404)
      .json({
        message: 'uid query param is required'
      });
  }
};

const getPosts = (req: Express.Request, res: Express.Response) => {
  const userId = req.params.uid;
  logger.info(`Obteniendo posts de user = ${userId}`);
  if (userId) {
    User
      .findById(userId)
      .exec((err: any, user: any) => {
        if (!user) {
          res
            .status(404)
            .json({
              "message": "userId not found"
            });
          return;
        } else if (err) {
          res
            .status(404)
            .json(err);
          return;
        }
        if (user.posts && user.posts.length > 0) {
          const posts = user.posts;
          res
            .status(200)
            .json(posts);
        } else {
          res
            .status(404)
            .json({
              "message": "No posts found"
            });
        }
      });

  } else {
    res
      .status(404)
      .json({
        message: 'uid query param is required'
      });
  }
}


const readOnePost = (req: Express.Request, res: Express.Response) => {
  if (req.params && req.params.uid && req.params.postId) {
    User
      .findById(req.params.uid)
      .exec((err: any, user: any) => {
        if (!user) {
          res
            .status(404)
            .json({ "message": "uid not found" });
        } else if (err) {
          res
            .status(404)
            .json(err);
        }
        if (user.posts && user.posts.length > 0) {
          const post = user.posts.id(req.params.postId);
          if (!post) {
            res
              .status(404)
              .json({
                "message": "postId not found"
              });
          } else {
            res
              .status(200)
              .json(post);
          }
        } else {
          res
            .status(404)
            .json({
              "message": "No posts found"
            });
        }
      });
  } else {
    res
      .status(404)
      .json({
        "message": "Not found, uid and postId are both required"
      });
  }
}


const deleteOnePost= (req: Express.Request, res: Express.Response) => {
  if (req.params && req.params.uid && req.params.postId) {
    User
      .findById(req.params.uid)
      .exec((err: any, user: any) => {
        if (!user) {
          res
            .status(404)
            .json({ "message": "uid not found" });
        } else if (err) {
          res
            .status(404)
            .json(err);
        }
        if (user.posts && user.posts.length > 0) {
          const post = user.posts.id(req.params.postId);
          if (!post) {
            res
              .status(404)
              .json({
                "message": "postId not found"
              });
          } else {
            user.posts.id(req.params.postId).remove();
            user.save((err: any, post : typeof User) => {
              if (err) {
                res
                  .status(404)
                  .json(err);
              } else {
                res
                  .status(204)
                  .json(user);
              }
            });
          }
        } else {
          res
            .status(404)
            .json({
              "message": "No posts found"
            });
        }
      });
  } else {
    res
      .status(404)
      .json({
        "message": "Not found, uid and postId are both required"
      });
  }
}
// Private methods
const _doAddPost = function (req: Express.Request, res: Express.Response, user: any) {
  if (!user) {
    res
      .status(404)
      .json({
        message: "userId not found"
      });
  } else {
    // Se obtiene la fecha antes de guardar porque se debe aumentar en 1 el mes ya que
    // se almacena en numeros del 0-11 por defecto
    var tempDate = new Date(req.body.date);
    user.posts.push({
      title: req.body.title,
      body: req.body.body,
      //TODO: No tengo claro que lo acabe de hacer bien
      date: new Date(tempDate.setMonth(tempDate.getMonth() + 1)),
      //TODO:
      // comments:
      // possitive_valorations:
      // negative:valorations:
    });
    user.save((err: Express.ErrorRequestHandler, user: any) => {
      if (err) {
        logger.error(err.toString());
        res
          .status(400)
          .json(err);
      } else {
        let thisPost = user.posts[user.posts.length - 1];
        res
          .status(201)
          .json(thisPost);
      }
    });
  }
};
export default {
  getPosts,
  postsCreate,
  readOnePost,
  deleteOnePost
}