import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicBookmarkList } from "@/components/profile/public-bookmark-list";
import { isBootstrapHandle } from "@/lib/profiles/handle";
import { createClient } from "@/lib/supabase/server";
import type { Bookmark } from "@/types/bookmark";

type PublicProfilePageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  const { handle } = await params;

  return {
    title: `@${handle} | EagerMinds Bookmarks`,
    description: `Public bookmarks shared by @${handle}`,
  };
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { handle: rawHandle } = await params;
  const handle = rawHandle.toLowerCase();

  if (isBootstrapHandle(handle)) {
    notFound();
  }

  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, handle")
    .eq("handle", handle)
    .maybeSingle();

  if (profileError || !profile) {
    notFound();
  }

  const { data: bookmarks, error: bookmarksError } = await supabase
    .from("bookmarks")
    .select("id, title, url")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  const publicBookmarks = (bookmarks ?? []) as Pick<Bookmark, "id" | "title" | "url">[];

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              EagerMinds
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              @{profile.handle}
            </h1>
          </div>
          <a
            href="/login"
            className="text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
          >
            Sign in
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 space-y-1">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            Public bookmarks
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Links @{profile.handle} has chosen to share.
          </p>
        </div>

        {bookmarksError ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300"
          >
            Failed to load bookmarks.
          </p>
        ) : (
          <PublicBookmarkList bookmarks={publicBookmarks} />
        )}
      </main>
    </div>
  );
}
