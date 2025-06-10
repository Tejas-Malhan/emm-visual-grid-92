
-- Drop existing tables and their dependencies
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'member');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    default_credit_name TEXT,
    role user_role NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media_items table
CREATE TABLE media_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('photo', 'video')),
    cover_url TEXT NOT NULL,
    media_urls TEXT[], -- Array of media URLs
    description TEXT CHECK (length(description) <= 200),
    uploaded_by_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    credits TEXT[], -- Array of credit names
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (correct syntax)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.users WHERE id = user_uuid;
$$;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update users" ON users
    FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- RLS Policies for media_items
CREATE POLICY "Everyone can view media items" ON media_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own media" ON media_items
    FOR INSERT WITH CHECK (uploaded_by_user_id = auth.uid());

CREATE POLICY "Users can update their own media" ON media_items
    FOR UPDATE USING (uploaded_by_user_id = auth.uid());

CREATE POLICY "Admins can manage all media" ON media_items
    FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_items_updated_at BEFORE UPDATE ON media_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert a default admin user (you can change the password hash later)
-- Note: This is a placeholder - you'll need to hash passwords properly in your app
INSERT INTO users (username, password_hash, default_credit_name, role) 
VALUES ('admin', '$2b$10$placeholder_hash_replace_this', 'Administrator', 'admin');
