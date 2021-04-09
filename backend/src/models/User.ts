import logger from '@poppinss/fancy-logs';
import Mongoose, {Schema} from 'mongoose';
import {PetitionsSchema} from './Petitions'
import {PostsSchema} from './Posts'

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
    petitions: [PetitionsSchema],
    posts: [PostsSchema]
    
})

export{bannedSchema}
export default Mongoose.model("User", userSchema);

logger.info("Modelo User creado");