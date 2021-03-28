import Express from 'express';
import bodyParser from 'body-parser';
import userRoute from './route/userRoute';
import logger from '@poppinss/fancy-logs';

// Conexión a la bd
import "./models/db";
logger.info("Modelos creados");

// Configuración de Swagger
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load("swagger.yaml");

// Configuración de las variables de entorno
import dotenv from 'dotenv';
dotenv.config({path: __dirname});

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

app.listen(port, () => console.log(`Listening at ${port} 🛠`))