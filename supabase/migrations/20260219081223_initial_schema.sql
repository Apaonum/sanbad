-- 1. Player Profile (Connect to Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  skill_level TEXT CHECK (skill_level IN ('S', 'P', 'P+', 'M', 'Unrated')) DEFAULT 'Unrated',
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- 2. Badminton Court Table
CREATE TABLE courts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location_url TEXT, -- Google Maps Link
  price_per_hour DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Badminton Session Table
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  court_id UUID REFERENCES courts(id),
  creator_id UUID REFERENCES profiles(id),
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_players INTEGER DEFAULT 12,
  current_players INTEGER DEFAULT 0,
  cost_per_person DECIMAL DEFAULT 0,
  status TEXT CHECK (status IN ('open', 'closed', 'cancelled')) DEFAULT 'open',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Booking Table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'waiting_list')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('unpaid', 'paid', 'verified')) DEFAULT 'unpaid',
  payment_proof_url TEXT, -- Payment Proof URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate bookings in the same session
  UNIQUE(session_id, user_id)
);

-- 5. Security System (Row Level Security - RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Example Policy: Anyone can view courts and sessions, but must be logged in to book
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profiles." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Courts are viewable by everyone." ON courts FOR SELECT USING (true);

CREATE POLICY "Sessions are viewable by everyone." ON sessions FOR SELECT USING (true);

CREATE POLICY "Users can view their own bookings." ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can book sessions." ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Automatic Function when New User Registers via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();