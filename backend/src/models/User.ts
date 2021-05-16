import logger from '@poppinss/fancy-logs';
import Mongoose, { Schema } from 'mongoose';

const bannedSchema = new Schema({
    banned: {
        type: Boolean,
        default: false,
        required: false
    },
    bannedUntil: {
        type: Date,
        required: false
    },
});

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    sanitaryZone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bannedObject: {
        type: bannedSchema,
        required: false,
    },
    strikes: {
        type: Number,
        default: 0,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true
    },
    // En cuenta de almacenar toda la petition dentro de usuario, 
    // se almacena solo su Id
    petitions: [String],
    // En cuenta de almacenar todo el post dentro de usuario, 
    // se almacena solo su Id
    posts: [String]

})

export { bannedSchema }
export default Mongoose.model("User", userSchema);

logger.info("Modelo User creado");