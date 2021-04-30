import logger from '@poppinss/fancy-logs';
import Express from 'express';
import Petition from '../models/Petitions';
import User from '../models/User';
import mongoose, { mongo } from 'mongoose';

// Evitamos mensaje de warning de deprecated
mongoose.set('useFindAndModify', false);

const petitionsCreate = (req: Express.Request, res: Express.Response) => {
  // Get query params
  const userId = req.body.userId;
  logger.info(`Creando nueva peticion para user = ${userId}`);
  // Se comprueba que exista el usuario indicado ya que en caso contrario
  // no tiene sentido crear la petition
  if (userId) {
    User
      .findById(userId)
      .select('petitions')
      .exec((err: any, user: typeof User) => {
        if (err) {
          res
            .status(400)
            .json(err);
        } else {
          _doAddPetition(req, res, user);
        }
      });
  } else {
    res
      .status(404)
      .json({
        message: 'userId body param is required'
      });
  }
};

// Obtiene las peticiones de un usuario en concreto
const getUserPetitions = (req: Express.Request, res: Express.Response) => {
  const userId = req.params.uid;
  logger.info(`Obteniendo peticiones de user = ${userId}`);
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
        if (user.petitions && user.petitions.length > 0) {
          // Source: https://stackoverflow.com/questions/32264225/how-to-get-multiple-document-using-array-of-mongodb-id
          var petitionsId = user.petitions.map(function (ele: any) {
            return mongoose.Types.ObjectId(ele);
          });

          let userPetitions = await Petition.find({
            _id: {
              $in: petitionsId
            }
          });

          res
            .status(200)
            .json(userPetitions);

        } else {
          res
            .status(404)
            .json({
              "message": "No petitions found"
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

// Obtiene todas las peticiones
const getPetitions = async (req: Express.Request, res: Express.Response) => {
  await Petition.find().exec((err: Express.ErrorRequestHandler, petitions: any) => {
    if (err) {
      res
        .status(400)
        .json(err);
    } else {
      res
        .status(200)
        .json(petitions);
    }
  });

}

const readOnePetition = async (req: Express.Request, res: Express.Response) => {
  // Get query param
  const petId = req.params.petitionId;

  if (req.params && petId) {
    try {
      const petition = await Petition.findById(petId).exec();

      if (petition != null) {
        res
          .status(200)
          .json(petition);
      } else {
        // Petition not found
        res
          .status(404)
          .json({
            error: `Petition with id = ${petId} doesn't exist`
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
        "message": "Not found, petitonId is required"
      });
  }

}


const updateOnePetition = async (req: Express.Request, res: Express.Response) => {
  const petId = req.params.petitionId;

  if (req.params && petId) {
    const petition = await Petition.findById(petId).exec();

    // Se obtiene la fecha antes de guardar porque se debe aumentar en 1 el mes ya que
    // se almacena en numeros del 0-11 por defecto
    var tempDate = req.body.targetDate && new Date(req.body.targetDate);

    // Shorted if-else
    petition.title = req.body.title && req.body.title || petition.title;
    petition.body = req.body.body && req.body.body || petition.body;
    petition.targetDate = tempDate && new Date(tempDate.setMonth(tempDate.getMonth() + 1)) || petition.targetDate,
      petition.place = req.body.place && req.body.place || petition.place;
    petition.isUrgent = req.body.isUrgent && req.body.isUrgent || petition.isUrgent;
    petition.status = req.body.status && req.body.status || petition.status;
    petition.save((err: any, petition: typeof Petition) => {
      if (err) {
        res
          .status(404)
          .json(err);
      } else {
        res
          .status(200)
          .json(petition);
      }
    });

  } else {
    res
      .status(404)
      .json({
        "message": "Not found, petitonId is required"
      });
  }
};


const deleteOnePetition = async (req: Express.Request, res: Express.Response) => {
  const petId = req.params.petitionId;

  if (req.params && petId) {
    try {
      // Se busca la peticion para obtener su usuario
      const petition = await Petition.findByIdAndDelete(petId).exec();
      if (petition) {
        // Si se ha eliminado la peticion correctamente, se actualiza la info del usuario
        User.findByIdAndUpdate(petition.userId, { $pull: { petitions: petId } })
          .exec(async (err: any, user: any) => {
            if (err) {
              res
                .status(404)
                .json(err);
            }
          });
        res
          .status(204)
          .json("ok");
      } else {
        // Petition not found
        res.status(404).json({
          error: `Petition with id = ${petId} doesn't exist`
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
        "message": "Not found, petitonId is required"
      });
  }
}

// Private methods
const _doAddPetition = async function (req: Express.Request, res: Express.Response, user: any) {
  if (!user) {
    res
      .status(404)
      .json({
        message: "userId not found"
      });
  } else {

    // Debemos volver a hacer una peticion ya que el objeto 'user' solo tiene campos _id y petitions
    const userInfo = await User.findById(user._id);
    if (userInfo) {
      const userName = userInfo.name;
      // Se obtiene la fecha antes de guardar porque se debe aumentar en 1 el mes ya que
      // se almacena en numeros del 0-11 por defecto
      var tempDate = new Date(req.body.targetDate);
      const petition = new Petition({
        title: req.body.title,
        userInfo: { userId: user._id, userName: userName },
        body: req.body.body,
        place: req.body.place,
        targetDate: new Date(tempDate.setMonth(tempDate.getMonth() + 1)),
        isUrgent: req.body.isUrgent,
        status: 'Created',
        expTime: req.body.expTime
      });
      user.petitions.push(
        petition._id
      );

      // Update user info
      await user.save((err: Express.ErrorRequestHandler, user: any) => {
        if (err) {
          logger.error(err.toString());
          res
            .status(400)
            .json(err);
        }
      });

      // Save petition to mongoDb
      petition.save((err: Express.ErrorRequestHandler, user: any) => {
        if (err) {
          logger.error(err.toString());
          res
            .status(400)
            .json(err);
        } else {
          res
            .status(201)
            .json(petition);
        }
      });
    } else {
      res
        .status(404)
        .json({
          message: "userId not found"
        });
    }
  }
};

export default {
  getUserPetitions,
  getPetitions,
  petitionsCreate,
  readOnePetition,
  updateOnePetition,
  deleteOnePetition
}