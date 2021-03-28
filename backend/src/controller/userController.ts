import logger from '@poppinss/fancy-logs';
import Express from 'express';
import User from '../models/User';

const createNewUser = (req: Express.Request, res: Express.Response) => {
    const user = new User({
        name: req.body.name,
        years: req.body.years
    });
    res.status(201).send(user);
    // Save to mongodb
    user.save();
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
    if(user != null) {
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
    if(doc !== null) {
        // Se ha eliminado algo
        res.status(200).send("ok");
    } else {
        // No se ha eliminado nada
        res.status(404).json({
            error: `El elemento con uid = ${uid} no existe`
        });
    }
}

export default {
    getAllUsers,
    createNewUser,
    getUserByUID,
    deleteUserByUID
}