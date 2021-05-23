import Petitions from "../models/Petitions";





const updateStatusPetitions = async () => {
    
      const petitions = await Petitions.find().exec();
      
        if (petitions) {
            (petitions as any[]).forEach(async (petition: any) => {
            
                if (petition.targetDate < new Date(Date.now()) && petition.status!='COMPLETED' && petition.userIdAsigned!=null) {
                    petition.status = 'COMPLETED';
                    petition.save();
                } else if(petition.targetDate < new Date(Date.now()) && petition.userIdAsigned==null){
                    petition.status = 'CANCELED';
                    petition.save();
                }
            
            });
        }
    
}


export default {
    updateStatusPetitions
}