alter table "public"."commitment" drop constraint "commitment_pkey";

drop index if exists "public"."commitment_pkey";

alter table "public"."commitment" drop column "id";

alter table "public"."commitment" add column "id_temp" uuid not null default uuid_generate_v4();

alter table "public"."commitment" alter column "title" set data type text using "title"::text;

CREATE UNIQUE INDEX commitment_id_temp_key ON public.commitment USING btree (id_temp);

CREATE UNIQUE INDEX commitment_pkey ON public.commitment USING btree (id_temp);

alter table "public"."commitment" add constraint "commitment_pkey" PRIMARY KEY using index "commitment_pkey";

alter table "public"."commitment" add constraint "commitment_id_temp_key" UNIQUE using index "commitment_id_temp_key";

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



