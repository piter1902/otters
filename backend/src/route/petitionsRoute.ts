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

petitionsRoute.route("/:petitionId/assign/:uid")
    .put(passport.authenticate('jwt', { session: false }), petitionsController.assignUserPetition);

petitionsRoute.route("/:petitionId/cancel/:uid")
    .put(passport.authenticate('jwt', { session: false }), petitionsController.cancelAssignUserPetition);
    

export default petitionsRoute;