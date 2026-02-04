-- Create the pokemon table
create table public.pokemon (
  id integer primary key,
  name text not null,
  types text[] not null,
  base_stats jsonb not null,
  abilities jsonb not null,
  sprites jsonb not null,
  tier text,
  is_valid boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.pokemon enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access"
  on public.pokemon
  for select
  to anon
  using (true);

-- Create policy to allow service_role write access (for ingestion script)
create policy "Allow service_role full access"
  on public.pokemon
  for all
  to service_role
  using (true)
  with check (true);
