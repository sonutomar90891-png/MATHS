-- OnlyMaths: leads captured from the website
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  full_name     text not null check (char_length(full_name) between 2 and 100),
  email         text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone         text check (phone is null or char_length(phone) between 7 and 20),
  student_class text,                       -- e.g. Class 11, Class 12
  goal          text,                       -- e.g. JEE, Boards
  interest      text,                       -- course or topic they asked about
  message       text check (message is null or char_length(message) <= 2000),
  source        text not null default 'website', -- contact form, hero CTA, course page…
  page_url      text,
  status        text not null default 'new'
                check (status in ('new','contacted','qualified','enrolled','lost')),
  notes         text,
  constraint leads_contact_required check (email is not null or phone is not null)
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- Row Level Security: the public website may only INSERT; nobody anonymous can read leads.
alter table public.leads enable row level security;

drop policy if exists "Website can submit leads" on public.leads;
create policy "Website can submit leads"
  on public.leads for insert
  to anon, authenticated
  with check (status = 'new' and notes is null);

drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
  on public.leads for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
  on public.leads for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

revoke all on public.leads from anon;
grant insert (full_name, email, phone, student_class, goal, interest, message, source, page_url) on public.leads to anon;
