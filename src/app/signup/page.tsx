import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign up | EagerMinds Bookmarks",
  description: "Create your EagerMinds bookmarks account",
};

export default function SignupPage() {
  return <SignupForm />;
}
