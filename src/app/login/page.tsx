import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in | EagerMinds Bookmarks",
  description: "Sign in to your EagerMinds bookmarks account",
};

export default function LoginPage() {
  return <LoginForm />;
}
