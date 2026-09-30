-- HueMatch Bridal: Seed Data — 10 Demo Artists
-- Run this AFTER schema.sql in the Supabase SQL Editor
-- All artists are pre-approved for the hackathon demo

INSERT INTO public.artists (display_name, bio, city, monk_expertise, years_experience, instagram, approved) VALUES
  ('Priya Sharma', 'Specialising in bridal looks that celebrate your natural glow. Deep and warm tone expert.', 'Mumbai', ARRAY[6,7,8,9,10], 12, 'priyamakeup', true),
  ('Ananya Reddy', 'South Indian bridal specialist with a passion for rich, radiant finishes on every skin tone.', 'Chennai', ARRAY[5,6,7,8,9], 8, 'ananyabeauty', true),
  ('Fatima Khan', 'Nikah and reception looks. I work with your skin, not against it.', 'Hyderabad', ARRAY[4,5,6,7,8], 10, 'fatimakhan_mua', true),
  ('Deepika Nair', 'Kerala bridal traditions with a modern twist. Every bride deserves her own shade.', 'Kochi', ARRAY[7,8,9,10], 6, 'deepikanair_beauty', true),
  ('Sonal Patel', 'Gujarati and Rajasthani bridal expert. Warm-toned skin is my specialty.', 'Ahmedabad', ARRAY[3,4,5,6,7], 9, 'sonalbridal', true),
  ('Meghna Das', 'Bengali bridal artistry with a focus on dewy, luminous skin for every complexion.', 'Kolkata', ARRAY[4,5,6,7,8], 7, 'meghnamakeup', true),
  ('Ritu Verma', 'Destination wedding specialist. Trained in inclusive shade matching across the Monk scale.', 'Delhi', ARRAY[1,2,3,4,5,6,7,8,9,10], 15, 'rituverma_bridal', true),
  ('Zara Sheikh', 'Minimalist bridal beauty. Olive and cool undertone expertise.', 'Pune', ARRAY[3,4,5,6], 5, 'zarasheikh_mua', true),
  ('Kavitha Sundaram', 'Deep skin specialist. Your richness is your power — I just enhance it.', 'Bangalore', ARRAY[8,9,10], 11, 'kavitha_bridal', true),
  ('Nisha Thakur', 'Fair to medium skin expert with a focus on cool and neutral undertones.', 'Jaipur', ARRAY[1,2,3,4,5], 4, 'nishathakur_mua', true);
