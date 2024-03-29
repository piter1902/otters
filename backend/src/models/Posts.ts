import logger from '@poppinss/fancy-logs';
import Mongoose, { Schema } from 'mongoose';
import {CommentsSchema} from './Comments'

const PostsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    publisher: {
        type : String,
        required :true
    },
    comments: [CommentsSchema],
    possitive_valorations: [String],
    negative_valorations: [String]
});

export { PostsSchema };
export default Mongoose.model('Posts', PostsSchema);

logger.info("Model Posts created");