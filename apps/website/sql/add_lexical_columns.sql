-- Add Lexical content columns to blog_post table
ALTER TABLE blog_post 
ADD COLUMN IF NOT EXISTS lexical_content JSONB,
ADD COLUMN IF NOT EXISTS content_html TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_post_lexical_content ON blog_post USING GIN (lexical_content);
CREATE INDEX IF NOT EXISTS idx_blog_post_content_html ON blog_post (content_html);

-- Add comment for documentation
COMMENT ON COLUMN blog_post.lexical_content IS 'Lexical editor state JSON - source of truth for rich content';
COMMENT ON COLUMN blog_post.content_html IS 'Generated HTML from Lexical content for SEO and search indexing';