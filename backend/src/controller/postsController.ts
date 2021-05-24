import logger from '@poppinss/fancy-logs';
import Express from 'express';
import Posts from '../models/Posts';
import Comments from '../models/Comments';
import User from '../models/User';
import mongoose from 'mongoose';
import emailService from '../service/emailService';

interface UserInfo {
  userId: string;
  userName: string;
}

interface PostsWithUsername {
  _id: String;
  title: String;
  body: String;
  date: Date;
  publisher: UserInfo;
  comments: Comment;
  possitive_valorations: [String];
  negative_valorations: [String];
}

interface CommentsWithUsername {
  _id: String;
  publisher: UserInfo;
  date: Date;
  body: String;
}

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

          let userPosts = await Posts.find({
            _id: {
              $in: postsId
            }
          });

          const userInfo: UserInfo = {
            userId: user._id,
            userName: user.name
          }

          userPosts = userPosts.map((p: any) => p.publisher = userInfo);
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
            const userInfo: UserInfo = {
              userId: user._id,
              userName: user.name
            }
            post.publisher = userInfo;
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


const deleteOnePost = async (req: Express.Request, res: Express.Response) => {
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

            user.save((err: any, post: typeof User) => {
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
      date: new Date(tempDate.setMonth(tempDate.getMonth())),
      publisher: userId,
    });

    user.posts.push(
      post._id
    );

    user.save((err: Express.ErrorRequestHandler, user: any) => {
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
    date: new Date(tempDate.setMonth(tempDate.getMonth())),
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
        _addPost(req, res, user, post);
      }
    });

};

//Función privada
const _addPost = async function (req: Express.Request, res: Express.Response, user: any, post: any) {
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
  try {
    const posts = await Posts.find().exec();
    const data: PostsWithUsername[] = [];
    if (posts && posts.length > 0) {
      (posts as any[]).forEach(async (post: any) => {
        const user = await User.findById(post.publisher).exec();
        if (user) {
          const userInfo: UserInfo = {
            userId: user._id,
            userName: user.name
          }
          data.push({
            _id: post._id,
            title: post.title,
            body: post.body,
            date: post.date,
            publisher: userInfo,
            comments: post.comments,
            possitive_valorations: post.possitive_valorations,
            negative_valorations: post.negative_valorations,

          });
        }
        // Debemos hacer esto ya que sino se devuelve el array antes de cargar la info
        if (data.length == (posts as any[]).length) {
          res.status(200).json(data);
        }
      });
    } else {
      // Se devuelve un 200 con un array de posts vacio
      res.status(200).json([]);
    }
  } catch (err) {
    res
      .status(400)
      .json(err);
  }
}

const getPostByID = async (req: Express.Request, res: Express.Response) => {
  const id = req.params.id;
  logger.info(`Getting post with id = ${id}`);
  // Obtenemos al usuario de la bd
  if (req.params && id) {
    try {
      const post = await Posts.findById(id).exec();

      if (post != null) {
        const user = await User.findById(post.publisher).exec();
        if (user) {
          const userInfo: UserInfo = {
            userId: user._id,
            userName: user.name
          }
          const result: PostsWithUsername = {
            _id: post._id,
            title: post.title,
            body: post.body,
            date: post.date,
            publisher: userInfo,
            comments: post.comments,
            possitive_valorations: post.possitive_valorations,
            negative_valorations: post.negative_valorations,
          }
          res
            .status(200)
            .json(result);
        } else {
          res
            .status(404)
            .json({ "message": "user's post not found" })
        }
      } else {
        // Petition not found
        res
          .status(404)
          .json({
            error: `Post with id = ${id} doesn't exist`
          });
      }

    } catch (err) {
      res
        .status(400)
        .json(err);
    }
  } else {
    res
      .status(404)
      .json({
        "message": "Not found, id is required"
      });
  }
};

const deletePostByID = async (req: Express.Request, res: Express.Response) => {
  const id = req.params.id;
  logger.info(`Deleting post with uid = ${id}`);
  if (id) {
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

const doDeletePost = async function (req: Express.Request, res: Express.Response, post: any, id: any) {
  User
    .findByIdAndUpdate(post.publisher, { $pull: { posts: id } })
    .exec(async (err: any, user: any) => {
      if (!user) {
        res
          .status(404)
          .json({ "message": "uid not found" + post.publisher });
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

          user.save((err: any, post: typeof User) => {
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

//Funciones de comentarios en posts

const getComments = async (req: Express.Request, res: Express.Response) => {
  const id = req.params.id;
  if (req.params && id) {
    try {
      const post = await Posts.findById(id).exec();
      const comments = post.comments;
      const data: CommentsWithUsername[] = [];
      if (comments) {
        (comments as any[]).forEach(async (comment: any) => {
          const user = await User.findById(comment.publisherId).exec();
          if (user) {
            const userInfo: UserInfo = {
              userId: user._id,
              userName: user.name
            }
            data.push({
              _id: comment._id,
              body: comment.body,
              date: comment.date,
              publisher: userInfo,
            });
          }
          // Debemos hacer esto ya que sino se devuelve el array antes de cargar la info
          if (data.length == (comments as any[]).length) {
            res.status(200).json(data);
          }
        });
      }
    } catch (err) {
      res
        .status(400)
        .json(err);
    }
  }
}

const createComment = async (req: Express.Request, res: Express.Response) => {
  // Get query params
  const postId = req.params.id;
  logger.info(`Creando objeto de comentario para post = ${postId}`);
  if (postId != null) {
    const post = await Posts
      .findById(postId)
      .exec();
    if (post == null) {
      res.status(400).json({
        error: "El post no existe"
      });
    } else {
      _doAddCommentObj(req, res, post);
    }
  } else {
    res
      .status(404)
      .json({
        message: 'id query param is required'
      });
  }
};

// Private methods
const _doAddCommentObj = async (req: Express.Request, res: Express.Response, post: any) => {
  try {
    if (!post) {
      res
        .status(404)
        .json({
          message: "userId not found"
        });
    } else {
      const user = await User.findById(post.publisher).exec();
      const userWhoComment = await User.findById(req.body.publisherId).exec();
      console.log(post);
      if (user) {
        await emailService.sendSomeoneCommentedPost(user, post, userWhoComment);
      }
      var tempDate = new Date(req.body.date);
      const comment = new Comments({
        body: req.body.body,
        //TODO: No tengo claro que lo acabe de hacer bien
        date: new Date(tempDate.setMonth(tempDate.getMonth())),
        publisherId: req.body.publisherId,
      });

      post.comments.push(
        comment
      );

      post.save((err: Express.ErrorRequestHandler, user: any) => {
        if (err) {
          logger.error(err.toString());
          res
            .status(400)
            .json(err);
        }
      });

      comment.save((err: Express.ErrorRequestHandler, user: any) => {
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
  } catch (err) {
    logger.error("ERROR!" + err);

    res
      .status(400)
      .json(err);
  }

};

const getCommentById = async (req: Express.Request, res: Express.Response) => {
  const cid = req.params.cid;
  const comment = await Comments.findById(cid).exec();
  if (comment != null) {
    res.status(200).json(comment);
  } else {
    res.status(404).json({
      error: `Comment with id = ${cid} doesn't exist`
    })
  }
}

const deleteCommentById = async (req: Express.Request, res: Express.Response) => {
  if (req.params && req.params.id && req.params.cid) {
    Posts
      .findByIdAndUpdate(req.params.id, { $pull: { comments: req.params.cid } })
      .exec(async (err: any, post: any) => {
        if (!post) {
          res
            .status(404)
            .json({ "message": "id not found" });
        } else if (err) {
          res
            .status(404)
            .json(err);
        }
        if (post.comments && post.comments.length > 0) {
          // En este caso el post pertenece al user y se elimina
          // Delete post from posts collection
          await Comments.findByIdAndDelete(req.params.cid).exec();
          post.save((err: any, post: typeof User) => {
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
          //TODO: Eliminar del post
        }
      });
  } else {
    res
      .status(404)
      .json({
        "message": "Not found, id and cid are both required"
      });
  }
}

//Valoraciones positivas
const getPositiveValoration = async (req: Express.Request, res: Express.Response) => {
  const id = req.params.id;
  const post = await Posts.findById(id).exec();
  if (post != null) {
    res.status(200).json(post.possitive_valorations);
  } else {
    res.status(404).json({
      error: `Post with id = ${id} doesn't exist`
    })
  }
}

const addPositiveValoration = async (req: Express.Request, res: Express.Response) => {
  const id = req.params.id;
  const post = await Posts.findById(id).exec();
  if (post != null) {
    const userRef = post.possitive_valorations.includes(req.body.userId);
    if (!userRef) {
      post.possitive_valorations.push(
        req.body.userId
      );
      if (post.negative_valorations.includes(req.body.userId)) {
        post.negative_valorations.pull(
          req.body.userId
        );
      }
      post.save((err: Express.ErrorRequestHandler, user: any) => {
        if (err) {
          logger.error(err.toString());
          res
            .status(400)
            .json(err);
        } else {
          res
            .status(200)
            .json(req.body.userId);
        }
      });
    } else {
      res
        .status(204)
        .json({ "message": "Repetida valoración" });
    }
  } else {
    res.status(404).json({
      error: `Post with id = ${id} doesn't exist`
    })
  }
}

const deletePositiveValoration = async (req: Express.Request, res: Express.Response) => {
  const id = req.params.id;
  const post = await Posts.findById(id).exec();
  if (post != null) {
    const userRef = post.possitive_valorations.includes(req.body.userId);
    if (userRef) {
      post.possitive_valorations.pull(
        req.body.userId
      );
      post.save((err: Express.ErrorRequestHandler, user: any) => {
        if (err) {
          logger.error(err.toString());
          res
            .status(400)
            .json(err);
        } else {
          res
            .status(200)
            .json(req.body.userId);
        }
      });
    } else {
      res
        .status(204)
        .json({ "message": "No existe valoración" });
    }
  } else {
    res.status(404).json({
      error: `Post with id = ${id} doesn't exist`
    })
  }
}

//Valoraciones negativas
const getNegativeValoration = async (req: Express.Request, res: Express.Response) => {
  const id = req.params.id;
  const post = await Posts.findById(id).exec();
  if (post != null) {
    res.status(200).json(post.negative_valorations);
  } else {
    res.status(404).json({
      error: `Post with id = ${id} doesn't exist`
    })
  }
}



const addNegativeValoration = async (req: Express.Request, res: Express.Response) => {
  const id = req.params.id;
  const post = await Posts.findById(id).exec();
  if (post != null) {
    const userRef = post.negative_valorations.includes(req.body.userId);
    if (!userRef) {
      post.negative_valorations.push(
        req.body.userId
      );
      if (post.possitive_valorations.includes(req.body.userId)) {
        post.possitive_valorations.pull(
          req.body.userId
        );
      }
      post.save((err: Express.ErrorRequestHandler, user: any) => {
        if (err) {
          logger.error(err.toString());
          res
            .status(400)
            .json(err);
        } else {
          res
            .status(200)
            .json(req.body.userId);
        }
      });
    } else {
      res
        .status(204)
        .json({ "message": "Repetida valoración" });
    }
  } else {
    res.status(404).json({
      error: `Post with id = ${id} doesn't exist`
    })
  }
}

const deleteNegativeValoration = async (req: Express.Request, res: Express.Response) => {
  const id = req.params.id;
  const post = await Posts.findById(id).exec();
  if (post != null) {
    const userRef = post.negative_valorations.includes(req.body.userId);
    if (userRef) {
      post.negative_valorations.pull(
        req.body.userId
      );
      post.save((err: Express.ErrorRequestHandler, user: any) => {
        if (err) {
          logger.error(err.toString());
          res
            .status(400)
            .json(err);
        } else {
          res
            .status(200)
            .json(req.body.userId);
        }
      });
    } else {
      res
        .status(204)
        .json({ "message": "No existe valoración" });
    }
  } else {
    res.status(404).json({
      error: `Post with id = ${id} doesn't exist`
    })
  }
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
  getComments,
  createComment,
  getCommentById,
  deleteCommentById,
  getPositiveValoration,
  addPositiveValoration,
  deletePositiveValoration,
  getNegativeValoration,
  addNegativeValoration,
  deleteNegativeValoration,
}