import logger from '@poppinss/fancy-logs';
import Mongoose, { Schema } from 'mongoose';

const CommentsSchema = new Schema({
    publisherId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    body: {
        type: String,
        required: true
    }
});

export { CommentsSchema };
export default Mongoose.model('Comments', CommentsSchema);