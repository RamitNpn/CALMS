import { Resend } from "resend";
import env from "../config/env";

const resend = new Resend(env.email_pass);

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};

export const sendMail = async ({ to, subject, html }: SendMailOptions) => {
  try {
    const result = await resend.emails.send({
      from: env.email_user || "FlowDesk <onboarding@resend.dev>",
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