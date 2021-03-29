import logger from '@poppinss/fancy-logs';
import Mongoose, { Schema } from 'mongoose';

const SanitaryZoneDataSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    possitives: {
        type: Number,
        required: true
    }
});


const SanitaryZoneSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        required: false,
        default: Date.now
    },
    data: [SanitaryZoneDataSchema]
});

export default Mongoose.model('SanitaryZone', SanitaryZoneSchema);

logger.info("Modelo SanitaryZone created");