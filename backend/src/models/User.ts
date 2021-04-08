import logger from '@poppinss/fancy-logs';
import Mongoose, {Schema} from 'mongoose';
import {PetitionsSchema} from './Petitions';
import {PostsSchema} from './Posts';


const userSchema = new Schema({
    name: String,
    years: Number,
    petitions: [PetitionsSchema],
    posts: [PostsSchema]
})


export default Mongoose.model("User", userSchema);

logger.info("Modelo User creado");