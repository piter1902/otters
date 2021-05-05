import Express from 'express';
import bodyParser from 'body-parser';
import userRoute from './route/userRoute';
import postRoute from './route/postRoute';
import logger from '@poppinss/fancy-logs';
import petitionsRoute from './route/petitionsRoute';
import sanitaryZoneRoute from './route/sanitaryZoneRoute';
import sanitaryZoneService from './service/sanitaryZoneService';
import authRoute from './route/authRoute';
import cron from 'node-cron';
import cors from 'cors';

// Necesario para passport
import passport from 'passport';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import * as passportConfig from './service/passportConfig';

// Conexión a la bd
import "./models/db";
logger.info("Modelos creados");

// Configuración de Swagger
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load("swagger.yaml");

// Configuración de las variables de entorno
import dotenv from 'dotenv';
import Utils from './Utils';
import estadisticasRoute from './route/estadisticasRoute';

const result = dotenv.config();

// Creación cron
// 6 veces al día (en le minuto 00) se ejecutará el fetch
cron.schedule("0 */6 * * *", async () => {
    logger.success("Cron ejecutandose");
    await sanitaryZoneService.queryDatabaseAndFetchLastData();
    // Sleep de 20 segundos para asegurarnos de que se ha hecho el proceso
    await Utils.delay(20000);
    // Busqueda de duplicados
    await sanitaryZoneService.findAndJoinDuplicates();
});

// Express app
const app = Express();

const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS
// La URI admitida varia en funcion de si estamos en produccion
let corsURI: string = 'http://localhost:3000'; // React app location
if (process.env.PRODUCTION === "true") {
    corsURI = process.env.CORS_URI!.toString();
    logger.info(`DB URI: ${corsURI}`);
}

app.use(cors({
    credentials: true
}));

/* -----------------Passport configuration ----------------- */
app.use(expressSession({
    secret: process.env.COOKIES_CODE!,
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser(process.env.COOKIES_CODE))
app.use(passport.initialize());
app.use(passport.session());
/* ----------------- END Passport configuration ----------------- */

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

// Controlador para autenticacion
app.use("/auth", authRoute);

// Controlador para las estadisticas
app.use("/stats", estadisticasRoute);

app.listen(port, () => console.log(`Listening at ${port} 🛠`))