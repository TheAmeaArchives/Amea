import { Resend } from "resend";
import { env } from "../config/env.js";

function getRequiredEmailEnvValue(key: "RESEND_API_KEY" | "RESEND_FROM_EMAIL"): string {
  const value = env[key];
  if (!value) {
    throw new Error(`${key} is required for email delivery.`);
  }
  return value;
}

const resend = new Resend(getRequiredEmailEnvValue("RESEND_API_KEY"));
const resendFromEmail = getRequiredEmailEnvValue("RESEND_FROM_EMAIL");

export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<void> {
  const response = await resend.emails.send({
    from: resendFromEmail,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });

  if (response.error) {
    throw new Error(response.error.message || "Failed to send email.");
  }
}
