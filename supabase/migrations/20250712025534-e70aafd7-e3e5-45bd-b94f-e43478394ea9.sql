
-- Fix RLS policies to allow operations without authentication for now
-- Later we'll add proper authentication

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can create colleges" ON public.colleges;
DROP POLICY IF EXISTS "Users can create interaction logs" ON public.interaction_logs;
DROP POLICY IF EXISTS "Users can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update interaction logs" ON public.interaction_logs;
DROP POLICY IF EXISTS "Users can delete interaction logs" ON public.interaction_logs;
DROP POLICY IF EXISTS "Users can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete colleges" ON public.colleges;

-- Create more permissive policies for now
CREATE POLICY "Allow all operations on colleges" ON public.colleges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on interaction_logs" ON public.interaction_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT CHECK (role IN ('field_executive', 'team_lead', 'manager', 'admin')) DEFAULT 'field_executive',
  department TEXT,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  hire_date DATE DEFAULT CURRENT_DATE,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on team_members" ON public.team_members FOR ALL USING (true) WITH CHECK (true);

-- Add assigned_to_name field to tasks for easier display
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS assigned_to_name TEXT;

-- Insert sample team members
INSERT INTO public.team_members (name, email, phone, role, department) VALUES
('John Doe', 'john.doe@company.com', '+91-9876543210', 'field_executive', 'Outreach'),
('Sarah Smith', 'sarah.smith@company.com', '+91-9876543211', 'team_lead', 'Outreach'),
('Mike Johnson', 'mike.johnson@company.com', '+91-9876543212', 'manager', 'Operations'),
('Emily Davis', 'emily.davis@company.com', '+91-9876543213', 'field_executive', 'Outreach');
