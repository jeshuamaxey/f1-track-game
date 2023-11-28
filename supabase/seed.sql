DO $$ 
  DECLARE test_user_id CONSTANT uuid DEFAULT '5899f99d-a449-4bfa-8769-19c097aaf1f5';
  DECLARE test_user_email CONSTANT text DEFAULT 'test@email.com';

BEGIN

-- test user
INSERT INTO auth.users (instance_id,id,aud,"role",email,encrypted_password,email_confirmed_at,last_sign_in_at,raw_app_meta_data,raw_user_meta_data,is_super_admin,created_at,updated_at,phone,phone_confirmed_at,confirmation_token,email_change,email_change_token_new,recovery_token) VALUES
	('00000000-0000-0000-0000-000000000000'::uuid,'5899f99d-a449-4bfa-8769-19c097aaf1f5'::uuid,'authenticated','authenticated', test_user_email ,'$2a$10$PznXR5VSgzjnAp7T/X7PCu6vtlgzdFt1zIr41IqP0CmVHQtShiXxS','2022-02-11 21:02:04.547','2022-02-11 22:53:12.520','{"provider": "email", "providers": ["email"]}','{}',FALSE,'2022-02-11 21:02:04.542','2022-02-11 21:02:04.542',NULL,NULL,'','','','');
INSERT INTO auth.identities (id,user_id,identity_data,provider,last_sign_in_at,created_at,updated_at) VALUES
	('5899f99d-a449-4bfa-8769-19c097aaf1f5','5899f99d-a449-4bfa-8769-19c097aaf1f5'::uuid,'{"sub": "5899f99d-a449-4bfa-8769-19c097aaf1f5"}','email','2022-02-11 21:02:04.545','2022-02-11 21:02:04.545','2022-02-11 21:02:04.545');

INSERT INTO public.daily_results (date_key, user_id, guesses)
VALUES
  ('2023-11-23', '5899f99d-a449-4bfa-8769-19c097aaf1f5'::uuid, '[{
    "option": {
      "name": "Suzuka",
      "value": "japan_suzuka",
      "emoji": "🌸",
      "flag": "🇯🇵",
      "correct": true
    },
    "elapsed": 6441,
    "percentComplete": 0.21
  },
  {
    "option": {
      "name": "Zandvoort Circuit",
      "value": "netherlands",
      "emoji": "🧇",
      "flag": "🇳🇱",
      "correct": true
    },
    "elapsed": 3635,
    "percentComplete": 0.12
  },
  {
    "option": {
      "name": "Sochi Autodrom",
      "value": "russia",
      "emoji": "🇷🇺",
      "flag": "🇷🇺",
      "correct": true
    },
    "elapsed": 5291,
    "percentComplete": 0.18
  }]'::jsonb),
  ('2023-11-22', '5899f99d-a449-4bfa-8769-19c097aaf1f5'::uuid, '[{
    "option": {
      "name": "Suzuka",
      "value": "japan_suzuka",
      "emoji": "🌸",
      "flag": "🇯🇵",
      "correct": false
    },
    "elapsed": 6441,
    "percentComplete": 0.21
  },
  {
    "option": {
      "name": "Zandvoort Circuit",
      "value": "netherlands",
      "emoji": "🧇",
      "flag": "🇳🇱",
      "correct": false
    },
    "elapsed": 3635,
    "percentComplete": 0.12
  },
  {
    "option": {
      "name": "Sochi Autodrom",
      "value": "russia",
      "emoji": "🇷🇺",
      "flag": "🇷🇺",
      "correct": true
    },
    "elapsed": 5291,
    "percentComplete": 0.18
  }]'::jsonb),
  ('2023-11-20', '5899f99d-a449-4bfa-8769-19c097aaf1f5'::uuid, '[{
    "option": {
      "name": "Suzuka",
      "value": "japan_suzuka",
      "emoji": "🌸",
      "flag": "🇯🇵",
      "correct": false
    },
    "elapsed": 6441,
    "percentComplete": 0.21
  },
  {
    "option": {
      "name": "Zandvoort Circuit",
      "value": "netherlands",
      "emoji": "🧇",
      "flag": "🇳🇱",
      "correct": true
    },
    "elapsed": 3635,
    "percentComplete": 0.12
  },
  {
    "option": {
      "name": "Sochi Autodrom",
      "value": "russia",
      "emoji": "🇷🇺",
      "flag": "🇷🇺",
      "correct": true
    },
    "elapsed": 5291,
    "percentComplete": 0.18
  }]'::jsonb);

-- MUST BE LAST
END $$;
