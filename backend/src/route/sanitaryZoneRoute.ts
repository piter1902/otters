import Express from 'express';
import sanitaryZoneController from '../controller/sanitaryZoneController';

// Create route
const sanitaryZoneRoute = Express.Router();

// Routes
sanitaryZoneRoute.route("/")
    .get(sanitaryZoneController.getAllSanitaryZones);

sanitaryZoneRoute.route("/:id")
    .get(sanitaryZoneController.getZoneById);

export default sanitaryZoneRoute;