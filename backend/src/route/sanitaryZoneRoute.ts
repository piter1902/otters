import Express from 'express';
import passport from 'passport';
import sanitaryZoneController from '../controller/sanitaryZoneController';

// Create route
const sanitaryZoneRoute = Express.Router();

// Routes
sanitaryZoneRoute.route("/")
    .get(sanitaryZoneController.getAllSanitaryZones);

sanitaryZoneRoute.route("/fetchData")
    .get(passport.authenticate('jwt', { session: false }), sanitaryZoneController.fetchRemoteData);

sanitaryZoneRoute.route("/aragon")
    .get(passport.authenticate('jwt', { session: false }), sanitaryZoneController.getAragonZone);

sanitaryZoneRoute.route("/aragon/data")
    .get(passport.authenticate('jwt', { session: false }), sanitaryZoneController.getAragonZoneData);

sanitaryZoneRoute.route("/:id")
    .get(passport.authenticate('jwt', { session: false }), sanitaryZoneController.getZoneById);

sanitaryZoneRoute.route("/:id/data")
    .get(passport.authenticate('jwt', { session: false }), sanitaryZoneController.getDataZone);


export default sanitaryZoneRoute;