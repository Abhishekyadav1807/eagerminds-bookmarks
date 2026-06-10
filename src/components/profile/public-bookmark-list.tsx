import type { Bookmark } from "@/types/bookmark";

type PublicBookmark = Pick<Bookmark, "id" | "title" | "url">;

type PublicBookmarkListProps = {
  bookmarks: PublicBookmark[];
};

export function PublicBookmarkList({ bookmarks }: PublicBookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No public bookmarks yet.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {bookmarks.map((bookmark) => (
        <li key={bookmark.id}>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-50">
              {bookmark.title}
            </h2>
            <p className="mt-1 truncate text-sm text-zinc-600 dark:text-zinc-400">
              {bookmark.url}
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}
