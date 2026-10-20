-- =========================================================================
-- VEERRACERSS ELECTRIC // CLUB OPERATIONS & AUTOMATIONS SETUP SCRIPT
-- =========================================================================
-- Idempotent setup script for R1 - R5:
-- R1: Member Profile Datasheets & PR Domain Specialization
-- R2: Lightweight Club Expenses & Bills Tracker
-- R3: Annual Batch Year Progression Engine & Alumni Sync
-- R4: Recruitment Applications & Induction Checklist & PR Master Toggle
-- R5: Onboarding Email Dispatch Integration & Templates
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. EXTEND MEMBERS TABLE (R1 & R3)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  image_url TEXT NOT NULL,
  linkedin TEXT DEFAULT '#',
  instagram TEXT DEFAULT '#',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DO $$
BEGIN
  -- 1.1 Academic year of study
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='year_of_study') THEN
    ALTER TABLE public.members ADD COLUMN year_of_study TEXT;
    
    -- Backfill year_of_study from legacy 'year' column if present (guarded against 'Pre-Final' collision)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='year') THEN
      UPDATE public.members SET year_of_study = 
        CASE 
          WHEN (year ILIKE '%4th%' OR year ILIKE '%final%') AND year NOT ILIKE '%pre-final%' THEN '4th Year'
          WHEN year ILIKE '%3rd%' OR year ILIKE '%pre-final%' THEN '3rd Year'
          WHEN year ILIKE '%2nd%' OR year ILIKE '%second%' THEN '2nd Year'
          WHEN year ILIKE '%1st%' OR year ILIKE '%first%' THEN '1st Year'
          ELSE '3rd Year'
        END
      WHERE year_of_study IS NULL;
    ELSE
      UPDATE public.members SET year_of_study = '3rd Year' WHERE year_of_study IS NULL;
    END IF;

    ALTER TABLE public.members ALTER COLUMN year_of_study SET DEFAULT '3rd Year';
  END IF;

  -- 1.2 Legacy 'year' column sync support
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='year') THEN
    ALTER TABLE public.members ADD COLUMN year TEXT DEFAULT '3rd Year (Pre-Final)';
    UPDATE public.members SET year = year_of_study WHERE year IS NULL;
  END IF;

  -- 1.3 Idempotent Repair & Synchronization (Self-Healing)
  -- Catches databases where year_of_study column was already created with legacy buggy CASE statement
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='year') 
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='year_of_study') THEN
    -- A) Backfill any remaining NULLs safely
    UPDATE public.members SET year_of_study = 
      CASE 
        WHEN (year ILIKE '%4th%' OR year ILIKE '%final%') AND year NOT ILIKE '%pre-final%' THEN '4th Year'
        WHEN year ILIKE '%3rd%' OR year ILIKE '%pre-final%' THEN '3rd Year'
        WHEN year ILIKE '%2nd%' OR year ILIKE '%second%' THEN '2nd Year'
        WHEN year ILIKE '%1st%' OR year ILIKE '%first%' THEN '1st Year'
        ELSE '3rd Year'
      END
    WHERE year_of_study IS NULL;

    -- B) Repair historical misclassifications where '3rd Year (Pre-Final)' was erroneously classified as '4th Year'
    UPDATE public.members 
    SET year_of_study = '3rd Year'
    WHERE (year ILIKE '%pre-final%' OR year ILIKE '%3rd%')
      AND year NOT ILIKE '%4th%'
      AND year NOT ILIKE '%final year%'
      AND year_of_study = '4th Year';

    -- C) Fill any unpopulated legacy year rows
    UPDATE public.members 
    SET year = 
      CASE
        WHEN (year_of_study ILIKE '%4th%' OR year_of_study ILIKE '%final%') AND year_of_study NOT ILIKE '%pre-final%' THEN 'Final Year (4th Year)'
        WHEN year_of_study ILIKE '%3rd%' OR year_of_study ILIKE '%pre-final%' THEN '3rd Year (Pre-Final)'
        WHEN year_of_study ILIKE '%2nd%' OR year_of_study ILIKE '%second%' THEN '2nd Year'
        WHEN year_of_study ILIKE '%1st%' OR year_of_study ILIKE '%first%' THEN '1st Year'
        ELSE '3rd Year (Pre-Final)'
      END
    WHERE year IS NULL;
  END IF;

  -- 1.3 Academic branch
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='academic_branch') THEN
    ALTER TABLE public.members ADD COLUMN academic_branch TEXT DEFAULT 'Mechanical Engineering';
  END IF;

  -- 1.4 Blood group
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='blood_group') THEN
    ALTER TABLE public.members ADD COLUMN blood_group TEXT DEFAULT 'O+';
  END IF;

  -- 1.5 WhatsApp Contact Phone
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='phone') THEN
    ALTER TABLE public.members ADD COLUMN phone TEXT;
  END IF;

  -- 1.6 PR Domain Specialization
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='pr_domain_skills') THEN
    ALTER TABLE public.members ADD COLUMN pr_domain_skills TEXT DEFAULT 'None (Technical Only)';
  END IF;

  -- 1.7 Joining Year
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='joining_year') THEN
    ALTER TABLE public.members ADD COLUMN joining_year TEXT DEFAULT '2023';
  END IF;

  -- 1.8 Subgroup & Council flags
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='subgroup') THEN
    ALTER TABLE public.members ADD COLUMN subgroup TEXT DEFAULT 'Engineering Domain';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='is_council') THEN
    ALTER TABLE public.members ADD COLUMN is_council BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 1.9 Bi-directional Trigger to Keep 'year' and 'year_of_study' strictly synchronized
CREATE OR REPLACE FUNCTION sync_members_year_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- On INSERT: If year_of_study is provided, populate legacy year
    IF NEW.year_of_study IS NOT NULL AND (NEW.year IS NULL OR NEW.year = '') THEN
      NEW.year = 
        CASE
          WHEN (NEW.year_of_study ILIKE '%4th%' OR NEW.year_of_study ILIKE '%final%') AND NEW.year_of_study NOT ILIKE '%pre-final%' THEN 'Final Year (4th Year)'
          WHEN NEW.year_of_study ILIKE '%3rd%' OR NEW.year_of_study ILIKE '%pre-final%' THEN '3rd Year (Pre-Final)'
          WHEN NEW.year_of_study ILIKE '%2nd%' OR NEW.year_of_study ILIKE '%second%' THEN '2nd Year'
          WHEN NEW.year_of_study ILIKE '%1st%' OR NEW.year_of_study ILIKE '%first%' THEN '1st Year'
          ELSE NEW.year_of_study
        END;
    -- Else if legacy year is provided and year_of_study is missing, populate year_of_study (guarded against 'Pre-Final' collision)
    ELSIF NEW.year IS NOT NULL AND (NEW.year_of_study IS NULL OR NEW.year_of_study = '') THEN
      NEW.year_of_study = 
        CASE 
          WHEN (NEW.year ILIKE '%4th%' OR NEW.year ILIKE '%final%') AND NEW.year NOT ILIKE '%pre-final%' THEN '4th Year'
          WHEN NEW.year ILIKE '%3rd%' OR NEW.year ILIKE '%pre-final%' THEN '3rd Year'
          WHEN NEW.year ILIKE '%2nd%' OR NEW.year ILIKE '%second%' THEN '2nd Year'
          WHEN NEW.year ILIKE '%1st%' OR NEW.year ILIKE '%first%' THEN '1st Year'
          ELSE NEW.year
        END;
    -- If both are provided, ensure legacy year aligns with year_of_study
    ELSIF NEW.year_of_study IS NOT NULL THEN
      NEW.year = 
        CASE
          WHEN (NEW.year_of_study ILIKE '%4th%' OR NEW.year_of_study ILIKE '%final%') AND NEW.year_of_study NOT ILIKE '%pre-final%' THEN 'Final Year (4th Year)'
          WHEN NEW.year_of_study ILIKE '%3rd%' OR NEW.year_of_study ILIKE '%pre-final%' THEN '3rd Year (Pre-Final)'
          WHEN NEW.year_of_study ILIKE '%2nd%' OR NEW.year_of_study ILIKE '%second%' THEN '2nd Year'
          WHEN NEW.year_of_study ILIKE '%1st%' OR NEW.year_of_study ILIKE '%first%' THEN '1st Year'
          ELSE NEW.year_of_study
        END;
    END IF;

  ELSIF TG_OP = 'UPDATE' THEN
    -- On UPDATE: check which field changed (OLD is safe to access only when TG_OP = 'UPDATE')
    IF NEW.year_of_study IS DISTINCT FROM OLD.year_of_study THEN
      NEW.year = 
        CASE
          WHEN (NEW.year_of_study ILIKE '%4th%' OR NEW.year_of_study ILIKE '%final%') AND NEW.year_of_study NOT ILIKE '%pre-final%' THEN 'Final Year (4th Year)'
          WHEN NEW.year_of_study ILIKE '%3rd%' OR NEW.year_of_study ILIKE '%pre-final%' THEN '3rd Year (Pre-Final)'
          WHEN NEW.year_of_study ILIKE '%2nd%' OR NEW.year_of_study ILIKE '%second%' THEN '2nd Year'
          WHEN NEW.year_of_study ILIKE '%1st%' OR NEW.year_of_study ILIKE '%first%' THEN '1st Year'
          ELSE NEW.year_of_study
        END;
    ELSIF NEW.year IS DISTINCT FROM OLD.year THEN
      NEW.year_of_study = 
        CASE 
          WHEN (NEW.year ILIKE '%4th%' OR NEW.year ILIKE '%final%') AND NEW.year NOT ILIKE '%pre-final%' THEN '4th Year'
          WHEN NEW.year ILIKE '%3rd%' OR NEW.year ILIKE '%pre-final%' THEN '3rd Year'
          WHEN NEW.year ILIKE '%2nd%' OR NEW.year ILIKE '%second%' THEN '2nd Year'
          WHEN NEW.year ILIKE '%1st%' OR NEW.year ILIKE '%first%' THEN '1st Year'
          ELSE NEW.year
        END;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_members_year ON public.members;
CREATE TRIGGER trg_sync_members_year
BEFORE INSERT OR UPDATE ON public.members
FOR EACH ROW
EXECUTE FUNCTION sync_members_year_columns();

-- 1.10 Ensure RLS and Policies for Members
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users on members" ON public.members;
CREATE POLICY "Enable read access for all users on members" ON public.members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only on members" ON public.members;
CREATE POLICY "Enable insert for authenticated users only on members" ON public.members FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update for authenticated users only on members" ON public.members;
CREATE POLICY "Enable update for authenticated users only on members" ON public.members FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete for authenticated users only on members" ON public.members;
CREATE POLICY "Enable delete for authenticated users only on members" ON public.members FOR DELETE USING (auth.role() = 'authenticated');


-- -------------------------------------------------------------------------
-- 2. ALUMNI TABLE RESILIENCE & PROGRESSION ALIGNMENT (R3)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.alumni (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  batch TEXT NOT NULL,
  former_role TEXT NOT NULL DEFAULT 'Club Engineer',
  current_company TEXT NOT NULL DEFAULT 'VSSUT Alumni Network',
  role_name TEXT NOT NULL DEFAULT 'Graduate Engineer',
  image_url TEXT NOT NULL DEFAULT '/members/default-avatar.png',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/company/veerracerss-electric/',
  mentorship_domain TEXT NOT NULL DEFAULT 'Vehicle Engineering',
  bio TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DO $$
BEGIN
  -- Add current_role as alias/companion to role_name
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='alumni' AND column_name='current_role') THEN
    ALTER TABLE public.alumni ADD COLUMN current_role TEXT DEFAULT 'Graduate Engineer';
    UPDATE public.alumni SET current_role = role_name WHERE current_role IS NULL;
  END IF;
END $$;

ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all on alumni" ON public.alumni;
CREATE POLICY "Enable read access for all on alumni" ON public.alumni FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated on alumni" ON public.alumni;
CREATE POLICY "Enable insert for authenticated on alumni" ON public.alumni FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update for authenticated on alumni" ON public.alumni;
CREATE POLICY "Enable update for authenticated on alumni" ON public.alumni FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete for authenticated on alumni" ON public.alumni;
CREATE POLICY "Enable delete for authenticated on alumni" ON public.alumni FOR DELETE USING (auth.role() = 'authenticated');


-- -------------------------------------------------------------------------
-- 3. CLUB EXPENSES & BILLS DATABASE (R2)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.club_expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Mechanical & Chassis',
  amount NUMERIC NOT NULL DEFAULT 0,
  vendor TEXT,
  receipt_url TEXT,
  expense_date DATE DEFAULT CURRENT_DATE NOT NULL,
  paid_by TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.club_expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all on club_expenses" ON public.club_expenses;
CREATE POLICY "Enable read access for all on club_expenses" ON public.club_expenses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated on club_expenses" ON public.club_expenses;
CREATE POLICY "Enable insert for authenticated on club_expenses" ON public.club_expenses FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update for authenticated on club_expenses" ON public.club_expenses;
CREATE POLICY "Enable update for authenticated on club_expenses" ON public.club_expenses FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete for authenticated on club_expenses" ON public.club_expenses;
CREATE POLICY "Enable delete for authenticated on club_expenses" ON public.club_expenses FOR DELETE USING (auth.role() = 'authenticated');

-- Seed sample expense vouchers if table empty
INSERT INTO public.club_expenses (title, category, amount, vendor, receipt_url, expense_date, paid_by, notes)
SELECT 'AISI 4130 Chromoly Tubes for Chassis Spaceframe', 'Mechanical & Chassis', 42500, 'Tubes India Corp', '/cars/aether-spotlight.jpg', CURRENT_DATE - 15, 'Captain / Technical Lead', 'Main hoop and front roll hoop structural tubes with mill test certificates.'
WHERE NOT EXISTS (SELECT 1 FROM public.club_expenses WHERE title = 'AISI 4130 Chromoly Tubes for Chassis Spaceframe');

INSERT INTO public.club_expenses (title, category, amount, vendor, receipt_url, expense_date, paid_by, notes)
SELECT 'BMS Master Controller & Isolated CAN Transceivers', 'Electronics & HV Powertrain', 31800, 'ElectroWorld Automation', '/cars/aether.jpg', CURRENT_DATE - 8, 'Electronics Domain Lead', 'Master BMS module with dual CAN transceivers and isolation barriers.'
WHERE NOT EXISTS (SELECT 1 FROM public.club_expenses WHERE title = 'BMS Master Controller & Isolated CAN Transceivers');

INSERT INTO public.club_expenses (title, category, amount, vendor, receipt_url, expense_date, paid_by, notes)
SELECT 'Formula Imperial Scrutiny Safety Harness (FIA 6-Point)', 'Safety & Scrutiny', 18500, 'Motorsport Safety Gears', '/cars/aether.jpg', CURRENT_DATE - 3, 'Safety Officer', 'SFI/FIA approved 6-point quick-release restraint harness.'
WHERE NOT EXISTS (SELECT 1 FROM public.club_expenses WHERE title = 'Formula Imperial Scrutiny Safety Harness (FIA 6-Point)');


-- -------------------------------------------------------------------------
-- 4. RECRUITMENT APPLICATIONS & INDUCTION CHECKLIST (R4 & R5)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recruitment_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  branch TEXT NOT NULL,
  year_of_study TEXT NOT NULL DEFAULT '1st Year',
  primary_domain TEXT NOT NULL,
  secondary_domain TEXT,
  experience_summary TEXT,
  portfolio_url TEXT,
  status TEXT DEFAULT 'Pending' NOT NULL, -- 'Pending', 'Shortlisted', 'Accepted', 'Declined'
  interview_score TEXT DEFAULT 'Pending Review',
  notes TEXT,
  onboarding_email_sent BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.recruitment_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable public application submission on recruitment_applications" ON public.recruitment_applications;
CREATE POLICY "Enable public application submission on recruitment_applications" ON public.recruitment_applications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read access for authenticated on recruitment_applications" ON public.recruitment_applications;
CREATE POLICY "Enable read access for authenticated on recruitment_applications" ON public.recruitment_applications FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update for authenticated on recruitment_applications" ON public.recruitment_applications;
CREATE POLICY "Enable update for authenticated on recruitment_applications" ON public.recruitment_applications FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete for authenticated on recruitment_applications" ON public.recruitment_applications;
CREATE POLICY "Enable delete for authenticated on recruitment_applications" ON public.recruitment_applications FOR DELETE USING (auth.role() = 'authenticated');

-- Seed sample applications if table empty
INSERT INTO public.recruitment_applications (full_name, email, phone, roll_no, branch, year_of_study, primary_domain, secondary_domain, experience_summary, portfolio_url, status, interview_score, notes)
SELECT 'Aman Kumar Dash', 'aman.dash@vssut.ac.in', '+91 94391 22341', '2502040012', 'Electrical Engineering', '1st Year', 'Powertrain & Drivetrain', 'Electronics & Telemetry', 'Experienced in Arduino and high-voltage circuit design; won district robotics competition.', 'https://github.com/aman-dash', 'Shortlisted', '8.5 / 10', 'Strong analytical understanding of BLDC motor control and hall sensors.'
WHERE NOT EXISTS (SELECT 1 FROM public.recruitment_applications WHERE email = 'aman.dash@vssut.ac.in');

INSERT INTO public.recruitment_applications (full_name, email, phone, roll_no, branch, year_of_study, primary_domain, secondary_domain, experience_summary, portfolio_url, status, interview_score, notes)
SELECT 'Priya Sahu', 'priya.sahu@vssut.ac.in', '+91 98610 88722', '2502030045', 'Mechanical Engineering', '1st Year', 'Chassis & Aerodynamics', 'Suspension & Steering', 'Hands-on CAD modeling in SolidWorks and ANSYS structural simulation; passion for aerodynamic downforce optimization.', 'https://linkedin.com/in/priya-sahu-vssut', 'Pending', 'Pending Review', 'Scheduled for round 2 technical interview.'
WHERE NOT EXISTS (SELECT 1 FROM public.recruitment_applications WHERE email = 'priya.sahu@vssut.ac.in');


-- -------------------------------------------------------------------------
-- 5. SITE SETTINGS: PR MASTER TOGGLE & ONBOARDING EMAIL CONFIG (R4 & R5)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  recruitment_cta_label TEXT NOT NULL DEFAULT 'RECRUITMENT 2026',
  recruitment_cta_url TEXT NOT NULL DEFAULT '/recruitment',
  recruitment_cta_enabled BOOLEAN NOT NULL DEFAULT true,
  announcement_badge_text TEXT NOT NULL DEFAULT 'FORMULA STUDENT ELECTRIC // VSSUT BURLA',
  announcement_badge_enabled BOOLEAN NOT NULL DEFAULT true,
  contact_email TEXT NOT NULL DEFAULT 'veerracersselectric.database@gmail.com',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='site_settings' AND column_name='recruitment_form_enabled') THEN
    ALTER TABLE public.site_settings ADD COLUMN recruitment_form_enabled BOOLEAN DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='site_settings' AND column_name='recruitment_form_title') THEN
    ALTER TABLE public.site_settings ADD COLUMN recruitment_form_title TEXT DEFAULT 'Formula Student Electric 2026 - Official Recruitment';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='site_settings' AND column_name='recruitment_form_deadline') THEN
    ALTER TABLE public.site_settings ADD COLUMN recruitment_form_deadline TEXT DEFAULT 'Season 2026 Phase 1';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='site_settings' AND column_name='whatsapp_recruit_link') THEN
    ALTER TABLE public.site_settings ADD COLUMN whatsapp_recruit_link TEXT DEFAULT 'https://chat.whatsapp.com/veerracerss-recruits-2026';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='site_settings' AND column_name='onboarding_email_template') THEN
    ALTER TABLE public.site_settings ADD COLUMN onboarding_email_template TEXT DEFAULT 'Dear {{name}},

Congratulations! On behalf of VeerRacerss Electric, we are thrilled to formally welcome you to the official Formula Student team of VSSUT Burla for Season 2026.

Based on your technical evaluation and domain interviews, you have been selected for the {{domain}} engineering division.

ORIENTATION DETAILS:
• Date & Time: Saturday at 5:00 PM
• Venue: Formula Student Research Workshop, Mechanical Block, VSSUT Burla
• Agenda: Safety briefing, CAD/CAE tools setup, high-voltage battery safety protocol, and sub-team allocation.

OFFICIAL RECRUITS WHATSAPP GROUP:
Please join the official team communication channel here: {{whatsapp_link}}

Wear comfortable footwear and bring a notebook. We look forward to engineering our next electric racecar together with you!

Warm regards,
Team Captain & Executive Council
VeerRacerss Electric // VSSUT Burla
veerracersselectric.database@gmail.com';
  END IF;
END $$;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all on site_settings" ON public.site_settings;
CREATE POLICY "Enable read access for all on site_settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable update for authenticated on site_settings" ON public.site_settings;
CREATE POLICY "Enable update for authenticated on site_settings" ON public.site_settings FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable insert for authenticated on site_settings" ON public.site_settings;
CREATE POLICY "Enable insert for authenticated on site_settings" ON public.site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Ensure default row exists and has defaults populated
INSERT INTO public.site_settings (
  recruitment_cta_label,
  recruitment_cta_url,
  recruitment_cta_enabled,
  announcement_badge_text,
  announcement_badge_enabled,
  contact_email,
  recruitment_form_enabled,
  recruitment_form_title,
  recruitment_form_deadline,
  whatsapp_recruit_link
)
SELECT 
  'RECRUITMENT 2026', 
  '/recruitment', 
  true, 
  'FORMULA STUDENT ELECTRIC // VSSUT BURLA', 
  true, 
  'veerracersselectric.database@gmail.com',
  true,
  'Formula Student Electric 2026 - Official Recruitment',
  'Season 2026 Phase 1',
  'https://chat.whatsapp.com/veerracerss-recruits-2026'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

UPDATE public.site_settings 
SET 
  recruitment_form_enabled = COALESCE(recruitment_form_enabled, true),
  recruitment_form_title = COALESCE(recruitment_form_title, 'Formula Student Electric 2026 - Official Recruitment'),
  recruitment_form_deadline = COALESCE(recruitment_form_deadline, 'Season 2026 Phase 1'),
  whatsapp_recruit_link = COALESCE(whatsapp_recruit_link, 'https://chat.whatsapp.com/veerracerss-recruits-2026')
WHERE id IS NOT NULL;


-- -------------------------------------------------------------------------
-- 6. CUSTOM DATABASES (DYNAMIC REGISTRIES)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.custom_databases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  db_name TEXT NOT NULL,
  description TEXT,
  schema_definition JSONB NOT NULL DEFAULT '[]'::jsonb,
  records JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.custom_databases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all on custom_databases" ON public.custom_databases;
CREATE POLICY "Enable read access for all on custom_databases" ON public.custom_databases FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated on custom_databases" ON public.custom_databases;
CREATE POLICY "Enable insert for authenticated on custom_databases" ON public.custom_databases FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update for authenticated on custom_databases" ON public.custom_databases;
CREATE POLICY "Enable update for authenticated on custom_databases" ON public.custom_databases FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete for authenticated on custom_databases" ON public.custom_databases;
CREATE POLICY "Enable delete for authenticated on custom_databases" ON public.custom_databases FOR DELETE USING (auth.role() = 'authenticated');

-- Seed initial custom databases
INSERT INTO public.custom_databases (db_name, description, schema_definition, records)
SELECT 
  'Workshop Tools & Equipment Registry',
  'Inventory of mechanical fabrication tools, electrical multimeters, and dyno instruments',
  '[
    {"key": "tool_name", "label": "Tool / Equipment Name", "type": "text"},
    {"key": "domain", "label": "Assigned Domain", "type": "text"},
    {"key": "quantity", "label": "Quantity", "type": "number"},
    {"key": "condition", "label": "Current Condition", "type": "text"},
    {"key": "storage_bay", "label": "Storage Bay", "type": "text"}
  ]'::jsonb,
  '[
    {"id": "1", "tool_name": "TIG Welding Torch & Argon Regulator", "domain": "Chassis & Fabrication", "quantity": 2, "condition": "Operational - Calibrated", "storage_bay": "Bay A - Metal Fabrication"},
    {"id": "2", "tool_name": "Keysight 2-Channel Digital Oscilloscope", "domain": "Powertrain & Electronics", "quantity": 1, "condition": "Operational", "storage_bay": "Bay B - Electrical Lab Bench"},
    {"id": "3", "tool_name": "Mitutoyo Digital Vernier Caliper (300mm)", "domain": "Suspension & Wheel Assembly", "quantity": 3, "condition": "Good", "storage_bay": "Tool Chest #2"},
    {"id": "4", "tool_name": "Digital Tyre Pressure Gauge & Pyrometer", "domain": "Track Vehicle Dynamics", "quantity": 2, "condition": "Field Ready", "storage_bay": "Pit Flight Case"}
  ]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.custom_databases WHERE db_name = 'Workshop Tools & Equipment Registry');

INSERT INTO public.custom_databases (db_name, description, schema_definition, records)
SELECT 
  'Sponsorship & Corporate Outreach Pipeline',
  'Status of technical partnerships, raw material sponsors, and industrial support',
  '[
    {"key": "company_name", "label": "Company / Partner", "type": "text"},
    {"key": "tier", "label": "Sponsorship Tier", "type": "text"},
    {"key": "poc_name", "label": "POC / Contact Person", "type": "text"},
    {"key": "status", "label": "Discussion Status", "type": "text"},
    {"key": "contribution_value", "label": "Support / Valuation", "type": "text"}
  ]'::jsonb,
  '[
    {"id": "1", "company_name": "Hindalco Industries", "tier": "Title Partner", "poc_name": "CSR & Technical Relations Desk", "status": "Confirmed / MoU Signed", "contribution_value": "Raw Aluminium & Fabrication Grants"},
    {"id": "2", "company_name": "Ansys Academic Program", "tier": "Technical Software Partner", "poc_name": "University Lead", "status": "Active License", "contribution_value": "25 CFD & FEA Simulation Seats"},
    {"id": "3", "company_name": "MCL (Mahanadi Coalfields)", "tier": "Principal CSR Sponsor", "poc_name": "Public Relations Office", "status": "Proposal Under Final Review", "contribution_value": "₹3,50,000 EV Battery Research Grant"}
  ]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.custom_databases WHERE db_name = 'Sponsorship & Corporate Outreach Pipeline');


-- -------------------------------------------------------------------------
-- 7. STORAGE BUCKET CREATION FOR BILLS & ATTACHMENTS (R2)
-- -------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('expenses-receipts', 'expenses-receipts', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access on expenses-receipts" ON storage.objects;
CREATE POLICY "Public Access on expenses-receipts" ON storage.objects FOR SELECT USING (bucket_id = 'expenses-receipts');

DROP POLICY IF EXISTS "Auth Upload on expenses-receipts" ON storage.objects;
CREATE POLICY "Auth Upload on expenses-receipts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'expenses-receipts' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth Delete on expenses-receipts" ON storage.objects;
CREATE POLICY "Auth Delete on expenses-receipts" ON storage.objects FOR DELETE USING (bucket_id = 'expenses-receipts' AND auth.role() = 'authenticated');
