import logger from '@poppinss/fancy-logs';
import Nodemailer from 'nodemailer';


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

export default {
    sendVerificationEmail
}