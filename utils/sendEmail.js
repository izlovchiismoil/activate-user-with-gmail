import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    await transporter.sendMail({
        from: {
            name: "Jafa Energy",
            address: process.env.EMAIL_USER,
        },
        to,
        subject,
        html
    });
};
