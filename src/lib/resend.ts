import { Resend } from "resend";
import { welcomeEmailTemplate } from "@/lib/email/templates/welcome-email";
import { getSiteUrl } from "@/lib/site-url";

const WELCOME_EMAIL_SUBJECT = "Welcome to EagerMinds Bookmarks";

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

function getFromEmailAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL ?? "EagerMinds Bookmarks <onboarding@resend.dev>"
  );
}

export type SendWelcomeEmailResult = { success: true } | { success: false };

export async function sendWelcomeEmail(email: string): Promise<SendWelcomeEmailResult> {
  const resend = getResendClient();

  if (!resend) {
    console.error("[resend] RESEND_API_KEY is not configured.");
    return { success: false };
  }

  try {
    const siteUrl = await getSiteUrl();
    const template = welcomeEmailTemplate({
      email,
      dashboardUrl: `${siteUrl}/dashboard`,
      loginUrl: `${siteUrl}/login`,
    });

    const { error } = await resend.emails.send({
      from: getFromEmailAddress(),
      to: email,
      subject: WELCOME_EMAIL_SUBJECT,
      html: template.html,
      text: template.text,
    });

    if (error) {
      console.error("[resend] Failed to send welcome email:", error);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("[resend] Unexpected error sending welcome email:", error);
    return { success: false };
  }
}
