create table "public"."tenent" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "name" character varying not null,
    "status" bigint default '1'::bigint
);


alter table "public"."tenent" enable row level security;

CREATE UNIQUE INDEX tenent_pkey ON public.tenent USING btree (id);

alter table "public"."tenent" add constraint "tenent_pkey" PRIMARY KEY using index "tenent_pkey";


