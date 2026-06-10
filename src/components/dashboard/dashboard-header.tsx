import { LogoutButton } from "./logout-button";

type DashboardHeaderProps = {
  email: string;
};

export function DashboardHeader({ email }: DashboardHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            EagerMinds
          </p>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Bookmarks
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <p className="hidden text-sm text-zinc-600 sm:block dark:text-zinc-400">{email}</p>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
