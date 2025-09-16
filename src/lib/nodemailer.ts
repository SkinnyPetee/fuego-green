 import nodemailer from "nodemailer";
 
 
 export const nodemailer_transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.DEV_EMAIL_USER,
        pass: process.env.DEV_EMAIL_PASSWORD,
      },
    });