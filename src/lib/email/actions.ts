"use server";

import { z } from "zod";
import { sendWelcomeEmail } from "@/lib/resend";

const welcomeEmailSchema = z.email();

export async function sendWelcomeEmailAction(
  email: string
): Promise<{ success: true } | { success: false }> {
  const parsed = welcomeEmailSchema.safeParse(email);

  if (!parsed.success) {
    console.error("[welcome-email] Invalid email address provided.");
    return { success: false };
  }

  return sendWelcomeEmail(parsed.data);
}
