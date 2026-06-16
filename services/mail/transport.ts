import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({
  path: "../../config/.env",
});

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: true,
    },
} as any);

export default transport;