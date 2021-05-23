import logger from "@poppinss/fancy-logs";
import User from "../models/User";

const unbanUsers = async () => {
    const userArray:InstanceType<typeof User>[] = await await User.find().exec();
    logger.info("unban users ");
    if(userArray){
        
        (userArray as any[]).forEach(async (user: any) => {
            logger.info("user: "+user.name);
            if( user.bannedObject.banned && user.bannedObject.bannedUntil < new Date(Date.now()) ){
                user.bannedObject.banned = false;
                user.bannedObject.bannedUntil = null;
                user.save();
                logger.info("unban: "+user.name);
            }
        });

    }

}


export default {
    unbanUsers
}