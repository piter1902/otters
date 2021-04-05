import Express from 'express';
import sanitaryZoneController from '../controller/sanitaryZoneController';

// Create route
const sanitaryZoneRoute = Express.Router();

// Routes
sanitaryZoneRoute.route("/")
    .get(sanitaryZoneController.getAllSanitaryZones);

sanitaryZoneRoute.route("/fetchData")
    .get(sanitaryZoneController.fetchRemoteData);

sanitaryZoneRoute.route("/:id")
    .get(sanitaryZoneController.getZoneById);

sanitaryZoneRoute.route("/:id/data")
    .get(sanitaryZoneController.getDataZone);


export default sanitaryZoneRoute;