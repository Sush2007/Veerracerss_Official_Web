-- ====================================================================
-- VEERRACERSS ELECTRIC: COMPREHENSIVE CMS & PR MANAGEMENT MIGRATION
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query
-- ====================================================================

-- 1. SITE SETTINGS TABLE (Hero Recruitment CTA & Announcement Banner)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  recruitment_cta_label TEXT NOT NULL DEFAULT 'RECRUITMENT 2026',
  recruitment_cta_url TEXT NOT NULL DEFAULT '/members',
  recruitment_cta_enabled BOOLEAN NOT NULL DEFAULT true,
  announcement_badge_text TEXT NOT NULL DEFAULT 'FORMULA STUDENT ELECTRIC // VSSUT BURLA',
  announcement_badge_enabled BOOLEAN NOT NULL DEFAULT true,
  contact_email TEXT NOT NULL DEFAULT 'veerracersselectric.database@gmail.com',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all on site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated on site_settings" ON public.site_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated on site_settings" ON public.site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Seed site_settings default row if empty
INSERT INTO public.site_settings (recruitment_cta_label, recruitment_cta_url, recruitment_cta_enabled, announcement_badge_text, announcement_badge_enabled, contact_email)
SELECT 'RECRUITMENT 2026', '/members', true, 'FORMULA STUDENT ELECTRIC // VSSUT BURLA', true, 'veerracersselectric.database@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);


-- 2. FEATURED MACHINE (The Car / AETHER Spotlight Specs & Media)
CREATE TABLE IF NOT EXISTS public.featured_machine (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  car_name TEXT NOT NULL DEFAULT 'AETHER 2024-25',
  season_tag TEXT NOT NULL DEFAULT 'FORMULA STUDENT EV PROTOTYPE',
  description TEXT NOT NULL DEFAULT 'Engineered from the ground up by student engineers at VSSUT Burla. Passing rigorous technical scrutiny at Formula Imperial (Buddh International Circuit).',
  cad_image_url TEXT NOT NULL DEFAULT '/cars/aether-spotlight.jpg',
  track_image_url TEXT NOT NULL DEFAULT '/cars/aether.jpg',
  top_speed_val TEXT NOT NULL DEFAULT '115',
  accel_val TEXT NOT NULL DEFAULT '3.1',
  voltage_val TEXT NOT NULL DEFAULT '72',
  weight_val TEXT NOT NULL DEFAULT '182',
  powertrain_headline TEXT NOT NULL DEFAULT '10 kW PMSM Motor',
  powertrain_specs TEXT NOT NULL DEFAULT '85 Nm Peak Torque • Direct Chain Reduction • Regenerative Braking',
  accumulator_headline TEXT NOT NULL DEFAULT '72V High-Energy Li-Ion Pack',
  accumulator_specs TEXT NOT NULL DEFAULT 'In-House BMS • Active Thermal Monitoring • IP67 Isolation',
  chassis_headline TEXT NOT NULL DEFAULT 'AISI 4130 Chromoly Spaceframe',
  chassis_specs TEXT NOT NULL DEFAULT '182 kg Curb Weight • Torsional Stiffness > 1450 Nm/deg • FIA Egress',
  aero_headline TEXT NOT NULL DEFAULT 'Dual-Element Carbon Wings',
  aero_specs TEXT NOT NULL DEFAULT 'CFD Optimised Endplates • Drag Reduction System • High Downforce',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.featured_machine ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all on featured_machine" ON public.featured_machine FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated on featured_machine" ON public.featured_machine FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated on featured_machine" ON public.featured_machine FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Seed featured_machine default row if empty
INSERT INTO public.featured_machine (car_name, season_tag, description, cad_image_url, track_image_url, top_speed_val, accel_val, voltage_val, weight_val)
SELECT 'AETHER 2024-25', 'FORMULA STUDENT EV PROTOTYPE', 'Engineered from the ground up by student engineers at VSSUT Burla. Passing rigorous technical scrutiny at Formula Imperial.', '/cars/aether-spotlight.jpg', '/cars/aether.jpg', '115', '3.1', '72', '182'
WHERE NOT EXISTS (SELECT 1 FROM public.featured_machine);


-- 3. MEDIA REEL & GALLERY (Highlights Marquee & Yearwise Archive)
CREATE TABLE IF NOT EXISTS public.media_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image', -- 'image' or 'video'
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  year TEXT NOT NULL DEFAULT '2025',
  featured_on_home BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all on media_items" ON public.media_items FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated on media_items" ON public.media_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated on media_items" ON public.media_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated on media_items" ON public.media_items FOR DELETE USING (auth.role() = 'authenticated');

-- Seed initial media highlights
INSERT INTO public.media_items (title, media_type, media_url, year, featured_on_home, order_index)
SELECT 'AETHER Track Testing at Buddh International Circuit', 'image', '/cars/aether.jpg', '2025', true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.media_items WHERE title = 'AETHER Track Testing at Buddh International Circuit');

INSERT INTO public.media_items (title, media_type, media_url, year, featured_on_home, order_index)
SELECT 'Chassis & Spaceframe CAD Simulation', 'image', '/cars/aether-spotlight.jpg', '2024', true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.media_items WHERE title = 'Chassis & Spaceframe CAD Simulation');

INSERT INTO public.media_items (title, media_type, media_url, year, featured_on_home, order_index)
SELECT 'Formula Imperial Podium Ceremony', 'image', '/achievements/formula-imperial-2024.jpg', '2024', true, 3
WHERE NOT EXISTS (SELECT 1 FROM public.media_items WHERE title = 'Formula Imperial Podium Ceremony');

INSERT INTO public.media_items (title, media_type, media_url, year, featured_on_home, order_index)
SELECT 'National Scrutiny Scrutineering Hall', 'image', '/achievements/formula-imperial-2023.jpg', '2023', true, 4
WHERE NOT EXISTS (SELECT 1 FROM public.media_items WHERE title = 'National Scrutiny Scrutineering Hall');

INSERT INTO public.media_items (title, media_type, media_url, year, featured_on_home, order_index)
SELECT 'Electric Powertrain Bench Test', 'image', '/achievements/pi-ev-2022.jpg', '2022', true, 5
WHERE NOT EXISTS (SELECT 1 FROM public.media_items WHERE title = 'Electric Powertrain Bench Test');


-- 4. ALUMNI DIRECTORY TABLE
CREATE TABLE IF NOT EXISTS public.alumni (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  batch TEXT NOT NULL,
  former_role TEXT NOT NULL,
  current_company TEXT NOT NULL,
  current_role TEXT NOT NULL,
  image_url TEXT NOT NULL,
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/company/veerracerss-electric/',
  mentorship_domain TEXT NOT NULL,
  bio TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all on alumni" ON public.alumni FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated on alumni" ON public.alumni FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated on alumni" ON public.alumni FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated on alumni" ON public.alumni FOR DELETE USING (auth.role() = 'authenticated');

-- Seed initial alumni records
INSERT INTO public.alumni (name, batch, former_role, current_company, current_role, image_url, linkedin_url, mentorship_domain, bio, order_index)
SELECT 'Siddhartha Senapati', 'Batch 2021', 'Former Team Captain & Powertrain Lead', 'Ather Energy', 'Battery Systems Engineer', '/alumni/siddhartha-senapati.jpg', 'https://www.linkedin.com/company/veerracerss-electric/', 'Li-Ion Thermal Architecture & BMS', 'Pioneered VeerRacerss initial transition into high-voltage electric powertrains; now driving battery pack thermal safety and pack engineering at Ather Energy.', 1
WHERE NOT EXISTS (SELECT 1 FROM public.alumni WHERE name = 'Siddhartha Senapati');

INSERT INTO public.alumni (name, batch, former_role, current_company, current_role, image_url, linkedin_url, mentorship_domain, bio, order_index)
SELECT 'Priyanka Das', 'Batch 2022', 'Former Powertrain Lead', 'Tata Motors EV', 'Powertrain Calibration Lead', '/alumni/priyanka-das.jpg', 'https://www.linkedin.com/company/veerracerss-electric/', 'Motor Inverter Tuning & Drive Cycles', 'Engineered vehicle dynamometer testing pipelines for Aether; currently calibrating permanent magnet electric motor drives across production Tata EVs.', 2
WHERE NOT EXISTS (SELECT 1 FROM public.alumni WHERE name = 'Priyanka Das');

INSERT INTO public.alumni (name, batch, former_role, current_company, current_role, image_url, linkedin_url, mentorship_domain, bio, order_index)
SELECT 'Aman Patnaik', 'Batch 2023', 'Former Chassis & Vehicle Dynamics Lead', 'Mahindra Racing', 'Vehicle Dynamics Engineer', '/alumni/aman-patnaik.jpg', 'https://www.linkedin.com/company/veerracerss-electric/', 'Suspension Kinematics & CFD Aero', 'Designed our multi-link double-wishbone suspension setup; currently developing dynamic lap simulations and track vehicle dynamics with Mahindra Racing.', 3
WHERE NOT EXISTS (SELECT 1 FROM public.alumni WHERE name = 'Aman Patnaik');

INSERT INTO public.alumni (name, batch, former_role, current_company, current_role, image_url, linkedin_url, mentorship_domain, bio, order_index)
SELECT 'Rohan Mohanty', 'Batch 2023', 'Former Electronics & Telemetry Lead', 'Ola Electric', 'Motor Controller Firmware', '/alumni/rohan-mohanty.jpg', 'https://www.linkedin.com/company/veerracerss-electric/', 'CAN-Bus Telemetry & Embedded Firmware', 'Architected custom telemetry logging units streaming real-time tire temperatures; now building field-oriented control firmware for high-performance EV controllers.', 4
WHERE NOT EXISTS (SELECT 1 FROM public.alumni WHERE name = 'Rohan Mohanty');


-- 5. STORAGE BUCKET CREATION FOR CMS ASSETS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('alumni-images', 'alumni-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('reel-media', 'reel-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access on alumni-images" ON storage.objects FOR SELECT USING (bucket_id = 'alumni-images');
CREATE POLICY "Auth Upload on alumni-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'alumni-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete on alumni-images" ON storage.objects FOR DELETE USING (bucket_id = 'alumni-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public Access on reel-media" ON storage.objects FOR SELECT USING (bucket_id = 'reel-media');
CREATE POLICY "Auth Upload on reel-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'reel-media' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete on reel-media" ON storage.objects FOR DELETE USING (bucket_id = 'reel-media' AND auth.role() = 'authenticated');
