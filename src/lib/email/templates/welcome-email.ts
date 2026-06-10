export type WelcomeEmailTemplateProps = {
  email: string;
  dashboardUrl: string;
  loginUrl: string;
};

export type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

export function welcomeEmailTemplate({
  email,
  dashboardUrl,
  loginUrl,
}: WelcomeEmailTemplateProps): EmailTemplate {
  const subject = "Welcome to EagerMinds Bookmarks";

  const text = [
    "Welcome to EagerMinds Bookmarks!",
    "",
    `Your account (${email}) is ready.`,
    "",
    "Start saving and sharing your favorite links:",
    dashboardUrl,
    "",
    "Sign in anytime here:",
    loginUrl,
    "",
    "Happy bookmarking,",
    "The EagerMinds Team",
  ].join("\n");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${subject}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
                <tr>
                  <td style="padding:32px 32px 16px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;">
                      EagerMinds
                    </p>
                    <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:700;color:#18181b;">
                      Welcome aboard
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 24px;">
                    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3f3f46;">
                      Thanks for signing up for <strong>EagerMinds Bookmarks</strong>.
                      Your account <strong>${email}</strong> is ready to use.
                    </p>
                    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#3f3f46;">
                      Save links, organize your reading list, and share a public profile with the bookmarks you choose to make public.
                    </p>
                    <a
                      href="${dashboardUrl}"
                      style="display:inline-block;background-color:#18181b;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 20px;border-radius:10px;"
                    >
                      Go to your dashboard
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 32px;">
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#71717a;">
                      Already confirmed your email?
                      <a href="${loginUrl}" style="color:#18181b;font-weight:600;text-decoration:underline;">
                        Sign in here
                      </a>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `.trim();

  return { subject, html, text };
}
