import logger from '@poppinss/fancy-logs';
import Express from 'express';
import Posts from '../models/Posts';
import User from '../models/User';
import mongoose from 'mongoose';

//Operaciones sobre los post de un usuario concreto /user/uid/posts

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
          _doAddPost(req, res, user, userId);
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

// const ValorationCreate = (req: Express.Request, res: Express.Response) => {
//   // Get query params
//   const userId = req.params.uid;
//   const postId = req.params.postId;
//   logger.info(`Creando nuevo post para user = ${userId}`);
//   if (userId && postId) {
//     Posts
//       .findById(postId)
//       .select('posts')
//       .exec((err: any, user: typeof User) => {
//         if (err) {
//           res
//             .status(400)
//             .json(err);
//         } else {
//           _doAddPost(req, res, user, userId);
//         }
//       });
//   } else {
//     res
//       .status(404)
//       .json({
//         message: 'uid query param is required'
//       });
//   }
// };

const getPosts = (req: Express.Request, res: Express.Response) => {
  const userId = req.params.uid;
  logger.info(`Obteniendo posts de user = ${userId}`);
  if (userId) {
    User
      .findById(userId)
      .exec(async (err: any, user: any) => {
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
          // Source: https://stackoverflow.com/questions/32264225/how-to-get-multiple-document-using-array-of-mongodb-id
          var postsId = user.posts.map(function (ele: any) {
            return mongoose.Types.ObjectId(ele);
          });

          let userPosts= await Posts.find({
            _id: {
              $in: postsId
            }
          });

          res
            .status(200)
            .json(userPosts);
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
      .exec(async (err: any, user: any) => {
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
          const postRef = user.posts.includes(req.params.postId);
          if (!postRef) {
            res
              .status(404)
              .json({
                "message": "postId not found"
              });
          } else {
            const post = await Posts.findById(req.params.postId).exec();
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


const deleteOnePost= async (req: Express.Request, res: Express.Response) => {
  if (req.params && req.params.uid && req.params.postId) {
    User
      .findByIdAndUpdate(req.params.uid, { $pull: { posts: req.params.postId } })
      .exec(async (err: any, user: any) => {
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
          const postRef = user.posts.includes(req.params.postId);
          if (!postRef) {
            res
              .status(404)
              .json({
                "message": "postId not found"
              });
          } else {
            // En este caso el post pertenece al user y se elimina
            // Delete post from posts collection
            await Posts.findByIdAndDelete(req.params.postId).exec();

            user.save((err: any, post : typeof User) => {
              if (err) {
                res
                  .status(404)
                  .json(err);
              } else {
                res
                  .status(204)
                  .json("Ok");
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
const _doAddPost = async function (req: Express.Request, res: Express.Response, user: any, userId: String) {
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
    const post = new Posts({
      title: req.body.title,
      body: req.body.body,
      //TODO: No tengo claro que lo acabe de hacer bien
      date: new Date(tempDate.setMonth(tempDate.getMonth() + 1)),
      publisher: userId,
      //TODO:
      // comments:
      // possitive_valorations:
      // negative:valorations:
    });
    
    user.posts.push(
      post._id
    );

    await user.save((err: Express.ErrorRequestHandler, user: any) => {
      if (err) {
        logger.error(err.toString());
        res
          .status(400)
          .json(err);
      }
    });

    post.save((err: Express.ErrorRequestHandler, user: any) => {
      if (err) {
        logger.error(err.toString());
        res
          .status(400)
          .json(err);
      } else {
        res
          .status(201)
          .json(post);
      }
    });
  }
};

//Operaciones sobre los posts /post
const createNewPost = async (req: Express.Request, res: Express.Response) => {
    // Se obtiene la fecha antes de guardar porque se debe aumentar en 1 el mes ya que
    // se almacena en numeros del 0-11 por defecto
    var tempDate = new Date(req.body.date);
    const post = new Posts({
      title: req.body.title,
      body: req.body.body,
      //TODO: No tengo claro que lo acabe de hacer bien
      date: new Date(tempDate.setMonth(tempDate.getMonth() + 1)),
      publisher: req.body.publisher,
    });

    User
      .findById(req.body.publisher)
      .select('posts')
      .exec(async (err: any, user: typeof User) => {
        if (err) {
          res
            .status(400)
            .json(err);
        } else {
            AddPost(req, res, user, post);
        }
      });

};

const AddPost = async function (req: Express.Request, res: Express.Response, user: any, post: any) {
  user.posts.push(
    post._id
  );
  await user.save((err: Express.ErrorRequestHandler, user: any) => {
    if (err) {
      logger.error(err.toString());
      res
        .status(400)
        .json(err);
    }
  });

  post.save((err: Express.ErrorRequestHandler, user: any) => {
    if (err) {
      logger.error(err.toString());
      res
        .status(400)
        .json(err);
    } else {
      res
        .status(201)
        .json(post);
    }
  });
}

const getAllPosts = async (req: Express.Request, res: Express.Response) => {
  res.status(200).send(await Posts.find().exec());
}

const getPostByID = async (req: Express.Request, res: Express.Response) => {
  const id = req.params.id;
  logger.info(`Getting post with id = ${id}`);
  // Obtenemos al usuario de la bd
  const post = await Posts.findById(id).exec();
  if (post != null) {
    res.status(200).json(post);
  } else {
    res.status(404).send();
  }
};

const deletePostByID = async (req: Express.Request, res: Express.Response) => {
  const id = req.params.id;
  logger.info(`Deleting post with uid = ${id}`);
  if(id){
    Posts.findById(id)
    .exec((err: any, post: typeof Posts) => {
      if (err) {
        res
          .status(400)
          .json(err);
      } else {
          doDeletePost(req, res, post, id);
      }
    });
  }
  
} 

const doDeletePost = async function (req: Express.Request, res: Express.Response, post: any ,id:any) {
  User
  .findByIdAndUpdate(post.publisher, { $pull: { posts: id } })
  .exec(async (err: any, user: any) => {
    if (!user) {
      res
        .status(404)
        .json({ "message": "uid not found"+ post.publisher });
    } else if (err) {
      res
        .status(404)
        .json(err);
    }
    if (user.posts && user.posts.length > 0) {
      const postRef = user.posts.includes(id);
      if (!postRef) {
        res
          .status(404)
          .json({
            "message": "postId not found"
          });
      } else {
        // En este caso el post pertenece al user y se elimina
        // Delete post from posts collection
        await Posts.findByIdAndDelete(id).exec();

        user.save((err: any, post : typeof User) => {
          if (err) {
            res
              .status(404)
              .json(err);
          } else {
            res
              .status(204)
              .json("Ok");
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
}

export default {
  getPosts,
  postsCreate,
  readOnePost,
  deleteOnePost,
  createNewPost,
  getAllPosts,
  getPostByID,
  deletePostByID,
}