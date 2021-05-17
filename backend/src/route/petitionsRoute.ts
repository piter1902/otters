import Express from 'express';
import petitionsController from '../controller/petitionsController';

// Create route
const petitionsRoute = Express.Router();

// All petitions
petitionsRoute.route("/")
    .get(petitionsController.getPetitions)
    .post(petitionsController.petitionsCreate);

// Especific petitionx
petitionsRoute.route("/:petitionId")
    .get(petitionsController.readOnePetition)
    .put(petitionsController.updateOnePetition)
    .delete(petitionsController.deleteOnePetition);

export default petitionsRoute;