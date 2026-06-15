-- Add lexical_content and content_html columns to web.service and web.team_member for consistency with public.blog_post
-- This enables unified Lexical rendering and editing across all content types

-- Add to web.service to match blog_post structure
ALTER TABLE web.service 
ADD COLUMN IF NOT EXISTS lexical_content JSONB,
ADD COLUMN IF NOT EXISTS content_html TEXT;

-- Add to web.team_member (using bio_lexical_content and bio_html to match existing bio field)
ALTER TABLE web.team_member 
ADD COLUMN IF NOT EXISTS bio_lexical_content JSONB,
ADD COLUMN IF NOT EXISTS bio_html TEXT;

-- Add comments for clarity
COMMENT ON COLUMN web.service.lexical_content IS 'Lexical editor JSON state for rich content editing';
COMMENT ON COLUMN web.service.content_html IS 'Pre-rendered HTML from Lexical content for performance';
COMMENT ON COLUMN web.team_member.bio_lexical_content IS 'Lexical editor JSON state for team member bio';
COMMENT ON COLUMN web.team_member.bio_html IS 'Pre-rendered HTML from Lexical bio content for performance';