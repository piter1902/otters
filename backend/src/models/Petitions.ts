import logger from '@poppinss/fancy-logs';
import Mongoose, { Schema } from 'mongoose';


const UserInfoSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
});

const PetitionsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    // TODO: Se puede modificar la longitud
    body: {
        type: String,
        maxLength: 150,
        required: true
    },
    userInfo: {
        type: UserInfoSchema,
        required: true
    },
    targetDate: {
        type: Date,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    isUrgent: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        required: true
    },
    // TODO: En principio no debería ser obliagtorio
    expTime: {
        type: String
    }
});

export { PetitionsSchema };
export default Mongoose.model('Petitions', PetitionsSchema);

logger.info("Modelo Petitions created");
