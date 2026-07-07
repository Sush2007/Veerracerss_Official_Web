-- Create members table
create table public.members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  department text not null,
  image_url text not null,
  linkedin text,
  instagram text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.members enable row level security;

-- Create policies for members table
create policy "Enable read access for all users" on public.members
  for select using (true);

create policy "Enable insert for authenticated users only" on public.members
  for insert with check (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on public.members
  for delete using (auth.role() = 'authenticated');

-- Create storage bucket for member images
insert into storage.buckets (id, name, public) values ('member-images', 'member-images', true);

-- Create storage policies for member-images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'member-images' );

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check ( bucket_id = 'member-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete images"
  on storage.objects for delete
  using ( bucket_id = 'member-images' and auth.role() = 'authenticated' );
