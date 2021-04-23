import Express from 'express';
import bodyParser from 'body-parser';
import userRoute from './route/userRoute';
import postRoute from './route/postRoute';
import logger from '@poppinss/fancy-logs';
import petitionsRoute from './route/petitionsRoute';
import sanitaryZoneRoute from './route/sanitaryZoneRoute';
import sanitaryZoneService from './service/sanitaryZoneService';
import cron from 'node-cron';
import cors from 'cors';

// Conexión a la bd
import "./models/db";
logger.info("Modelos creados");

// Configuración de Swagger
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load("swagger.yaml");

// Configuración de las variables de entorno
import dotenv from 'dotenv';

const result = dotenv.config();

// Creación cron
// 6 veces al día (en le minuto 00) se ejecutará el fetch
cron.schedule("0 */6 * * *", async () => {
    logger.success("Cron ejecutandose");
    await sanitaryZoneService.queryDatabaseAndFetchLastData();
    // Busqueda de duplicados
    await sanitaryZoneService.findAndJoinDuplicates();
});

// Express app
const app = Express();

const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS
app.use(cors());

// Swagger JSON
app.use("/api_docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get("/", (req: Express.Request, res: Express.Response) => res.status(200).send("Hello world"));

// Controlador para los usuarios
app.use("/user", userRoute);

// Controlador para los posts
app.use("/post", postRoute);

// Controlador para las zonas sanitarias
app.use("/zone", sanitaryZoneRoute);

// Controlador para las peticiones
app.use("/petitions", petitionsRoute);

app.listen(port, () => console.log(`Listening at ${port} 🛠`))