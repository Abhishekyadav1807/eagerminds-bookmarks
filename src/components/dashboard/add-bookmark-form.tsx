"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createBookmark } from "@/lib/bookmarks/actions";
import { bookmarkInputSchema } from "@/lib/bookmarks/schema";

type AddBookmarkFormValues = z.infer<typeof bookmarkInputSchema>;

export function AddBookmarkForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddBookmarkFormValues>({
    defaultValues: {
      title: "",
      url: "",
      is_public: false,
    },
  });

  function onSubmit(values: AddBookmarkFormValues) {
    setFormError(null);

    const parsed = bookmarkInputSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Invalid form data");
      return;
    }

    startTransition(async () => {
      const result = await createBookmark(parsed.data);

      if ("error" in result) {
        setFormError(result.error);
        return;
      }

      reset();
      router.refresh();
    });
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-50">
        Add a bookmark
      </h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Save a link to revisit later.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="My favorite article"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
              disabled={isPending}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              URL
            </label>
            <input
              id="url"
              type="url"
              placeholder="https://example.com"
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

        {formError && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300"
          >
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isPending ? "Adding..." : "Add bookmark"}
        </button>
      </form>
    </section>
  );
}
