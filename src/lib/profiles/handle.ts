import { handleSchema } from "./schema";

const BOOTSTRAP_HANDLE_PATTERN = /^u[0-9a-f]{19}$/;

export function normalizeHandle(handle: string): string {
  return handle.trim().toLowerCase();
}

export function buildBootstrapHandle(userId: string): string {
  return `u${userId.replace(/-/g, "").slice(0, 19)}`;
}

export function isBootstrapHandle(handle: string | null | undefined): boolean {
  if (!handle) {
    return false;
  }

  return BOOTSTRAP_HANDLE_PATTERN.test(handle);
}

export function getClaimedHandle(handle: string | null | undefined): string | null {
  if (!handle || isBootstrapHandle(handle)) {
    return null;
  }

  return handle;
}

export function parseHandleInput(input: unknown) {
  if (typeof input !== "object" || input === null || !("handle" in input)) {
    return handleSchema.safeParse("");
  }

  const rawHandle = (input as { handle: unknown }).handle;
  if (typeof rawHandle !== "string") {
    return handleSchema.safeParse("");
  }

  return handleSchema.safeParse(normalizeHandle(rawHandle));
}
