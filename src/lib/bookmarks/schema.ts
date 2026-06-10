import { z } from "zod";

export const bookmarkInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
  url: z.url("Enter a valid URL"),
  is_public: z.boolean(),
});

export type BookmarkInput = z.infer<typeof bookmarkInputSchema>;
