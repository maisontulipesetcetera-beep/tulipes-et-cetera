import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not configured, skipping email");
    return null;
  }
  return resend.emails.send({
    from: "Tulipes Et Cetera <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
}
