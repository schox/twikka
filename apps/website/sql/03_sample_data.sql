-- Sample data for testing (replace account_id with actual account UUID)
-- This assumes you have an account with a specific ID

-- Example: Insert sample team members
/*
INSERT INTO web.team_members (account_id, name, role, bio, qualifications, display_order)
VALUES 
    ('YOUR_ACCOUNT_ID', 'Dr. John Smith', 'Principal Podiatrist', 'Dr. Smith has over 20 years of experience in podiatry...', ARRAY['Bachelor of Podiatry', 'Fellow of the Australian Podiatry Association'], 1),
    ('YOUR_ACCOUNT_ID', 'Dr. Sarah Johnson', 'Senior Podiatrist', 'Dr. Johnson specializes in sports injuries and biomechanics...', ARRAY['Bachelor of Podiatric Medicine', 'Masters in Sports Medicine'], 2),
    ('YOUR_ACCOUNT_ID', 'Dr. Michael Chen', 'Podiatrist', 'Dr. Chen focuses on diabetic foot care and wound management...', ARRAY['Bachelor of Health Science (Podiatry)'], 3);

-- Example: Insert sample services
INSERT INTO web.services (account_id, name, slug, description, content, display_order)
VALUES 
    ('YOUR_ACCOUNT_ID', 'General Podiatry', 'general-podiatry', 'Comprehensive foot and ankle care for all ages', 'Full content here...', 1),
    ('YOUR_ACCOUNT_ID', 'Sports Podiatry', 'sports-podiatry', 'Specialized treatment for sports-related injuries', 'Full content here...', 2),
    ('YOUR_ACCOUNT_ID', 'Orthotics', 'orthotics', 'Custom-made orthotics to correct biomechanical issues', 'Full content here...', 3),
    ('YOUR_ACCOUNT_ID', 'Ingrown Toenails', 'ingrown-toenails', 'Expert treatment for painful ingrown toenails', 'Full content here...', 4),
    ('YOUR_ACCOUNT_ID', 'Diabetic Foot Care', 'diabetic-foot-care', 'Specialized care for diabetic patients', 'Full content here...', 5);
*/