import { z } from "zod";

export const RESERVED_HANDLES = new Set([
  "login",
  "signup",
  "dashboard",
  "api",
  "admin",
  "auth",
]);

export const handleSchema = z
  .string()
  .trim()
  .min(3, "Handle must be at least 3 characters")
  .max(20, "Handle must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed")
  .refine((value) => !RESERVED_HANDLES.has(value.toLowerCase()), {
    message: "This handle is reserved",
  });

export type HandleInput = z.infer<typeof handleSchema>;
