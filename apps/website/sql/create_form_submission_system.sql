-- Create form_submission table for centralized form handling
CREATE TABLE IF NOT EXISTS form_submission (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL,
  form_type TEXT NOT NULL, -- e.g. 'contact', 'newsletter', 'appointment_request'
  label TEXT NOT NULL, -- e.g. 'Contact us - Home Page', 'Newsletter signup - Footer'
  form_data JSONB NOT NULL, -- The actual form content
  status TEXT DEFAULT 'pending', -- 'pending', 'processed', 'failed'
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_form_submission_account_id ON form_submission(account_id);
CREATE INDEX IF NOT EXISTS idx_form_submission_form_type ON form_submission(form_type);
CREATE INDEX IF NOT EXISTS idx_form_submission_status ON form_submission(status);
CREATE INDEX IF NOT EXISTS idx_form_submission_created_at ON form_submission(created_at);

-- Enable RLS
ALTER TABLE form_submission ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "form_submission_insert_all" ON form_submission
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "form_submission_select_authenticated" ON form_submission
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_profile 
      WHERE user_profile.auth_id = auth.uid() 
      AND user_profile.account = form_submission.account_id
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_form_submission_updated_at
  BEFORE UPDATE ON form_submission
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger function for processing form submissions
CREATE OR REPLACE FUNCTION process_form_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- This is where you can add logic to decide what to do with different form types
  
  IF NEW.form_type = 'contact' THEN
    -- For contact forms, we could:
    -- 1. Send an email notification
    -- 2. Create a task in a CRM
    -- 3. Call a webhook
    -- For now, we'll just log it (in production, you'd call an edge function)
    
    RAISE LOG 'Contact form submitted for account %, data: %', NEW.account_id, NEW.form_data;
    
  ELSIF NEW.form_type = 'newsletter' THEN
    -- For newsletter signups, we could:
    -- 1. Add to email list
    -- 2. Send welcome email
    -- 3. Update marketing database
    
    RAISE LOG 'Newsletter signup for account %, data: %', NEW.account_id, NEW.form_data;
    
  ELSIF NEW.form_type = 'appointment_request' THEN
    -- For appointment requests, we could:
    -- 1. Create calendar event
    -- 2. Send confirmation email
    -- 3. Add to booking system
    
    RAISE LOG 'Appointment request for account %, data: %', NEW.account_id, NEW.form_data;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to process form submissions after insert
CREATE TRIGGER trigger_process_form_submission
  AFTER INSERT ON form_submission
  FOR EACH ROW
  EXECUTE FUNCTION process_form_submission();