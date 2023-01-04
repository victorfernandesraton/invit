alter table "public"."commitment" alter column "id" set default uuid_generate_v4();

alter table "public"."commitment" alter column "id" drop identity;

alter table "public"."commitment" alter column "id" set data type uuid using "id"::uuid;

create policy "Enable insert for authenticated users only"
on "public"."commitment"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."commitment"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."commitment"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable select for users based on user_id"
on "public"."profile"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."tenent"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."tenent"
as permissive
for select
to authenticated
using (true);



