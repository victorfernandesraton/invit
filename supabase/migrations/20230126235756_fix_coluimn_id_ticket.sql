alter table "public"."ticket" alter column "id" set default uuid_generate_v4();

alter table "public"."ticket" alter column "id" drop identity;

alter table "public"."ticket" alter column "id" set data type uuid using "id"::uuid;

create policy "Enable insert for authenticated users only"
on "public"."ticket"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."ticket"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."ticket"
as permissive
for update
to authenticated
with check (true);



