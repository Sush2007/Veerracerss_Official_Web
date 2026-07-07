-- Create pinnacle_moments table
create table public.pinnacle_moments (
  id uuid default gen_random_uuid() primary key,
  year text not null,
  label text not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.pinnacle_moments enable row level security;

-- Create policies for pinnacle_moments table
create policy "Enable read access for all users on pinnacle_moments" on public.pinnacle_moments
  for select using (true);

create policy "Enable insert for authenticated users only on pinnacle_moments" on public.pinnacle_moments
  for insert with check (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only on pinnacle_moments" on public.pinnacle_moments
  for delete using (auth.role() = 'authenticated');

-- Create storage bucket for moment images
insert into storage.buckets (id, name, public) values ('moment-images', 'moment-images', true);

-- Create storage policies for moment-images
create policy "Public Access for moment-images"
  on storage.objects for select
  using ( bucket_id = 'moment-images' );

create policy "Authenticated users can upload moment-images"
  on storage.objects for insert
  with check ( bucket_id = 'moment-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete moment-images"
  on storage.objects for delete
  using ( bucket_id = 'moment-images' and auth.role() = 'authenticated' );
