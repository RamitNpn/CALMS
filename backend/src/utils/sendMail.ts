import { Resend } from "resend";
import env from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};

export const sendMail = async ({ to, subject, html }: SendMailOptions) => {
  try {
    const result = await resend.emails.send({
      from: env.EMAIL_FROM || "FlowDesk <noreply@mail.flowtest.cornortech.com>",
      to,
      subject,
      html,
    });

    console.log("Email sent via Resend:", result);
    return result;
  } catch (error) {
    console.error("Resend email error:", error);
    throw error;
  }
};