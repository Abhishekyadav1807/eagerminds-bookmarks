"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateProfileHandle } from "@/lib/profiles/actions";
import { handleSchema } from "@/lib/profiles/schema";

const profileHandleFormSchema = z.object({
  handle: handleSchema,
});

type ProfileHandleFormValues = z.infer<typeof profileHandleFormSchema>;

type ProfileHandleFormProps = {
  currentHandle: string | null;
  publicProfileUrl: string | null;
};

export function ProfileHandleForm({
  currentHandle,
  publicProfileUrl,
}: ProfileHandleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [savedHandle, setSavedHandle] = useState(currentHandle);
  const [savedProfileUrl, setSavedProfileUrl] = useState(publicProfileUrl);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileHandleFormValues>({
    defaultValues: {
      handle: currentHandle ?? "",
    },
  });

  function onSubmit(values: ProfileHandleFormValues) {
    setFormError(null);

    const parsed = profileHandleFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Invalid handle");
      return;
    }

    startTransition(async () => {
      const result = await updateProfileHandle({ handle: parsed.data.handle });

      if ("error" in result) {
        setFormError(result.error);
        return;
      }

      const nextUrl = `${window.location.origin}/${result.handle}`;

      setSavedHandle(result.handle);
      setSavedProfileUrl(nextUrl);
      router.refresh();
    });
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-50">
        Public profile
      </h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Claim a unique handle to share your public bookmarks.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
        <div className="space-y-2">
          <label
            htmlFor="handle"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Handle
          </label>
          <div className="flex items-center rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            <span className="pl-3 text-sm text-zinc-500 dark:text-zinc-400">@</span>
            <input
              id="handle"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="your_handle"
              className="w-full bg-transparent px-2 py-2 text-sm text-zinc-900 outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-50"
              disabled={isPending}
              {...register("handle")}
            />
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            3–20 characters. Letters, numbers, and underscores only.
          </p>
          {errors.handle && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.handle.message}</p>
          )}
        </div>

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
          {isPending ? "Saving..." : savedHandle ? "Update handle" : "Claim handle"}
        </button>
      </form>

      {savedHandle && savedProfileUrl && (
        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900/50 dark:bg-green-950/40">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            Your public profile is live
          </p>
          <a
            href={savedProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block truncate text-sm text-green-700 underline-offset-4 hover:underline dark:text-green-400"
          >
            {savedProfileUrl}
          </a>
        </div>
      )}
    </section>
  );
}
