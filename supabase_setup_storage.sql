-- Create the 'pet-photos' storage bucket
insert into storage.buckets (id, name, public)
values ('pet-photos', 'pet-photos', true)
on conflict (id) do nothing;

-- Enable Row Level Security (RLS) on objects table (usually enabled by default)
alter table storage.objects enable row level security;

-- Policy to allow public read access to the bucket
create policy "Public Access to Pet Photos"
on storage.objects for select
using ( bucket_id = 'pet-photos' );

-- Policy to allow authenticated users to upload images
create policy "Authenticated Users can Upload Pet Photos"
on storage.objects for insert
with check ( bucket_id = 'pet-photos' and auth.role() = 'authenticated' );

-- Policy to allow users to update their own images (or any authenticated user for now, consistent with app logic)
create policy "Authenticated Users can Update Pet Photos"
on storage.objects for update
using ( bucket_id = 'pet-photos' and auth.role() = 'authenticated' );

-- Policy to allow users to delete their own images (or any authenticated user for now)
create policy "Authenticated Users can Delete Pet Photos"
on storage.objects for delete
using ( bucket_id = 'pet-photos' and auth.role() = 'authenticated' );
