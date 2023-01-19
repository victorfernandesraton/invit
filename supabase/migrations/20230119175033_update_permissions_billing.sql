create policy "Enable update for authenticated users only"
on "public"."billing"
as permissive
for update
to authenticated
with check (true);



