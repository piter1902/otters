import logger from '@poppinss/fancy-logs';
import Mongoose, {Schema} from 'mongoose';


const userSchema = new Schema({
    name: String,
    years: Number
})


export default Mongoose.model("User", userSchema);

logger.info("Modelo User creado");