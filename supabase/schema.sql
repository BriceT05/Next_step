-- Next Step.sn — schéma de la base Supabase
-- À coller dans Supabase > SQL Editor, puis « Run ». Le script peut être relancé sans risque.
--
-- Sécurité (RLS) :
--   - le site public lit les photos, les articles et les partenaires ;
--   - le site public peut seulement AJOUTER une demande (formulaires), jamais lire les demandes ;
--   - toutes les écritures de l'admin passent par le serveur avec la clé service_role, qui ignore le RLS.

-- ── Photos & vidéos ─────────────────────────────────────────
create table if not exists public.gallery_items (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  sub         text not null default '',
  tag         text not null default '',   -- titre du projet ou nom du domaine (voir src/lib/content.ts)
  image_url   text not null default '',
  video_url   text,
  created_at  timestamptz not null default now()
);

-- ── Actualités ──────────────────────────────────────────────
create table if not exists public.news_articles (
  id              uuid primary key default gen_random_uuid(),
  category        text not null default 'Actualité',
  category_color  text not null default '#55636A',
  title           text not null,
  excerpt         text not null default '',
  date            text not null default '',   -- en toutes lettres, ex. « 9 mai 2026 »
  author          text not null default '',
  read_time       text not null default '',
  image_url       text not null default '',
  created_at      timestamptz not null default now()
);

-- ── Partenaires ─────────────────────────────────────────────
create table if not exists public.partners (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  full_name   text not null default '',
  logo_url    text not null default '',
  website     text,
  created_at  timestamptz not null default now()
);

-- ── Équipe (bureau et domaines) ─────────────────────────────
-- Un adjoint se rattache à son titulaire par parent_id. Sans domaine, le membre fait partie du bureau.
create table if not exists public.team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  post        text not null default '',
  role        text not null default 'membre' check (role in ('titulaire', 'adjoint', 'membre')),
  parent_id   uuid references public.team_members (id) on delete set null,
  domain_slug text,                       -- slug du domaine (voir src/app/data/domains.ts), vide = bureau
  photo_url   text not null default '',
  bio         text not null default '',
  quote       text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ── Demandes envoyées par les formulaires du site ───────────
create table if not exists public.submissions (
  id          uuid primary key default gen_random_uuid(),
  role        text not null,   -- inscription | benevole | partenaire | contact | reve
  name        text not null default '',
  email       text not null default '',
  phone       text,
  message     text,
  created_at  timestamptz not null default now()
);

create index if not exists gallery_items_created_at_idx on public.gallery_items (created_at desc);
create index if not exists news_articles_created_at_idx on public.news_articles (created_at desc);
create index if not exists submissions_created_at_idx on public.submissions (created_at desc);

-- ── RLS ─────────────────────────────────────────────────────
alter table public.gallery_items enable row level security;
alter table public.news_articles enable row level security;
alter table public.partners      enable row level security;
alter table public.submissions   enable row level security;
alter table public.team_members  enable row level security;

drop policy if exists "lecture publique" on public.gallery_items;
create policy "lecture publique" on public.gallery_items for select to anon, authenticated using (true);

drop policy if exists "lecture publique" on public.news_articles;
create policy "lecture publique" on public.news_articles for select to anon, authenticated using (true);

drop policy if exists "lecture publique" on public.partners;
create policy "lecture publique" on public.partners for select to anon, authenticated using (true);

drop policy if exists "lecture publique" on public.team_members;
create policy "lecture publique" on public.team_members for select to anon, authenticated using (true);

-- Les visiteurs peuvent envoyer une demande, avec des tailles raisonnables, mais pas les lire.
drop policy if exists "envoi depuis le site" on public.submissions;
create policy "envoi depuis le site" on public.submissions for insert to anon, authenticated
  with check (
    role in ('inscription', 'benevole', 'partenaire', 'contact', 'reve')
    and char_length(name) <= 200
    and char_length(email) <= 200
    and char_length(coalesce(phone, '')) <= 40
    and char_length(coalesce(message, '')) <= 5000
  );

-- ── Stockage des fichiers (photos, vidéos, logos) ───────────
-- Bucket public : les fichiers sont lisibles par leur URL ; les envois passent par /api/upload (clé service_role).
insert into storage.buckets (id, name, public)
values ('nextstep-media', 'nextstep-media', true)
on conflict (id) do update set public = true;
