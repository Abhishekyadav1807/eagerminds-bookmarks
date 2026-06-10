import type { Bookmark } from "@/types/bookmark";
import { BookmarkCard } from "./bookmark-card";
import { BookmarksPlaceholder } from "./bookmarks-placeholder";

type BookmarkListProps = {
  bookmarks: Bookmark[];
};

export function BookmarkList({ bookmarks }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return <BookmarksPlaceholder />;
  }

  return (
    <ul className="space-y-3">
      {bookmarks.map((bookmark) => (
        <li key={bookmark.id}>
          <BookmarkCard bookmark={bookmark} />
        </li>
      ))}
    </ul>
  );
}
