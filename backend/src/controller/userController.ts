import logger from '@poppinss/fancy-logs';
import Express from 'express';
import User, { bannedSchema } from '../models/User';

const createNewUser = async (req: Express.Request, res: Express.Response) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    sanitaryZone: req.body.sanitaryZone,
    password: req.body.password,
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
          .json(0);
      }
    });
  }
};

export default {
  getAllUsers,
  createNewUser,
  getUserByUID,
  deleteUserByUID,
  banUser
}