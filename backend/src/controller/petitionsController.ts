import logger from '@poppinss/fancy-logs';
import Express from 'express';
import Petition from '../models/Petitions';
import User from '../models/User';

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
          _doAddPetition(req, res, user);
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
        if (user.petitions && user.petitions.length > 0) {
          const petitions = user.petitions;
          res
            .status(200)
            .json(petitions);
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
        if (user.petitions && user.petitions.length > 0) {
          const petition = user.petitions.id(req.params.petitionId);
          if (!petition) {
            res
              .status(404)
              .json({
                "message": "petitionId not found"
              });
          } else {
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
        if (user.petitions && user.petitions.length > 0) {
          const petition = user.petitions.id(req.params.petitionId);
          if (!petition) {
            res
              .status(404)
              .json({
                "message": "petitionId not found"
              });
          } else {
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
            user.save((err: any, petition: typeof User) => {
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


const deleteOnePetition = (req: Express.Request, res: Express.Response) => {
  if (req.params && req.params.uid && req.params.petitionId) {
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
        if (user.petitions && user.petitions.length > 0) {
          const petition = user.petitions.id(req.params.petitionId);
          if (!petition) {
            res
              .status(404)
              .json({
                "message": "petitionId not found"
              });
          } else {
            user.petitions.id(req.params.petitionId).remove();
            user.save((err: any, petition: typeof User) => {
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
const _doAddPetition = function (req: Express.Request, res: Express.Response, user: any) {
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
    user.petitions.push({
      title: req.body.title,
      body: req.body.body,
      place: req.body.place,
      targetDate: new Date(tempDate.setMonth(tempDate.getMonth() + 1)),
      isUrgent: req.body.isUrgent,
      status: 'Created'
    });
    user.save((err: Express.ErrorRequestHandler, user: any) => {
      if (err) {
        logger.error(err.toString());
        res
          .status(400)
          .json(err);
      } else {
        let thisPetition = user.petitions[user.petitions.length - 1];
        res
          .status(201)
          .json(thisPetition);
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