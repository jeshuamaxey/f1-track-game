create table "public"."daily_results" (
  "created_at" timestamp with time zone not null default now(),
  "date_key" text not null,
  "results" jsonb not null,
  "user_id" uuid not null,
  PRIMARY KEY(date_key, user_id)
);

alter table "public"."daily_results" add constraint "daily_results_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id);

alter table "public"."daily_results" enable row level security;

create policy "Enable insert for users based on their user_id"
  on "public"."daily_results"
  as permissive
  for insert
  to public
  with check ((auth.uid() = user_id));


create policy "Enable select for users based on user_id"
  on "public"."daily_results"
  as permissive
  for select
  to public
  using ((auth.uid() = user_id));