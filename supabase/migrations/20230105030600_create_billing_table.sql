create table "public"."billing" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "commitment_id" uuid not null,
    "price" numeric not null default '0'::numeric,
    "remote" boolean not null default true,
    "currency" character varying not null default 'BRL'::character varying,
    "status" bigint not null default '1'::bigint
);


alter table "public"."billing" enable row level security;

CREATE UNIQUE INDEX billing_pkey ON public.billing USING btree (id);

alter table "public"."billing" add constraint "billing_pkey" PRIMARY KEY using index "billing_pkey";

alter table "public"."billing" add constraint "billing_commitment_id_fkey" FOREIGN KEY (commitment_id) REFERENCES commitment(id) not valid;

alter table "public"."billing" validate constraint "billing_commitment_id_fkey";


