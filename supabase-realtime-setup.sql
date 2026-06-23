-- ============================================================
-- NEARA SUPABASE REALTIME CONFIGURATION
-- ============================================================
-- Execute this SQL in your Supabase SQL Editor to enable 
-- Realtime broadcasts for the messages and notifications tables.

-- 1. Enable Realtime on the "messages" table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 2. Enable Realtime on the "notifications" table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- (Optional) If you ever need to verify which tables are in the publication:
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
