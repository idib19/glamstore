-- Create failed_emails table to track email API failures
CREATE TABLE IF NOT EXISTS failed_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_type VARCHAR(100) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  error_message TEXT NOT NULL,
  error_details JSONB,
  context_data JSONB,
  retry_count INTEGER DEFAULT 0,
  last_retry_at TIMESTAMP WITH TIME ZONE,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by VARCHAR(100),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_failed_emails_email_type ON failed_emails(email_type);
CREATE INDEX IF NOT EXISTS idx_failed_emails_recipient_email ON failed_emails(recipient_email);
CREATE INDEX IF NOT EXISTS idx_failed_emails_created_at ON failed_emails(created_at);
CREATE INDEX IF NOT EXISTS idx_failed_emails_is_resolved ON failed_emails(is_resolved);
CREATE INDEX IF NOT EXISTS idx_failed_emails_retry_count ON failed_emails(retry_count);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_failed_emails_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_failed_emails_updated_at
  BEFORE UPDATE ON failed_emails
  FOR EACH ROW
  EXECUTE FUNCTION update_failed_emails_updated_at();

-- Add RLS policies for security
ALTER TABLE failed_emails ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all failed emails
CREATE POLICY "Admins can view all failed emails" ON failed_emails
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'manager')
    )
  );

-- Allow admins to insert failed emails
CREATE POLICY "Admins can insert failed emails" ON failed_emails
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'manager')
    )
  );

-- Allow admins to update failed emails
CREATE POLICY "Admins can update failed emails" ON failed_emails
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'manager')
    )
  );

-- Allow service role to insert failed emails (for API routes)
CREATE POLICY "Service role can insert failed emails" ON failed_emails
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Allow service role to update failed emails
CREATE POLICY "Service role can update failed emails" ON failed_emails
  FOR UPDATE USING (auth.role() = 'service_role');

-- Add comments for documentation
COMMENT ON TABLE failed_emails IS 'Tracks failed email API calls for monitoring and debugging';
COMMENT ON COLUMN failed_emails.email_type IS 'Type of email that failed (e.g., appointment_confirmation, order_confirmation)';
COMMENT ON COLUMN failed_emails.recipient_email IS 'Email address of the intended recipient';
COMMENT ON COLUMN failed_emails.error_message IS 'Human-readable error message';
COMMENT ON COLUMN failed_emails.error_details IS 'Detailed error information in JSON format';
COMMENT ON COLUMN failed_emails.context_data IS 'Context data about the email attempt (customer info, order/appointment details, etc.)';
COMMENT ON COLUMN failed_emails.retry_count IS 'Number of retry attempts made';
COMMENT ON COLUMN failed_emails.is_resolved IS 'Whether the issue has been resolved';
COMMENT ON COLUMN failed_emails.resolution_notes IS 'Notes about how the issue was resolved'; 