import User from "../models/User"
import Express from 'express';
import logger from "@poppinss/fancy-logs";
import bcrypt from 'bcrypt';


const registerUser = async (req: Express.Request, res: Express.Response) => {

  try {
    const user = await User.findOne({ name: req.body.name }).exec();
    if (user != null) {
      res
        .status(400)
        .send("User already exists");
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        sanitaryZone: req.body.sanitaryZone,
        password: hashedPassword,
        bannedObject: { "banned": false },
        isAdmin: false
      });
      // Save to mongoDb
      await newUser.save();
      res
        .status(201)
        .send(newUser);
      logger.info("Creating a new user");
    }
  } catch (err) {
    logger.error("ERROR!" + err);

    res
      .status(400)
      .json(err);
  }


}


export default {
  registerUser
}