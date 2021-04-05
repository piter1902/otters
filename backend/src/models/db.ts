import logger from '@poppinss/fancy-logs';
import Mongoose from 'mongoose';

// URI de la bd de desarrollo
let dbURI: string = 'mongodb://localhost/pruebaExpress';
if (process.env.PRODUCTION === "true") {
    dbURI = process.env.MONGO_URI!.toString();
    logger.info(`DB URI: ${dbURI}`);
}

// Conexión a la base de datos
Mongoose.connect(dbURI, {useUnifiedTopology: true, useNewUrlParser: true});

// Event Handlers
Mongoose.connection.on('connected', () => {
    logger.success(`Mongoose connected to ${dbURI}`);
});
Mongoose.connection.on('error', err => {
    logger.error('Mongoose connection error:', err);
});
Mongoose.connection.on('disconnected', () => {
    logger.info('Mongoose disconnected');
});

const gracefulShutdown = (msg: string, callback: () => (void)) => {
    Mongoose.connection.close(() => {
        logger.success(`Mongoose disconnected through ${msg}`);
        callback();
    });
};

// For nodemon restarts                                 
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});

// Model import
import "./User";
import "./SanitaryZone";
import "./Petitions";