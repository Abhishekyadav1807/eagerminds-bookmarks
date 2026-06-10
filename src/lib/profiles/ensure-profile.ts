import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { buildBootstrapHandle } from "./handle";

type EnsureProfileResult = { error: string } | { success: true };

function isHandleNotNullError(message: string): boolean {
  return message.includes('null value in column "handle"');
}

export async function ensureUserProfileForUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: User
): Promise<EnsureProfileResult> {
  const { data: existingProfile, error: lookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (lookupError) {
    return { error: lookupError.message };
  }

  if (existingProfile) {
    return { success: true };
  }

  const email = user.email ?? "";

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    email,
  });

  if (!insertError) {
    return { success: true };
  }

  if (insertError.code === "23505") {
    return { success: true };
  }

  // Some databases still require handle NOT NULL. Use a unique bootstrap handle
  // that the user can replace on the dashboard.
  if (isHandleNotNullError(insertError.message)) {
    const { error: retryError } = await supabase.from("profiles").insert({
      id: user.id,
      email,
      handle: buildBootstrapHandle(user.id),
    });

    if (!retryError) {
      return { success: true };
    }

    if (retryError.code === "23505") {
      return { success: true };
    }

    return { error: retryError.message };
  }

  return { error: insertError.message };
}

export async function ensureCurrentUserProfile(): Promise<EnsureProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to create a profile." };
  }

  return ensureUserProfileForUser(supabase, user);
}
