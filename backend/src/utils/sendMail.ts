import nodemailer from "nodemailer";
import env from "../config/env";

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.email_user,
    pass: env.email_pass,
  },
});

export const sendMail = async ({
  to,
  subject,
  html,
}: SendMailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"FlowDesk" <${env.email_user}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};