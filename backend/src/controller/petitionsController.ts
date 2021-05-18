import logger from '@poppinss/fancy-logs';
import Express from 'express';
import Petition from '../models/Petitions';
import User from '../models/User';
import mongoose, { mongo } from 'mongoose';
import emailService from "../service/emailService";

// Evitamos mensaje de warning de deprecated
mongoose.set('useFindAndModify', false);

interface UserInfo {
  userId: string;
  userName: string;
}

interface PetitionsWithUsername {
  _id: string;
  title: string;
  body: string;
  userInfo: UserInfo;
  targetDate: Date;
  place: string;
  isUrgent: Boolean;
  status: string;
  expTime: string;
  userIdAsigned: string;
  userQueueAsigned: [string];
}

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
          // TODO: No tiene sentido porque siempre va a ser el mismo user. De momento lo dejo así para que en el front 
          // sea una sola consulta como en el resto de pantallas
          const data: PetitionsWithUsername[] = [];
          (userPetitions as any[]).forEach(async (petition: any) => {
            const userInfo: UserInfo = {
              userId: petition.userId,
              userName: user.name
            }
            data.push({
              _id: petition._id,
              title: petition.title,
              body: petition.body,
              userInfo: userInfo,
              place: petition.place,
              isUrgent: petition.isUrgent,
              status: petition.status,
              targetDate: petition.targetDate,
              expTime: petition.expTime,
              userIdAsigned: petition.userIdAsigned,
              userQueueAsigned: petition.userQueueAsigned
            });// Debemos hacer esto ya que sino se devuelve el array antes de cargar la info
            if (data.length == (userPetitions as any[]).length) {
              res.status(200).json(data);
            }
          });


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

// Obtiene todas las peticiones acompañadas del username de su propietario
const getPetitions = async (req: Express.Request, res: Express.Response) => {

  try {
    const petitions = await Petition.find().exec();
    const data: PetitionsWithUsername[] = [];
    if (petitions.length > 0) {
      (petitions as any[]).forEach(async (petition: any) => {
        const user = await User.findById(petition.userId).exec();
        if (user) {
          const userInfo: UserInfo = {
            userId: user._id,
            userName: user.name
          }
          data.push({
            _id: petition._id,
            title: petition.title,
            body: petition.body,
            userInfo: userInfo,
            place: petition.place,
            isUrgent: petition.isUrgent,
            status: petition.status,
            targetDate: petition.targetDate,
            expTime: petition.expTime,
            userIdAsigned: petition.userIdAsigned,
            userQueueAsigned: petition.userQueueAsigned
          });
        }
        // Debemos hacer esto ya que sino se devuelve el array antes de cargar la info
        if (data.length == (petitions as any[]).length) {
          res.status(200).json(data);
        }
      });
    } else {
      // Un poco redundante ya que petitions no tiene elementos. 
      // En caso de no hacerlo, no se devolveria nada en la petición en caso de no existir elementos
      res.status(200).json(petitions);
    }
  } catch (err) {
    res
      .status(400)
      .json(err);
  }

}

const readOnePetition = async (req: Express.Request, res: Express.Response) => {
  // Get query param
  const petId = req.params.petitionId;

  if (req.params && petId) {
    try {
      const petition = await Petition.findById(petId).exec();

      if (petition != null) {
        const user = await User.findById(petition.userId).exec();
        if (user) {
          const userInfo: UserInfo = {
            userId: user._id,
            userName: user.name
          }
          const result: PetitionsWithUsername = {
            _id: petition._id,
            title: petition.title,
            body: petition.body,
            userInfo: userInfo,
            place: petition.place,
            isUrgent: petition.isUrgent,
            status: petition.status,
            targetDate: petition.targetDate,
            expTime: petition.expTime,
            userIdAsigned: petition.userIdAsigned,
            userQueueAsigned: petition.userQueueAsigned
          }
          res
            .status(200)
            .json(result);
        } else {
          res
            .status(404)
            .json({ "message": "user's petition not found" })
        }
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

const assignUserPetition = async (req: Express.Request, res: Express.Response) => {
  
  try{
    const petId = req.params.petitionId;

    if (req.params && petId) {
      const petition = await Petition.findById(petId).exec();

      if(req.params.uid != petition.userIdAsigned && !petition.userQueueAsigned.includes(req.params.uid) && req.params.uid != petition.userIdAsigned){
        if(petition.userIdAsigned == null){
          petition.userIdAsigned = req.params.uid;
          petition.status = 'ASSIGNED';
          const user = await User.findById(petition.userId).exec();
          const userAssigned = await User.findById(req.params.uid).exec();
          if(user){
            await emailService.sendSomeoneAssignedPetition(user,petition,userAssigned);
            await emailService.userAssignedPetition(userAssigned, petition, user);
          }
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
        } else{
          if (petition.userQueueAsigned.length < 5){
            petition.userQueueAsigned.push(req.params.uid);
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
          }else{
            res
              .status(400)
              .json({
                "message": "Cola llena"
              });
          }
        }
      } else{
        res
              .status(400)
              .json({
                "message": "Usuario ya está registrado"
              });
      }
      

    } else {
      res
        .status(404)
        .json({
          "message": "Not found, petitonId is required"
        });
    }
} catch (err) {
  logger.error("ERROR!" + err);

  res
    .status(400)
    .json(err);
}
};

const cancelAssignUserPetition = async (req: Express.Request, res: Express.Response) => {
  const petId = req.params.petitionId;

  if (req.params && petId) {
    const petition = await Petition.findById(petId).exec();

    if((petition.userIdAsigned == req.params.uid) && (petition.userQueueAsigned.length > 0)){
      petition.userIdAsigned = petition.userQueueAsigned[0];
      petition.userQueueAsigned.shift();
      const user = await User.findById(petition.userIdAsigned).exec();
      const userHelped = await User.findById(petition.userId).exec();
          if(user){
            await emailService.fromQueueToAssigned(user,petition, userHelped);
          }
    } else if (petition.userIdAsigned == req.params.uid){
      petition.userIdAsigned = null;
      petition.status = 'OPEN';
    } else{
      for( var i = 0; i < petition.userQueueAsigned.length; i++){ 
        if ( petition.userQueueAsigned[i] === req.params.uid) { 
          petition.userQueueAsigned.splice(i, 1); 
        }
      }
    }

  
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
    // Se obtiene la fecha antes de guardar porque se debe aumentar en 1 el mes ya que
    // se almacena en numeros del 0-11 por defecto
    var tempDate = new Date(req.body.targetDate);
    const petition = new Petition({
      title: req.body.title,
      userId: req.body.userId,
      body: req.body.body,
      place: req.body.place,
      targetDate: new Date(tempDate.setMonth(tempDate.getMonth() + 1)),
      isUrgent: req.body.isUrgent,
      status: 'OPEN',
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
  }
};

export default {
  getUserPetitions,
  getPetitions,
  petitionsCreate,
  readOnePetition,
  updateOnePetition,
  deleteOnePetition,
  assignUserPetition,
  cancelAssignUserPetition
}