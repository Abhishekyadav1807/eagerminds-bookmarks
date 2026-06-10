import { AddBookmarkForm } from "@/components/dashboard/add-bookmark-form";
import { BookmarkList } from "@/components/dashboard/bookmark-list";
import { ProfileHandleForm } from "@/components/dashboard/profile-handle-form";
import { getClaimedHandle } from "@/lib/profiles/handle";
import { getSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";
import type { Bookmark } from "@/types/bookmark";
import type { Profile } from "@/types/profile";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data, error }, { data: profile }] = await Promise.all([
    supabase
      .from("bookmarks")
      .select("id, user_id, title, url, is_public")
      .order("id", { ascending: false }),
    user
      ? supabase
          .from("profiles")
          .select("id, email, handle, created_at")
          .eq("id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const bookmarks = (data ?? []) as Bookmark[];
  const currentProfile = profile as Profile | null;
  const claimedHandle = getClaimedHandle(currentProfile?.handle);
  const siteUrl = await getSiteUrl();
  const publicProfileUrl = claimedHandle ? `${siteUrl}/${claimedHandle}` : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Your bookmarks
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Save and organize links you want to revisit.
          </p>
        </div>
      </div>

      <ProfileHandleForm
        currentHandle={claimedHandle}
        publicProfileUrl={publicProfileUrl}
      />

      <AddBookmarkForm />

      <section id="bookmarks-list" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-50">
            Saved bookmarks
          </h3>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {bookmarks.length} {bookmarks.length === 1 ? "item" : "items"}
          </span>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300"
          >
            Failed to load bookmarks: {error.message}
          </p>
        ) : (
          <BookmarkList bookmarks={bookmarks} />
        )}
      </section>
    </div>
  );
}
