import User, { bannedSchema } from './models/User';
import logger from '@poppinss/fancy-logs';
import Petition from './models/Petitions';
import Post from './models/Posts';
import Comments from './models/Comments';
import SanitaryZone from './models/SanitaryZone';
import userPicture from './UserPicture';
import sanitaryZoneService from './service/sanitaryZoneService';
import bcrypt from 'bcrypt';
import Utils from './Utils';


const userArrayName:string[] = ["Santiago","Ramon","Cajal"];
const userArraySurname:string[] = ["Perez","Garcia","Moreno"];
const userArrayPass:string[] = [];

const populateDB = async () => {
    //Poblar zonas
    await sanitaryZoneService.queryDatabaseAndFetchLastData();
    // Sleep de 20 segundos para asegurarnos de que se ha hecho el proceso
    await Utils.delay(20000);
    // Busqueda de duplicados
    await sanitaryZoneService.findAndJoinDuplicates();

    //Poblar usuarios
    const allZones = await SanitaryZone.find().exec();
    var mail;
    let saveUsers: boolean[] = new Array();
    for (let i = 0; i < userArrayName.length; i++) {
        for (let j = 0; j < userArraySurname.length; j++) {
        saveUsers[i+j]=false;
        mail = userArrayName[i].substring(0,1)+userArraySurname[i].substring(0,1)+"@gmail.com";
        const hashedPassword = await bcrypt.hash("xxxxxx", 10);
        
        const user = new User({
            name: userArrayName[i]+" "+userArraySurname[j],
            picture: userPicture,
            email: mail.toLowerCase(),
            sanitaryZone: allZones[1]._id,
            password: hashedPassword,
            bannedObject:{ "banned": false},  //{ "banned": true, "bannedUntil": new Date(Date.now())  },
            strikes: 0,
            isAdmin: false,
            isVerified: true, 
          });
          // Save to mongodb
          await user.save();
          logger.info("Creating a new user");
        }
    }
    const userArray:InstanceType<typeof User>[] = await await User.find().exec();
    //logger.info("array: "+saveUsers);
    
    //Poblar posts y peticiones
    try{
        var randomUser = Math.floor(Math.random() * (userArray.length ));
        saveUsers[randomUser]=true;
        _doAddPetition(userArray[randomUser]);
        randomUser = Math.floor(Math.random() * (userArray.length ));
        saveUsers[randomUser]=true;
        _doAddPost(userArray[randomUser]);
        randomUser = Math.floor(Math.random() * (userArray.length ));
        saveUsers[randomUser]=true;
        _doAddPetition(userArray[randomUser]);
        randomUser = Math.floor(Math.random() * (userArray.length ));
        saveUsers[randomUser]=true;
        _doAddPost(userArray[randomUser]);
        randomUser = Math.floor(Math.random() * (userArray.length ));
        saveUsers[randomUser]=true;
        _doAddPetition(userArray[randomUser]);
        randomUser = Math.floor(Math.random() * (userArray.length ));
        saveUsers[randomUser]=true;
        _doAddPost(userArray[randomUser]);
        randomUser = Math.floor(Math.random() * (userArray.length ));
        saveUsers[randomUser]=true;
        _doAddPetition(userArray[randomUser]);
        randomUser = Math.floor(Math.random() * (userArray.length ));
        saveUsers[randomUser]=true;
        _doAddPost(userArray[randomUser]);
    }catch (Error)   
    {  
      alert(Error.message);  
    } 

    // Update user info
    for (let i = 0; i < saveUsers.length; i++){
        if(saveUsers[i]){
            //logger.info("user: "+userArray[i].name);
            await userArray[i].save();
        }
    }
    
    //create admin
    const hashedPassword2 = await bcrypt.hash("admin", 10);
    const user = new User({
        name: "admin",
        picture: userPicture,
        email: "admin",
        sanitaryZone: allZones[1]._id,
        password: hashedPassword2,
        bannedObject: { "banned": false },
        strikes: 0,
        isAdmin: true,
        isVerified: true, 
      });
      // Save to mongodb
      await user.save();
      logger.info("Creating admin");
    
    logger.info("DB populated");
    //petitionModel
    //petitionControler.petitionsCreate();
}

const petArrayTitle:string[] = ["Aiuda","Jelp","Hadme la compra","Post numero 12212","Ayuda para pasarme el mario bros"];
const petArrayPlace:string[] = ["San Jose","Las Fuentes","Centro","Calle de la piruleta","San juan 23"];
const petBody:string = "Eam ex integre quaeque bonorum, ea assum solet scriptorem pri. At eius choro sit, possit recusabo corrumpit vim ne.";

const _doAddPetition = async function (user: any) {
    var numTitle = Math.floor(Math.random() * (petArrayTitle.length ));
    var numPlace = Math.floor(Math.random() * (petArrayPlace.length ));
    var urgent = Math.floor(Math.random() * (1 + 1));
    
    if (urgent = 0){
        var isUrgent = true;
    }else {
        var isUrgent = false;
    } 

    var tempDate = new Date();
    const petition = new Petition({
        title: petArrayTitle[numTitle],
        userId: user.id,
        body: petBody,
        place: petArrayPlace[numPlace],
        targetDate: new Date(),
        isUrgent: isUrgent,
        status: 'OPEN',
        expTime: new Date(),
    });

    user.petitions.push(
        petition._id
    );

    // Save petition to mongoDb
    petition.save(); 
    
  };

  const postArrayTitle:string[] = ["Post de prueba","Hoy comi macarrones","Covid T.T", "A tope de covid","Cuando acaba esta wea"];
  const _doAddPost = async function (user: any) {
    var numTitle = Math.floor(Math.random() * (petArrayTitle.length ));
    var urgent = Math.floor(Math.random() * (1 + 1));
    
    if (urgent = 0){
        var isUrgent = true;
    }else {
        var isUrgent = false;
    } 

    var tempDate = new Date();
    const post = new Post({
        title: postArrayTitle[numTitle],
        publisher: user.id,
        body: petBody,
        date: new Date(tempDate.setMonth(tempDate.getMonth()))
    });

    user.posts.push(
        post._id
    );

    

    const comment = new Comments({
        body: petBody,
        //TODO: No tengo claro que lo acabe de hacer bien
        date: new Date(tempDate.setMonth(tempDate.getMonth())),
        publisherId: user.id,
    });
    post.comments.push(
        comment
    );

    // Save petition and comment to mongoDb
    post.save(); 
    comment.save();
    
    
  };

export default {
    populateDB
}
