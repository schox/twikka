-- Create team_members table
CREATE TABLE IF NOT EXISTS web.team_members (
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
CREATE TABLE IF NOT EXISTS web.services (
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
CREATE INDEX idx_team_members_account_id ON web.team_members(account_id);
CREATE INDEX idx_team_members_display_order ON web.team_members(display_order);
CREATE INDEX idx_services_account_id ON web.services(account_id);
CREATE INDEX idx_services_slug ON web.services(slug);
CREATE INDEX idx_services_display_order ON web.services(display_order);

-- Enable Row Level Security
ALTER TABLE web.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE web.services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_members
-- Public read access
CREATE POLICY "Public can view active team members" ON web.team_members
    FOR SELECT
    USING (is_active = true);

-- Authenticated users can manage their account's team members
CREATE POLICY "Users can manage their account team members" ON web.team_members
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT auth_id FROM public.user_profile
            WHERE account = team_members.account_id
        )
    );

-- RLS Policies for services
-- Public read access
CREATE POLICY "Public can view active services" ON web.services
    FOR SELECT
    USING (is_active = true);

-- Authenticated users can manage their account's services
CREATE POLICY "Users can manage their account services" ON web.services
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT auth_id FROM public.user_profile
            WHERE account = services.account_id
        )
    );

-- Update timestamp function (create in web schema)
CREATE OR REPLACE FUNCTION web.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update triggers
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON web.team_members
    FOR EACH ROW EXECUTE FUNCTION web.update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON web.services
    FOR EACH ROW EXECUTE FUNCTION web.update_updated_at_column();