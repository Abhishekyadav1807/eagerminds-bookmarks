"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ensureCurrentUserProfile } from "./ensure-profile";
import { normalizeHandle, parseHandleInput } from "./handle";

type ProfileActionResult = { error: string } | { success: true; handle: string };

const UNAUTHENTICATED_ERROR = "You must be signed in to update your profile.";

export async function ensureUserProfile() {
  return ensureCurrentUserProfile();
}

export async function updateProfileHandle(input: unknown): Promise<ProfileActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: UNAUTHENTICATED_ERROR };
  }

  const parsed = parseHandleInput(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid handle" };
  }

  const handle = parsed.data;

  const { data: existingProfile, error: existingError } = await supabase
    .from("profiles")
    .select("id")
    .eq("handle", handle)
    .neq("id", user.id)
    .maybeSingle();

  if (existingError) {
    return { error: existingError.message };
  }

  if (existingProfile) {
    return { error: "This handle is already taken" };
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("handle")
    .eq("id", user.id)
    .maybeSingle();

  const previousHandle = currentProfile?.handle ?? null;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ handle })
    .eq("id", user.id);

  if (updateError) {
    if (updateError.code === "23505") {
      return { error: "This handle is already taken" };
    }

    return { error: updateError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/${handle}`);

  if (previousHandle) {
    revalidatePath(`/${previousHandle}`);
  }

  return { success: true, handle };
}
