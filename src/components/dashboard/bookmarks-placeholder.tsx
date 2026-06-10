export function BookmarksPlaceholder() {
  return (
    <section className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-950">
      <div className="mx-auto max-w-sm space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
          <svg
            aria-hidden="true"
            className="h-6 w-6 text-zinc-500 dark:text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
          </svg>
        </div>
        <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-50">
          No bookmarks yet
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Add your first bookmark using the form above.
        </p>
      </div>
    </section>
  );
}
