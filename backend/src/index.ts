import Express from 'express';
import bodyParser from 'body-parser';
import userRoute from './route/userRoute';
import logger from '@poppinss/fancy-logs';

// Creación cron
import cron from 'node-cron';
// 6 veces al día (en le minuto 00) se ejecutará el fetch
cron.schedule("* */6 * * *", () => {
    logger.success("Cron ejecutandose");
    sanitaryZoneService.queryDatabaseAndFetchLastData();
});

// Conexión a la bd
import "./models/db";
logger.info("Modelos creados");

// Configuración de Swagger
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load("swagger.yaml");

// Configuración de las variables de entorno
import dotenv from 'dotenv';
import sanitaryZoneRoute from './route/sanitaryZoneRoute';
import sanitaryZoneService from './service/sanitaryZoneService';
dotenv.config({ path: __dirname });

// Express app
const app = Express();

const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Swagger JSON
app.use("/api_docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get("/", (req: Express.Request, res: Express.Response) => res.status(200).send("Hello world"));

// Controlador para los usuarios
app.use("/user", userRoute);

// Controlador para las zonas sanitarias
app.use("/zone", sanitaryZoneRoute);

app.listen(port, () => console.log(`Listening at ${port} 🛠`))