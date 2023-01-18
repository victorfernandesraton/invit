alter table "public"."billing" drop column "currency";

alter table "public"."commitment" add column "currency" character varying not null default 'BRL'::character varying;


