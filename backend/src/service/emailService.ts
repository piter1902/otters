import logger from '@poppinss/fancy-logs';
import Nodemailer from 'nodemailer';
import userController from '../controller/userController';


const sendVerificationEmail = async (user: any) => {
    const transporter = Nodemailer.createTransport({
        //pool: true,
        port: 465,
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
            user: process.env.EMAIL_USER!,
            pass: process.env.EMAIL_PASS!
        }
    })
    logger.info("Sending verification email to " + user.email);
    await transporter.sendMail({
        from: process.env.EMAIL_USER!,
        to: user.email,
        subject: "Email verification",
        html: `
            <div>
                <p>
                    Hello! <br>
                    Verify your email address on <a href="${process.env.BACK_URI ?? "http://localhost:8080"}/auth/verifyUser?id=${user._id}">this link</a> <br>
                    Thank you!
                </p>
            </div>
        `
    });
}

const sendSomeoneAssignedPetition = async (user:any, petition: any) => {
    const transporter = Nodemailer.createTransport({
        //pool: true,
        port: 465,
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
            user: process.env.EMAIL_USER!,
            pass: process.env.EMAIL_PASS!
        }
    })
    await transporter.sendMail({
        from: process.env.EMAIL_USER!,
        to: user.email,
        subject: "Someone has been assigned to your petition",
        html: `
            <div>
                <p>
                    Hello! <br>
                    Someone has been assigned to your petition <a href="${process.env.BACK_URI ?? "http://localhost:3000"}/peticionDetalle/${petition._id}">${petition.title}</a> <br>
                </p>
            </div>
        ` //TODO: Hacerlo con la variable de frontend de heroku
    });
}

const sendSomeoneCommentedPost = async (user:any, post: any) => {
    const transporter = Nodemailer.createTransport({
        //pool: true,
        port: 465,
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
            user: process.env.EMAIL_USER!,
            pass: process.env.EMAIL_PASS!
        }
    })
    await transporter.sendMail({
        from: process.env.EMAIL_USER!,
        to: user.email,
        subject: "Someone has commented your post",
        html: `
            <div>
                <p>
                    Hello! <br>
                    Someone has commented your post <a href="${process.env.BACK_URI ?? "http://localhost:3000"}/postDetalle/${post._id}">${post.title}</a> <br>
                </p>
            </div>
        ` //TODO: Hacerlo con la variable de frontend de heroku
    });
}

const fromQueueToAssigned = async (user:any, petition: any) => {
    const transporter = Nodemailer.createTransport({
        //pool: true,
        port: 465,
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
            user: process.env.EMAIL_USER!,
            pass: process.env.EMAIL_PASS!
        }
    })
    await transporter.sendMail({
        from: process.env.EMAIL_USER!,
        to: user.email,
        subject: "Someone has commented your post",
        html: `
            <div>
                <p>
                    Hello! <br>
                    You've been promoted and now you are assigned to this petition <a href="${process.env.BACK_URI ?? "http://localhost:3000"}/peticionDetalle/${petition._id}">${petition.title}</a> <br>
                </p>
            </div>
        ` //TODO: Hacerlo con la variable de frontend de heroku
    });
}

export default {
    sendVerificationEmail,
    sendSomeoneAssignedPetition,
    sendSomeoneCommentedPost,
    fromQueueToAssigned
}