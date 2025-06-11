
-- Insert the admin user into the users table
INSERT INTO public.users (username, password_hash, role, default_credit_name)
VALUES ('admin', 'admin', 'admin', 'Admin User')
ON CONFLICT (username) DO NOTHING;
