alter table "public"."commitment" drop constraint "commitment_id_temp_key";

alter table "public"."commitment" drop constraint "commitment_pkey";

drop index if exists "public"."commitment_id_temp_key";

drop index if exists "public"."commitment_pkey";

alter table "public"."commitment" drop column "id_temp";

alter table "public"."commitment" add column "id" uuid not null default uuid_generate_v4();

CREATE UNIQUE INDEX commitment_id_temp_key ON public.commitment USING btree (id);

CREATE UNIQUE INDEX commitment_pkey ON public.commitment USING btree (id);

alter table "public"."commitment" add constraint "commitment_pkey" PRIMARY KEY using index "commitment_pkey";

alter table "public"."commitment" add constraint "commitment_id_temp_key" UNIQUE using index "commitment_id_temp_key";


