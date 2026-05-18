-- Run this in your Supabase project:
-- Dashboard → SQL Editor → paste this → Run
--
-- This replaces the handle_new_user trigger so it writes ALL profile
-- fields (not just email) by reading them from the signUp options.data
-- payload, which is stored in auth.users.raw_user_meta_data.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER          -- runs as the DB owner, bypasses RLS
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (
    user_id,
    email,
    name,
    date_of_birth,
    subscription,
    password
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'name',
    (NEW.raw_user_meta_data ->> 'date_of_birth')::date,
    NEW.raw_user_meta_data ->> 'subscription',
    NEW.raw_user_meta_data ->> 'password'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email        = EXCLUDED.email,
    name         = EXCLUDED.name,
    date_of_birth = EXCLUDED.date_of_birth,
    subscription = EXCLUDED.subscription,
    password     = EXCLUDED.password;

  RETURN NEW;
END;
$$;

-- Make sure the trigger is wired up (safe to run even if it already exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
