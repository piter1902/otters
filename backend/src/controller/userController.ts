import logger from '@poppinss/fancy-logs';
import Express from 'express';
import User, { bannedSchema } from '../models/User';
import bcrypt from 'bcrypt';
import userPicture from '../UserPicture';

const createNewUser = async (req: Express.Request, res: Express.Response) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  
  const user = new User({
    name: req.body.name,
    picture: userPicture,
    email: req.body.email,
    sanitaryZone: req.body.sanitaryZone,
    password: hashedPassword,
    bannedObject: { "banned": false },
    strikes: req.body.strikes,
    isAdmin: req.body.isAdmin,
    petitions: req.body.petitions,
    posts: req.body.posts
  });
  // Save to mongodb
  await user.save();
  res.status(201).send(user);
  logger.info("Creating a new user");
};

const getAllUsers = async (req: Express.Request, res: Express.Response) => {
  res.status(200).send(await User.find().exec());
}

const getUserByUID = async (req: Express.Request, res: Express.Response) => {
  const uid = req.params.uid;
  logger.info(`Getting user with uid = ${uid}`);
  // Obtenemos al usuario de la bd
  const user = await User.findById(uid).exec();
  if (user != null) {
    res.status(200).json(user);
  } else {
    res.status(404).send();
  }
};

const deleteUserByUID = async (req: Express.Request, res: Express.Response) => {
  const uid = req.params.uid;
  logger.info(`Deleting user with uid = ${uid}`);
  // Eliminamos el objeto con el modelo
  const doc = await User.findByIdAndDelete(uid).exec();
  if (doc !== null) {
    // Se ha eliminado algo
    res.status(200).send("ok");
  } else {
    // No se ha eliminado nada
    res.status(404).json({
      error: `El elemento con uid = ${uid} no existe`
    });
  }
}

const banUser = async (req: Express.Request, res: Express.Response) => {
  // Get query params
  const userId = req.params.uid;
  logger.info(`Creando objeto de ban para user = ${userId}`);
  if (userId != null) {
    const user = await User
      .findById(userId)
      .select('bannedObject')
      .exec();
    if (user == null) {
      res.status(400).json({
        error: "El usuario no existe"
      });
    } else {
      _doAddBannedObj(req, res, user);
    }
  } else {
    res
      .status(404)
      .json({
        message: 'uid query param is required'
      });
  }
};

// Private methods
const _doAddBannedObj = (req: Express.Request, res: Express.Response, user: any) => {
  if (!user) {
    res
      .status(404)
      .json({
        message: "userId not found"
      });
  } else {
    user.bannedObject.banned = req.body.banned;
    user.bannedObject.bannedUntil = req.body.bannedUntil;
    //user.strikes= user.strikes+1;
    user.save((err: Express.ErrorRequestHandler, user: any) => {
      if (err) {
        logger.error(err.toString());
        res
          .status(400)
          .json(err);
      } else {
        //let thisPetition = user.petitions[user.petitions.length - 1];
        res
          .status(201)
          .json(user);
      }
    });
  }
};

const updateUser = async (req: Express.Request, res: Express.Response) => {
  const userId = req.params.uid;
  const pass = req.body.password;
  const pic = req.body.picture;
  const zone = req.body.sanitaryZone;
  logger.info(`Actualizando informacion para user = ${userId}`);
  logger.info(`New pass = ${pass}`);
  logger.info(`New pic = ${pic}`);
  logger.info(`New zone = ${zone}`);
  if (req.params && userId) {
    const user = await User.findById(userId).exec();

    // Shorted if-else
    user.password = req.body.password && req.body.password || user.password;
    user.picture = req.body.picture && req.body.picture || user.picture;
    user.sanitaryZone = req.body.sanitaryZone && req.body.sanitaryZone || user.sanitaryZone;
    
    //user.password = (req.body.password) ? req.body.password : user.password;
    //user.picture = req.body.picture && req.body.picture || user.picture;
    //user.sanitaryZone = req.body.sanitaryZone && req.body.sanitaryZone || user.sanitaryZone;
    user.save((err: any, user: typeof User) => {
      if (err) {
        res
          .status(404)
          .json(err);
      } else {
        res
          .status(200)
          .json(user);
      }
    });

  } else {
    res
      .status(404)
      .json({
        "message": "Not found, userId is required"
      });
  }
};

export default {
  getAllUsers,
  createNewUser,
  getUserByUID,
  deleteUserByUID,
  updateUser,
  banUser
}