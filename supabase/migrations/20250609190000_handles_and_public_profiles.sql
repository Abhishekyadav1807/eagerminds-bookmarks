-- Handles and public profile pages
-- Run this in the Supabase SQL editor.

-- 1. Allow handle to be unset until the user claims one on the dashboard.
alter table public.profiles
  alter column handle drop not null;

-- 2. Enforce unique handles (multiple NULL values are allowed).
create unique index if not exists profiles_handle_unique
  on public.profiles (handle);

-- 3. Auto-create profile rows on signup without a handle.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- 4. RLS: public visitors can read claimed profiles and public bookmarks.
alter table public.profiles enable row level security;
alter table public.bookmarks enable row level security;

drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read"
  on public.profiles
  for select
  to anon, authenticated
  using (handle is not null);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "bookmarks_public_read" on public.bookmarks;
create policy "bookmarks_public_read"
  on public.bookmarks
  for select
  to anon, authenticated
  using (is_public = true);
