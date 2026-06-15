-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    photo_url TEXT,
    qualifications TEXT[],
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES public.account(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    featured_image TEXT,
    content TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(account_id, slug)
);

-- Create indexes for better performance
CREATE INDEX idx_team_members_account_id ON public.team_members(account_id);
CREATE INDEX idx_team_members_display_order ON public.team_members(display_order);
CREATE INDEX idx_services_account_id ON public.services(account_id);
CREATE INDEX idx_services_slug ON public.services(slug);
CREATE INDEX idx_services_display_order ON public.services(display_order);

-- Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_members
-- Public read access
CREATE POLICY "Public can view active team members" ON public.team_members
    FOR SELECT
    USING (is_active = true);

-- Authenticated users can manage their account's team members
CREATE POLICY "Users can manage their account team members" ON public.team_members
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT auth_id FROM public.user_profile
            WHERE account = team_members.account_id
        )
    );

-- RLS Policies for services
-- Public read access
CREATE POLICY "Public can view active services" ON public.services
    FOR SELECT
    USING (is_active = true);

-- Authenticated users can manage their account's services
CREATE POLICY "Users can manage their account services" ON public.services
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT auth_id FROM public.user_profile
            WHERE account = services.account_id
        )
    );

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update triggers
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();