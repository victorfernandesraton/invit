alter table "public"."commitment" add column "tenent_id" uuid not null;

alter table "public"."commitment" add constraint "commitment_tenent_id_fkey" FOREIGN KEY (tenent_id) REFERENCES tenent(id) not valid;

alter table "public"."commitment" validate constraint "commitment_tenent_id_fkey";


