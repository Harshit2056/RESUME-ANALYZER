import nodemailer from "nodemailer";

export const getTransporter = () => {
    const user = process.env.EMAIL_USER?.trim();
    const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

    if (!user || !pass) {
        throw new Error(`Missing EMAIL_USER or EMAIL_PASS credentials in backend .env file (EMAIL_USER: "${user || ''}")`);
    }

    return nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user,
            pass
        }
    });
};

export const sendEmail = async ({ to, subject, html }) => {
    const transporter = getTransporter();
    const user = process.env.EMAIL_USER?.trim();

    return await transporter.sendMail({
        from: `"GenAI Resume" <${user}>`,
        to,
        subject,
        html
    });
};

export default sendEmail;