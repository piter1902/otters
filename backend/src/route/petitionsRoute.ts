import Express from 'express';
import passport from 'passport';
import petitionsController from '../controller/petitionsController';

// Create route
const petitionsRoute = Express.Router();

// All petitions
petitionsRoute.route("/")
    .get(petitionsController.getPetitions)
    .post(passport.authenticate('jwt', { session: false }), petitionsController.petitionsCreate);

// Especific petitionx
petitionsRoute.route("/:petitionId")
    .get(petitionsController.readOnePetition)
    .put(passport.authenticate('jwt', { session: false }), petitionsController.updateOnePetition)
    .delete(passport.authenticate('jwt', { session: false }), petitionsController.deleteOnePetition);

petitionsRoute.route("/:petitionId/assign/:uid")
    .put(passport.authenticate('jwt', { session: false }), petitionsController.assignUserPetition);

petitionsRoute.route("/:petitionId/cancel/:uid")
    .put(passport.authenticate('jwt', { session: false }), petitionsController.cancelAssignUserPetition);
    

export default petitionsRoute;