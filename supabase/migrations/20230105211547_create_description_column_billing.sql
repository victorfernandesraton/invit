alter table "public"."billing" add column "description" text not null;

create policy "Enable insert for authenticated users only"
on "public"."billing"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."billing"
as permissive
for select
to authenticated
using (true);



