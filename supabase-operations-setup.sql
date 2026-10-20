-- =========================================================================
-- VEERRACERSS ELECTRIC // CLUB OPERATIONS & AUTOMATIONS SETUP SCRIPT
-- =========================================================================
-- Execute this script in your Supabase SQL Editor (Dashboard -> SQL Editor).
-- This configures:
-- 1. Member datasheet fields
-- 2. Club expenses & bills database
-- 3. Recruitment applications & induction checklist table
-- 4. Dynamic custom databases table (tools, inventory, sponsorship)
-- 5. Site settings extensions for recruitment toggle & onboarding emails
-- =========================================================================

-- 1. EXTEND MEMBERS TABLE FOR COMPLETE DATASHEETS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='year_of_study') THEN
    ALTER TABLE public.members ADD COLUMN year_of_study TEXT DEFAULT '3rd Year';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='roll_no') THEN
    ALTER TABLE public.members ADD COLUMN roll_no TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='academic_branch') THEN
    ALTER TABLE public.members ADD COLUMN academic_branch TEXT DEFAULT 'Mechanical Engineering';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='blood_group') THEN
    ALTER TABLE public.members ADD COLUMN blood_group TEXT DEFAULT 'O+';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='phone') THEN
    ALTER TABLE public.members ADD COLUMN phone TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='emergency_contact') THEN
    ALTER TABLE public.members ADD COLUMN emergency_contact TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='joining_year') THEN
    ALTER TABLE public.members ADD COLUMN joining_year TEXT DEFAULT '2023';
  END IF;
END $$;


-- 2. CLUB EXPENSES & BILLS DATABASE
CREATE TABLE IF NOT EXISTS public.club_expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Mechanical & Chassis',
  amount NUMERIC NOT NULL DEFAULT 0,
  vendor TEXT,
  receipt_url TEXT,
  expense_date DATE DEFAULT CURRENT_DATE NOT NULL,
  paid_by TEXT,
  status TEXT DEFAULT 'Approved' NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.club_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all on club_expenses" ON public.club_expenses FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated on club_expenses" ON public.club_expenses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated on club_expenses" ON public.club_expenses FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated on club_expenses" ON public.club_expenses FOR DELETE USING (auth.role() = 'authenticated');

-- Seed initial expense records
INSERT INTO public.club_expenses (title, category, amount, vendor, receipt_url, expense_date, paid_by, status, notes)
SELECT 'AISI 4130 Chromoly Tubes for Chassis Spaceframe', 'Mechanical & Chassis', 42500, 'Tubes India Corp', '/cars/aether-spotlight.jpg', CURRENT_DATE - 15, 'Captain / Technical Lead', 'Approved', 'Main hoop and front roll hoop structural tubes with mill test certificates.'
WHERE NOT EXISTS (SELECT 1 FROM public.club_expenses WHERE title = 'AISI 4130 Chromoly Tubes for Chassis Spaceframe');

INSERT INTO public.club_expenses (title, category, amount, vendor, receipt_url, expense_date, paid_by, status, notes)
SELECT 'BMS Master Controller & Isolated Can Tranceivers', 'Electronics & HV Powertrain', 31800, 'ElectroWorld Automation', '/cars/aether.jpg', CURRENT_DATE - 8, 'Electronics Domain Lead', 'Approved', 'Master BMS module with dual CAN transceivers and isolation barriers.'
WHERE NOT EXISTS (SELECT 1 FROM public.club_expenses WHERE title = 'BMS Master Controller & Isolated Can Tranceivers');

INSERT INTO public.club_expenses (title, category, amount, vendor, receipt_url, expense_date, paid_by, status, notes)
SELECT 'Formula Imperial Scrutiny Safety Harness (FIA 6-Point)', 'Safety & Scrutiny', 18500, 'Motorsport Safety Gears', '/cars/aether.jpg', CURRENT_DATE - 3, 'Safety Officer', 'Approved', 'SFI/FIA approved 6-point quick-release restraint harness.'
WHERE NOT EXISTS (SELECT 1 FROM public.club_expenses WHERE title = 'Formula Imperial Scrutiny Safety Harness (FIA 6-Point)');


-- 3. RECRUITMENT APPLICATIONS & INDUCTION CHECKLIST
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
  onboarding_email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.recruitment_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public application submission" ON public.recruitment_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for authenticated on recruitment_applications" ON public.recruitment_applications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated on recruitment_applications" ON public.recruitment_applications FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated on recruitment_applications" ON public.recruitment_applications FOR DELETE USING (auth.role() = 'authenticated');

-- Seed sample recruitment submissions
INSERT INTO public.recruitment_applications (full_name, email, phone, roll_no, branch, year_of_study, primary_domain, secondary_domain, experience_summary, portfolio_url, status, interview_score, notes)
SELECT 'Aman Kumar Dash', 'aman.dash@vssut.ac.in', '+91 94391 22341', '2502040012', 'Electrical Engineering', '1st Year', 'Powertrain & Drivetrain', 'Electronics & Telemetry', 'Experienced in Arduino and high-voltage circuit design; won district robotics competition.', 'https://github.com/aman-dash', 'Shortlisted', '8.5 / 10', 'Strong analytical understanding of BLDC motor control and hall sensors.'
WHERE NOT EXISTS (SELECT 1 FROM public.recruitment_applications WHERE email = 'aman.dash@vssut.ac.in');

INSERT INTO public.recruitment_applications (full_name, email, phone, roll_no, branch, year_of_study, primary_domain, secondary_domain, experience_summary, portfolio_url, status, interview_score, notes)
SELECT 'Priya Sahu', 'priya.sahu@vssut.ac.in', '+91 98610 88722', '2502030045', 'Mechanical Engineering', '1st Year', 'Chassis & Aerodynamics', 'Suspension & Steering', 'Hands-on CAD modeling in SolidWorks and ANSYS structural simulation; passion for aerodynamic downforce optimization.', 'https://linkedin.com/in/priya-sahu-vssut', 'Pending', 'Pending Review', 'Scheduled for round 2 technical interview.'
WHERE NOT EXISTS (SELECT 1 FROM public.recruitment_applications WHERE email = 'priya.sahu@vssut.ac.in');


-- 4. DYNAMIC CUSTOM DATABASES (EQUIPMENT, TOOLS, SPONSORSHIP LEADS)
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
CREATE POLICY "Enable read access for all on custom_databases" ON public.custom_databases FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated on custom_databases" ON public.custom_databases FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated on custom_databases" ON public.custom_databases FOR UPDATE USING (auth.role() = 'authenticated');
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


-- 5. EXTEND SITE SETTINGS FOR RECRUITMENT TOGGLE & ONBOARDING TEMPLATES
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='recruitment_form_enabled') THEN
    ALTER TABLE public.site_settings ADD COLUMN recruitment_form_enabled BOOLEAN DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='recruitment_form_title') THEN
    ALTER TABLE public.site_settings ADD COLUMN recruitment_form_title TEXT DEFAULT 'Formula Student Electric 2026 - Official Recruitment';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='recruitment_form_deadline') THEN
    ALTER TABLE public.site_settings ADD COLUMN recruitment_form_deadline TEXT DEFAULT 'Season 2026 Phase 1';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='onboarding_email_template') THEN
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
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='whatsapp_recruit_link') THEN
    ALTER TABLE public.site_settings ADD COLUMN whatsapp_recruit_link TEXT DEFAULT 'https://chat.whatsapp.com/veerracerss-recruits-2026';
  END IF;
END $$;
