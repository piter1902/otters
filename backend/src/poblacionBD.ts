import User, { bannedSchema } from './models/User';
import logger from '@poppinss/fancy-logs';
import Petition from './models/Petitions';
import Post from './models/Posts';
import Comments from './models/Comments';
import userPicture from './UserPicture';


const userArrayName:string[] = ["Santiago","Ramon","Cajal"];
const userArraySurname:string[] = ["Perez","Garcia","Moreno"];
const userArrayPass:string[] = [];

const populateDB = async () => {
    var mail;
    for (let i = 0; i < userArrayName.length; i++) {
        for (let j = 0; j < userArraySurname.length; j++) {
        
        mail = userArrayName[i].substring(0,1)+userArraySurname[i].substring(0,1)+"@gmail.com";
        const user = new User({
            name: userArrayName[i]+" "+userArraySurname[j],
            picture: userPicture,
            email: mail,//userArray[i].email,
            sanitaryZone: 1,
            password: "xxxxxxx",
            bannedObject: { "banned": false },
            strikes: 0,
            isAdmin: false,
            petitions: [],
            posts: []
          });
          // Save to mongodb
          await user.save();
          logger.info("Creating a new user");
        }
    }
    const userArray:InstanceType<typeof User>[] = await await User.find().exec();
    var randomUser = Math.floor(Math.random() * (userArray.length ));
    _doAddPetition(userArray[randomUser]);
    randomUser = Math.floor(Math.random() * (userArray.length ));
    _doAddPetition(userArray[randomUser]);
    randomUser = Math.floor(Math.random() * (userArray.length ));
    _doAddPetition(userArray[randomUser]);
    randomUser = Math.floor(Math.random() * (userArray.length ));
    _doAddPetition(userArray[randomUser]);
    randomUser = Math.floor(Math.random() * (userArray.length ));
    _doAddPost(userArray[randomUser]);
    randomUser = Math.floor(Math.random() * (userArray.length ));
    _doAddPost(userArray[randomUser]);
    randomUser = Math.floor(Math.random() * (userArray.length ));
    _doAddPost(userArray[randomUser]);
    randomUser = Math.floor(Math.random() * (userArray.length ));
    _doAddPost(userArray[randomUser]);
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
        targetDate: new Date(tempDate.setMonth(tempDate.getMonth())),
        isUrgent: isUrgent,
        status: 'Created'
    });

    user.petitions.push(
        petition._id
    );

    // Update user info
    //await user.save();

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

    // Update user info
    //await user.save();

    // Save petition to mongoDb
    

    const comment = new Comments({
        body: petBody,
        //TODO: No tengo claro que lo acabe de hacer bien
        date: new Date(tempDate.setMonth(tempDate.getMonth())),
        publisherId: user.id,
    });
    post.comments.push(
        comment
    );

    post.save(); 
    comment.save();
    
    
  };

export default {
    populateDB
}
