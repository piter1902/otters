import Express from 'express';
import estadisticasController from '../controller/estadisticasController';

const estadisticasRoute = Express.Router();

estadisticasRoute.get("/", estadisticasController.getEstadisticas);

export default estadisticasRoute;