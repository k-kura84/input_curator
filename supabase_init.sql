-- Supabase 初期設定用 SQLスクリプト (発行日: 2026-03-27)
-- UUID 拡張機能の有効化
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. profiles テーブル (認証用 auth.users を拡張するプロファイル)
-- -----------------------------------------------------------------------------
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  display_name text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS設定
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using ( auth.uid() = id );
create policy "Users can update own profile" on public.profiles for update using ( auth.uid() = id );

-- 新規サインアップ時に自動で profiles レコードを作成するトリガー
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- -----------------------------------------------------------------------------
-- 2. categories テーブル (ユーザーが作成するインプットの分類)
-- -----------------------------------------------------------------------------
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.categories enable row level security;
create policy "Users can CRUD own categories" on public.categories for all using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 3. sources テーブル (RSSフィードなどの情報取得元)
-- -----------------------------------------------------------------------------
create table public.sources (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  category_id uuid references public.categories on delete set null,
  name text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.sources enable row level security;
create policy "Users can CRUD own sources" on public.sources for all using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 4. feed_items テーブル (ソースから取得した個別の記事・投稿)
-- -----------------------------------------------------------------------------
create table public.feed_items (
  id uuid default uuid_generate_v4() primary key,
  source_id uuid references public.sources on delete cascade not null,
  title text not null,
  link text not null,
  content text,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
-- feed_items は、関連する sources の所有者（user_id）であれば CRUD 可能
alter table public.feed_items enable row level security;
create policy "Users can modify feed items via sources" on public.feed_items
  for all using (
    exists (select 1 from public.sources s where s.id = feed_items.source_id and s.user_id = auth.uid())
  );

-- -----------------------------------------------------------------------------
-- 5. user_selections テーブル (スワイプ選定結果の記録)
-- -----------------------------------------------------------------------------
create table public.user_selections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  feed_item_id uuid references public.feed_items on delete cascade not null,
  status text check (status in ('keep', 'discard', 'pending')) not null default 'pending',
  comment text,
  is_exported boolean default false, -- エクスポート済みかどうかのフラグ
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique (user_id, feed_item_id) -- 1ユーザーにつき1記事の判定は1つのみ
);
alter table public.user_selections enable row level security;
create policy "Users can CRUD own selections" on public.user_selections for all using (auth.uid() = user_id);
