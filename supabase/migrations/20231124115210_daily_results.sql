create table "public"."daily_results" (
  "created_at" timestamp with time zone not null default now(),
  "date_key" text not null,
  "guesses" jsonb not null,
  "user_id" uuid not null,
  PRIMARY KEY(date_key, user_id)
);

alter table "public"."daily_results" add constraint "daily_results_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id);

alter table "public"."daily_results" enable row level security;

create policy "Enable operations for users based on their user_id"
  on "public"."daily_results"
  for all
  using (auth.uid() = user_id)