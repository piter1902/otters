import Express from 'express';
import bodyParser from 'body-parser';
import userRoute from './route/userRoute';
import postRoute from './route/postRoute';
import logger from '@poppinss/fancy-logs';
import petitionsRoute from './route/petitionsRoute';
import sanitaryZoneRoute from './route/sanitaryZoneRoute';
import sanitaryZoneService from './service/sanitaryZoneService';
import petitionsService from './service/petitionService';
import userService from './service/userService';
import authRoute from './route/authRoute';
import cron from 'node-cron';
import cors from 'cors';

// Necesario para passport
import passport from 'passport';
import './service/passportConfig';

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
    logger.success("Cron zonas sanitarias ejecutandose");
    await sanitaryZoneService.queryDatabaseAndFetchLastData();
    // Sleep de 20 segundos para asegurarnos de que se ha hecho el proceso
    await Utils.delay(20000);
    // Busqueda de duplicados
    await sanitaryZoneService.findAndJoinDuplicates();
});

cron.schedule("0 * * * *", async () => {
    logger.success("Cron status peticiones ejecutandose");
    await petitionsService.updateStatusPetitions();
});

cron.schedule("0 0 * * *", async () => {
    logger.success("Cron unban users ejecutandose");
    await userService.unbanUsers();
});

// Express app
const app = Express();

const port = process.env.PORT || 8080;


app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

// CORS
// La URI admitida varia en funcion de si estamos en produccion
let corsURI: string = 'http://localhost:3000'; // React app location
if (process.env.PRODUCTION === "true") {
    corsURI = process.env.CORS_URI!.toString();
    logger.info(`CORS URI: ${corsURI}`);
}

// Configuracion del CORS
app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: ['x-auth-token']
}));

/* -----------------Passport configuration ----------------- */
// app.use(expressSession({
//     secret: process.env.COOKIES_CODE!,
//     resave: true,
//     saveUninitialized: true
// }));

// app.use(cookieParser(process.env.COOKIES_CODE))
app.use(passport.initialize());
// app.use(passport.session());
/* ----------------- END Passport configuration ----------------- */

// Swagger JSON
app.use("/api_docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get("/", (req: Express.Request, res: Express.Response) => res.status(200).send("Hello world"));

// Controlador para los usuarios
app.use("/user", passport.authenticate('jwt', { session: false }), userRoute);

// Controlador para los posts
app.use("/post", passport.authenticate('jwt', { session: false }), postRoute);

// Controlador para las zonas sanitarias
app.use("/zone", sanitaryZoneRoute);

// Controlador para las peticiones
app.use("/petitions", passport.authenticate('jwt', { session: false }), petitionsRoute);

// Controlador para autenticacion
app.use("/auth", authRoute);

// Controlador para las estadisticas
app.use("/stats", passport.authenticate('jwt', { session: false }), estadisticasRoute);

app.listen(port, () => console.log(`Listening at ${port} 🛠`))