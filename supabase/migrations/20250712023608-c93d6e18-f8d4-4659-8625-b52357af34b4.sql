
-- Create colleges table for storing college information
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  pin_code TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  college_type TEXT CHECK (college_type IN ('Engineering', 'Degree', 'Polytechnic', 'Medical', 'Technical', 'Arts', 'Commerce')),
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'in-discussion', 'scheduled')) DEFAULT 'pending',
  last_contact_date DATE,
  next_followup_date DATE,
  rejection_reason TEXT,
  status_notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interaction_logs table for tracking all interactions
CREATE TABLE public.interaction_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  executive_name TEXT,
  contact_method TEXT CHECK (contact_method IN ('Call', 'Visit', 'Email', 'WhatsApp', 'SMS')),
  interaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT NOT NULL,
  file_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table for follow-up management
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('pending', 'completed', 'overdue')) DEFAULT 'pending',
  task_type TEXT CHECK (task_type IN ('call', 'visit', 'email', 'admin', 'follow-up')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for colleges
CREATE POLICY "Users can view all colleges" ON public.colleges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create colleges" ON public.colleges FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update colleges" ON public.colleges FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete colleges" ON public.colleges FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- RLS Policies for interaction_logs
CREATE POLICY "Users can view all interaction logs" ON public.interaction_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create interaction logs" ON public.interaction_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update interaction logs" ON public.interaction_logs FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Users can delete interaction logs" ON public.interaction_logs FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- RLS Policies for tasks
CREATE POLICY "Users can view all tasks" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create tasks" ON public.tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update tasks" ON public.tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete tasks" ON public.tasks FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('college-files', 'college-files', true);

-- Storage policies for file uploads
CREATE POLICY "Anyone can view files" ON storage.objects FOR SELECT USING (bucket_id = 'college-files');
CREATE POLICY "Authenticated users can upload files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'college-files');
CREATE POLICY "Users can update their files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'college-files');
CREATE POLICY "Users can delete their files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'college-files');
