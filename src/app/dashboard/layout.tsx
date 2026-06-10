import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ensureUserProfileForUser } from "@/lib/profiles/ensure-profile";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard | EagerMinds Bookmarks",
  description: "Manage your EagerMinds bookmarks",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await ensureUserProfileForUser(supabase, user);

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-black">
      <DashboardHeader email={user.email ?? "Unknown user"} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
