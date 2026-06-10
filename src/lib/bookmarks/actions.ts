"use server";

import { revalidatePath } from "next/cache";
import { ensureUserProfileForUser } from "@/lib/profiles/ensure-profile";
import { createClient } from "@/lib/supabase/server";
import { bookmarkInputSchema } from "./schema";

type ActionResult = { error: string } | { success: true };

const UNAUTHENTICATED_ERROR = "You must be signed in to manage bookmarks.";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function createBookmark(input: unknown): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { error: UNAUTHENTICATED_ERROR };
  }

  const parsed = bookmarkInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid bookmark data" };
  }

  const profileResult = await ensureUserProfileForUser(supabase, user);
  if ("error" in profileResult) {
    return profileResult;
  }

  const { error } = await supabase.from("bookmarks").insert({
    user_id: user.id,
    title: parsed.data.title,
    url: parsed.data.url,
    is_public: parsed.data.is_public,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateBookmark(
  id: string,
  input: unknown
): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { error: UNAUTHENTICATED_ERROR };
  }

  const parsed = bookmarkInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid bookmark data" };
  }

  const { error } = await supabase
    .from("bookmarks")
    .update({
      title: parsed.data.title,
      url: parsed.data.url,
      is_public: parsed.data.is_public,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteBookmark(id: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { error: UNAUTHENTICATED_ERROR };
  }

  const { error } = await supabase.from("bookmarks").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleBookmarkVisibility(id: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { error: UNAUTHENTICATED_ERROR };
  }

  const { data: bookmark, error: fetchError } = await supabase
    .from("bookmarks")
    .select("is_public")
    .eq("id", id)
    .single();

  if (fetchError) {
    return { error: fetchError.message };
  }

  const { error } = await supabase
    .from("bookmarks")
    .update({ is_public: !bookmark.is_public })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
