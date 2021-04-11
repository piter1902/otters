import logger from '@poppinss/fancy-logs';
import Express from 'express';
import Petition from '../models/Petitions';
import User from '../models/User';
import mongoose, { mongo } from 'mongoose';

// Evitamos mensaje de warning de deprecated
mongoose.set('useFindAndModify', false);

const petitionsCreate = (req: Express.Request, res: Express.Response) => {
  // Get query params
  const userId = req.params.uid;
  logger.info(`Creando nueva peticion para user = ${userId}`);
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
          _doAddPetition(req, res, user, userId);
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

const getPetitions = (req: Express.Request, res: Express.Response) => {
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


const readOnePetition = (req: Express.Request, res: Express.Response) => {
  if (req.params && req.params.uid && req.params.petitionId) {
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
        if (user.petitions && user.petitions.length > 0) {
          const petitionRef = user.petitions.includes(req.params.petitionId);
          if (!petitionRef) {
            res
              .status(404)
              .json({
                "message": "petitionId not found"
              });
          } else {
            const petition = await Petition.findById(req.params.petitionId).exec();
            res
              .status(200)
              .json(petition);
          }
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
        "message": "Not found, uid and petitonId are both required"
      });
  }
}


const updateOnePetition = (req: Express.Request, res: Express.Response) => {
  if (req.params && req.params.uid && req.params.petitionId) {
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
        if (user.petitions && user.petitions.length > 0) {
          const petitionRef = user.petitions.includes(req.params.petitionId);
          if (!petitionRef) {
            res
              .status(404)
              .json({
                "message": "petitionId not found"
              });
          } else {
            const petition = await Petition.findById(req.params.petitionId).exec();

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
            petition.save((err: any, petition: typeof User) => {
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
          }
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
        "message": "Not found, uid and petitonId are both required"
      });
  }
};


const deleteOnePetition = async (req: Express.Request, res: Express.Response) => {
  if (req.params && req.params.uid && req.params.petitionId) {

    User.findByIdAndUpdate(req.params.uid, { $pull: { petitions: req.params.petitionId } })
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
        if (user.petitions && user.petitions.length > 0) {
          const petitionRef = user.petitions.includes(req.params.petitionId);
          if (!petitionRef) {
            res
              .status(404)
              .json({
                "message": "petitionId not found"
              });
          } else {
            // En este caso la petition pertenece al user y se elimina
            // Delete petition from petitions collection
            await Petition.findByIdAndDelete(req.params.petitionId).exec();

            user.save((err: any, user: typeof User) => {
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
              "message": "No petitions found"
            });
        }
      });
  } else {
    res
      .status(404)
      .json({
        "message": "Not found, uid and petitonId are both required"
      });
  }
}

// Private methods
const _doAddPetition = async function (req: Express.Request, res: Express.Response, user: any, userId: String) {
  if (!user) {
    res
      .status(404)
      .json({
        message: "userId not found"
      });
  } else {
    // Se obtiene la fecha antes de guardar porque se debe aumentar en 1 el mes ya que
    // se almacena en numeros del 0-11 por defecto
    var tempDate = new Date(req.body.targetDate);
    const petition = new Petition({
      title: req.body.title,
      userId: userId,
      body: req.body.body,
      place: req.body.place,
      targetDate: new Date(tempDate.setMonth(tempDate.getMonth() + 1)),
      isUrgent: req.body.isUrgent,
      status: 'Created'
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
  }
};

export default {
  getPetitions,
  petitionsCreate,
  readOnePetition,
  updateOnePetition,
  deleteOnePetition
}