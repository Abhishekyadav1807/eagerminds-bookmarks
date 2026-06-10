"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  deleteBookmark,
  toggleBookmarkVisibility,
  updateBookmark,
} from "@/lib/bookmarks/actions";
import { bookmarkInputSchema } from "@/lib/bookmarks/schema";
import type { Bookmark } from "@/types/bookmark";

type BookmarkFormValues = z.infer<typeof bookmarkInputSchema>;

type BookmarkCardProps = {
  bookmark: Bookmark;
};

function VisibilityBadge({ isPublic }: { isPublic: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isPublic
          ? "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300"
          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      }`}
    >
      {isPublic ? "Public" : "Private"}
    </span>
  );
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookmarkFormValues>({
    defaultValues: {
      title: bookmark.title,
      url: bookmark.url,
      is_public: bookmark.is_public,
    },
  });

  function onSubmit(values: BookmarkFormValues) {
    setActionError(null);

    const parsed = bookmarkInputSchema.safeParse(values);
    if (!parsed.success) {
      setActionError(parsed.error.issues[0]?.message ?? "Invalid form data");
      return;
    }

    startTransition(async () => {
      const result = await updateBookmark(bookmark.id, parsed.data);

      if ("error" in result) {
        setActionError(result.error);
        return;
      }

      setIsEditing(false);
      router.refresh();
    });
  }

  function handleCancelEdit() {
    reset({
      title: bookmark.title,
      url: bookmark.url,
      is_public: bookmark.is_public,
    });
    setActionError(null);
    setIsEditing(false);
  }

  function handleToggleVisibility() {
    setActionError(null);

    startTransition(async () => {
      const result = await toggleBookmarkVisibility(bookmark.id);

      if ("error" in result) {
        setActionError(result.error);
        return;
      }

      router.refresh();
    });
  }

  function handleDelete() {
    const confirmed = window.confirm(`Delete "${bookmark.title}"?`);
    if (!confirmed) {
      return;
    }

    setActionError(null);

    startTransition(async () => {
      const result = await deleteBookmark(bookmark.id);

      if ("error" in result) {
        setActionError(result.error);
        return;
      }

      router.refresh();
    });
  }

  if (isEditing) {
    return (
      <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor={`title-${bookmark.id}`}
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Title
              </label>
              <input
                id={`title-${bookmark.id}`}
                type="text"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                disabled={isPending}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`url-${bookmark.id}`}
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                URL
              </label>
              <input
                id={`url-${bookmark.id}`}
                type="url"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                disabled={isPending}
                {...register("url")}
              />
              {errors.url && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.url.message}</p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
              disabled={isPending}
              {...register("is_public")}
            />
            Make this bookmark public
          </label>

          {actionError && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300"
            >
              {actionError}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isPending}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-50">
              {bookmark.title}
            </h3>
            <VisibilityBadge isPublic={bookmark.is_public} />
          </div>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
          >
            {bookmark.url}
          </a>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            disabled={isPending}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleToggleVisibility}
            disabled={isPending}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            {isPending
              ? "Updating..."
              : bookmark.is_public
                ? "Make private"
                : "Make public"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/50"
          >
            Delete
          </button>
        </div>
      </div>

      {actionError && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300"
        >
          {actionError}
        </p>
      )}
    </article>
  );
}
