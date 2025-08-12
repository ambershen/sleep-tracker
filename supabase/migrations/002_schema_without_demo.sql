-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  sleep_goal_hours DECIMAL(3,1) DEFAULT 8.0 CHECK (sleep_goal_hours >= 6 AND sleep_goal_hours <= 12),
  timezone VARCHAR(50) DEFAULT 'UTC',
  email_reminders BOOLEAN DEFAULT true,
  reminder_time TIME DEFAULT '22:00:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sleep_entries table
CREATE TABLE sleep_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sleep_date DATE NOT NULL,
  bedtime TIME NOT NULL,
  wake_time TIME NOT NULL,
  duration_hours DECIMAL(4,2) GENERATED ALWAYS AS (
    CASE 
      WHEN wake_time >= bedtime THEN 
        EXTRACT(EPOCH FROM (wake_time - bedtime)) / 3600
      ELSE 
        EXTRACT(EPOCH FROM (wake_time + INTERVAL '24 hours' - bedtime)) / 3600
    END
  ) STORED,
  quality_rating INTEGER NOT NULL CHECK (quality_rating >= 1 AND quality_rating <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sleep_date)
);

-- Create indexes for better query performance
CREATE INDEX idx_sleep_entries_user_date ON sleep_entries(user_id, sleep_date DESC);
CREATE INDEX idx_sleep_entries_created_at ON sleep_entries(created_at DESC);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS policies for sleep_entries
CREATE POLICY "Users can view own sleep entries" ON sleep_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sleep entries" ON sleep_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sleep entries" ON sleep_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sleep entries" ON sleep_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON user_profiles TO anon;
GRANT ALL PRIVILEGES ON user_profiles TO authenticated;
GRANT SELECT ON sleep_entries TO anon;
GRANT ALL PRIVILEGES ON sleep_entries TO authenticated;