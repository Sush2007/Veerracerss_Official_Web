export interface SiteSettings {
  recruitment_cta_label: string;
  recruitment_cta_url: string;
  recruitment_cta_enabled: boolean;
  announcement_badge_text: string;
  announcement_badge_enabled: boolean;
  contact_email: string;
  recruitment_form_enabled?: boolean;
  recruitment_form_title?: string;
  recruitment_form_deadline?: string;
  onboarding_email_template?: string;
  whatsapp_recruit_link?: string;
}

export interface MemberRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  image_url: string;
  linkedin?: string;
  instagram?: string;
  year?: string; // Legacy/Public sync: '1st Year' | '2nd Year' | '3rd Year (Pre-Final)' | 'Final Year (4th Year)'
  year_of_study?: string; // '1st Year' | '2nd Year' | '3rd Year' | '4th Year'
  academic_branch?: string;
  blood_group?: string;
  phone?: string;
  pr_domain_skills?: string; // Optional: 'Web Development' | 'Graphic Designing' | 'Video Editing' | etc.
  joining_year?: string;
  subgroup?: string;
  is_council?: boolean;
  created_at?: string;
}

export interface ClubExpense {
  id: string;
  title: string;
  category: string;
  amount: number;
  vendor?: string;
  receipt_url?: string;
  expense_date: string;
  paid_by?: string;
  notes?: string;
  created_at?: string;
}

export interface RecruitmentApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  roll_no: string;
  branch: string;
  year_of_study: string;
  primary_domain: string;
  secondary_domain?: string;
  experience_summary?: string;
  portfolio_url?: string;
  status: 'Pending' | 'Shortlisted' | 'Accepted' | 'Declined';
  interview_score?: string;
  notes?: string;
  onboarding_email_sent?: boolean;
  created_at?: string;
}

export interface CustomDatabaseColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date';
}

export interface CustomDatabaseRecord {
  id: string;
  db_name: string;
  description?: string;
  schema_definition: CustomDatabaseColumn[];
  records: Record<string, any>[];
  created_at?: string;
  updated_at?: string;
}

export interface FeaturedMachine {
  car_name: string;
  season_tag: string;
  description: string;
  cad_image_url: string;
  track_image_url: string;
  top_speed_val: string;
  accel_val: string;
  voltage_val: string;
  weight_val: string;
  powertrain_headline: string;
  powertrain_specs: string;
  accumulator_headline: string;
  accumulator_specs: string;
  chassis_headline: string;
  chassis_specs: string;
  aero_headline: string;
  aero_specs: string;
}

export interface MediaItem {
  id: string;
  title: string;
  media_type: 'image' | 'video';
  media_url: string;
  thumbnail_url?: string;
  year: string;
  featured_on_home: boolean;
  order_index: number;
}

export interface AlumniRecord {
  id: string;
  name: string;
  batch: string;
  former_role: string;
  current_company: string;
  role_name?: string;
  current_role?: string;
  image_url: string;
  linkedin_url: string;
  mentorship_domain: string;
  bio?: string;
  order_index?: number;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  recruitment_cta_label: "RECRUITMENT 2026",
  recruitment_cta_url: "/recruitment",
  recruitment_cta_enabled: true,
  announcement_badge_text: "FORMULA STUDENT ELECTRIC // VSSUT BURLA",
  announcement_badge_enabled: true,
  contact_email: "veerracersselectric.database@gmail.com",
  recruitment_form_enabled: true,
  recruitment_form_title: "Formula Student Electric 2026 - Official Recruitment",
  recruitment_form_deadline: "Season 2026 Phase 1 Induction",
  whatsapp_recruit_link: "https://chat.whatsapp.com/veerracerss-recruits-2026",
  onboarding_email_template: `Dear {{name}},

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
veerracersselectric.database@gmail.com`,
};

export const DEFAULT_FEATURED_MACHINE: FeaturedMachine = {
  car_name: "AETHER 2024-25",
  season_tag: "FORMULA STUDENT EV PROTOTYPE",
  description: "Engineered from the ground up by student engineers at VSSUT Burla. Passing rigorous technical scrutiny at Formula Imperial (Buddh International Circuit).",
  cad_image_url: "/cars/aether-spotlight.jpg",
  track_image_url: "/cars/aether.jpg",
  top_speed_val: "115",
  accel_val: "3.1",
  voltage_val: "72",
  weight_val: "182",
  powertrain_headline: "10 kW PMSM Motor",
  powertrain_specs: "85 Nm Peak Torque • Direct Chain Reduction • Regenerative Braking",
  accumulator_headline: "72V High-Energy Li-Ion Pack",
  accumulator_specs: "In-House BMS • Active Thermal Monitoring • IP67 Isolation",
  chassis_headline: "AISI 4130 Chromoly Spaceframe",
  chassis_specs: "182 kg Curb Weight • Torsional Stiffness > 1450 Nm/deg • FIA Egress",
  aero_headline: "Dual-Element Carbon Wings",
  aero_specs: "CFD Optimised Endplates • Drag Reduction System • High Downforce",
};

export const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  {
    id: "media-1",
    title: "AETHER Track Testing at Buddh International Circuit",
    media_type: "image",
    media_url: "/cars/aether.jpg",
    year: "2025",
    featured_on_home: true,
    order_index: 1,
  },
  {
    id: "media-2",
    title: "Chassis & Spaceframe CAD Simulation",
    media_type: "image",
    media_url: "/cars/aether-spotlight.jpg",
    year: "2024",
    featured_on_home: true,
    order_index: 2,
  },
  {
    id: "media-3",
    title: "Formula Imperial Podium Ceremony",
    media_type: "image",
    media_url: "/achievements/formula-imperial-2024.jpg",
    year: "2024",
    featured_on_home: true,
    order_index: 3,
  },
  {
    id: "media-4",
    title: "National Technical Scrutineering",
    media_type: "image",
    media_url: "/achievements/formula-imperial-2023.jpg",
    year: "2023",
    featured_on_home: true,
    order_index: 4,
  },
  {
    id: "media-5",
    title: "High-Voltage Powertrain Dyno Validation",
    media_type: "image",
    media_url: "/achievements/pi-ev-2022.jpg",
    year: "2022",
    featured_on_home: true,
    order_index: 5,
  },
  {
    id: "media-6",
    title: "Endurance Track Run at Formula Imperial",
    media_type: "image",
    media_url: "/achievements/formula-imperial-2025.jpg",
    year: "2025",
    featured_on_home: true,
    order_index: 6,
  },
  {
    id: "media-7",
    title: "Team Workshop Fabrication & Assembly",
    media_type: "image",
    media_url: "/achievements/supra-sae-2026.jpg",
    year: "2024",
    featured_on_home: true,
    order_index: 7,
  },
];

export const DEFAULT_ALUMNI_RECORDS: AlumniRecord[] = [
  {
    id: "siddhartha-senapati",
    name: "Siddhartha Senapati",
    batch: "Batch 2021",
    former_role: "Former Team Captain & Powertrain Lead",
    current_company: "Ather Energy",
    role_name: "Battery Systems Engineer",
    current_role: "Battery Systems Engineer",
    image_url: "/alumni/siddhartha-senapati.jpg",
    linkedin_url: "https://www.linkedin.com/company/veerracerss-electric/",
    mentorship_domain: "Li-Ion Thermal Architecture & BMS",
    bio: "Pioneered VeerRacerss initial transition into high-voltage electric powertrains; now driving battery pack thermal safety and pack engineering at Ather Energy.",
    order_index: 1,
  },
  {
    id: "priyanka-das",
    name: "Priyanka Das",
    batch: "Batch 2022",
    former_role: "Former Powertrain Lead",
    current_company: "Tata Motors EV",
    role_name: "Powertrain Calibration Lead",
    current_role: "Powertrain Calibration Lead",
    image_url: "/alumni/priyanka-das.jpg",
    linkedin_url: "https://www.linkedin.com/company/veerracerss-electric/",
    mentorship_domain: "Motor Inverter Tuning & Drive Cycles",
    bio: "Engineered vehicle dynamometer testing pipelines for Aether; currently calibrating permanent magnet electric motor drives across production Tata EVs.",
    order_index: 2,
  },
  {
    id: "aman-patnaik",
    name: "Aman Patnaik",
    batch: "Batch 2023",
    former_role: "Former Chassis & Vehicle Dynamics Lead",
    current_company: "Mahindra Racing",
    role_name: "Vehicle Dynamics Engineer",
    current_role: "Vehicle Dynamics Engineer",
    image_url: "/alumni/aman-patnaik.jpg",
    linkedin_url: "https://www.linkedin.com/company/veerracerss-electric/",
    mentorship_domain: "Suspension Kinematics & CFD Aero",
    bio: "Designed our multi-link double-wishbone suspension setup; currently developing dynamic lap simulations and track vehicle dynamics with Mahindra Racing.",
    order_index: 3,
  },
  {
    id: "rohan-mohanty",
    name: "Rohan Mohanty",
    batch: "Batch 2023",
    former_role: "Former Electronics & Telemetry Lead",
    current_company: "Ola Electric",
    role_name: "Motor Controller Firmware",
    current_role: "Motor Controller Firmware",
    image_url: "/alumni/rohan-mohanty.jpg",
    linkedin_url: "https://www.linkedin.com/company/veerracerss-electric/",
    mentorship_domain: "CAN-Bus Telemetry & Embedded Firmware",
    bio: "Architected custom telemetry logging units streaming real-time tire temperatures; now building field-oriented control firmware for high-performance EV controllers.",
    order_index: 4,
  },
];

export const DEFAULT_EXPENSES: ClubExpense[] = [
  {
    id: "exp-1",
    title: "AISI 4130 Chromoly Tubes for Chassis Spaceframe",
    category: "Mechanical & Chassis",
    amount: 42500,
    vendor: "Tubes India Corp",
    receipt_url: "/cars/aether-spotlight.jpg",
    expense_date: "2026-02-15",
    paid_by: "Captain / Technical Lead",
    notes: "Main hoop and front roll hoop structural tubes with mill test certificates.",
  },
  {
    id: "exp-2",
    title: "BMS Master Controller & Isolated CAN Transceivers",
    category: "Electronics & HV Powertrain",
    amount: 31800,
    vendor: "ElectroWorld Automation",
    receipt_url: "/cars/aether.jpg",
    expense_date: "2026-02-22",
    paid_by: "Electronics Domain Lead",
    notes: "Master BMS module with dual CAN transceivers and isolation barriers.",
  },
  {
    id: "exp-3",
    title: "Formula Imperial Scrutiny Safety Harness (FIA 6-Point)",
    category: "Safety & Scrutiny",
    amount: 18500,
    vendor: "Motorsport Safety Gears",
    receipt_url: "/cars/aether.jpg",
    expense_date: "2026-03-01",
    paid_by: "Safety Officer",
    notes: "SFI/FIA approved 6-point quick-release restraint harness.",
  },
];

export const DEFAULT_RECRUITS: RecruitmentApplication[] = [
  {
    id: "rec-1",
    full_name: "Aman Kumar Dash",
    email: "aman.dash@vssut.ac.in",
    phone: "+91 94391 22341",
    roll_no: "2502040012",
    branch: "Electrical Engineering",
    year_of_study: "1st Year",
    primary_domain: "Powertrain & Drivetrain",
    secondary_domain: "Electronics & Telemetry",
    experience_summary: "Experienced in Arduino and high-voltage circuit design; won district robotics competition.",
    portfolio_url: "https://github.com/aman-dash",
    status: "Shortlisted",
    interview_score: "8.5 / 10",
    notes: "Strong analytical understanding of BLDC motor control and hall sensors.",
    onboarding_email_sent: false,
    created_at: "2026-03-02T10:15:00Z",
  },
  {
    id: "rec-2",
    full_name: "Priya Sahu",
    email: "priya.sahu@vssut.ac.in",
    phone: "+91 98610 88722",
    roll_no: "2502030045",
    branch: "Mechanical Engineering",
    year_of_study: "1st Year",
    primary_domain: "Chassis & Design",
    secondary_domain: "Suspension & Steering",
    experience_summary: "Hands-on CAD modeling in SolidWorks and ANSYS structural simulation; passion for aerodynamic downforce optimization.",
    portfolio_url: "https://linkedin.com/in/priya-sahu-vssut",
    status: "Pending",
    interview_score: "Pending Review",
    notes: "Scheduled for round 2 technical interview.",
    onboarding_email_sent: false,
    created_at: "2026-03-03T14:30:00Z",
  },
];

export const DEFAULT_CUSTOM_DATABASES: CustomDatabaseRecord[] = [
  {
    id: "cdb-1",
    db_name: "Workshop Tools & Equipment Registry",
    description: "Inventory of mechanical fabrication tools, electrical multimeters, and dyno instruments",
    schema_definition: [
      { key: "tool_name", label: "Tool / Equipment Name", type: "text" },
      { key: "domain", label: "Assigned Domain", type: "text" },
      { key: "quantity", label: "Quantity", type: "number" },
      { key: "condition", label: "Current Condition", type: "text" },
      { key: "storage_bay", label: "Storage Bay", type: "text" },
    ],
    records: [
      { id: "1", tool_name: "TIG Welding Torch & Argon Regulator", domain: "Chassis & Fabrication", quantity: 2, condition: "Operational - Calibrated", storage_bay: "Bay A - Metal Fabrication" },
      { id: "2", tool_name: "Keysight 2-Channel Digital Oscilloscope", domain: "Powertrain & Electronics", quantity: 1, condition: "Operational", storage_bay: "Bay B - Electrical Lab Bench" },
      { id: "3", tool_name: "Mitutoyo Digital Vernier Caliper (300mm)", domain: "Suspension & Wheel Assembly", quantity: 3, condition: "Good", storage_bay: "Tool Chest #2" },
      { id: "4", tool_name: "Digital Tyre Pressure Gauge & Pyrometer", domain: "Track Vehicle Dynamics", quantity: 2, condition: "Field Ready", storage_bay: "Pit Flight Case" },
    ],
  },
  {
    id: "cdb-2",
    db_name: "Sponsorship & Corporate Outreach Pipeline",
    description: "Status of technical partnerships, raw material sponsors, and industrial support",
    schema_definition: [
      { key: "company_name", label: "Company / Partner", type: "text" },
      { key: "tier", label: "Sponsorship Tier", type: "text" },
      { key: "poc_name", label: "POC / Contact Person", type: "text" },
      { key: "status", label: "Discussion Status", type: "text" },
      { key: "contribution_value", label: "Support / Valuation", type: "text" },
    ],
    records: [
      { id: "1", company_name: "Hindalco Industries", tier: "Title Partner", poc_name: "CSR & Technical Relations Desk", status: "Confirmed / MoU Signed", contribution_value: "Raw Aluminium & Fabrication Grants" },
      { id: "2", company_name: "Ansys Academic Program", tier: "Technical Software Partner", poc_name: "University Lead", status: "Active License", contribution_value: "25 CFD & FEA Simulation Seats" },
      { id: "3", company_name: "MCL (Mahanadi Coalfields)", tier: "Principal CSR Sponsor", poc_name: "Public Relations Office", status: "Proposal Under Final Review", contribution_value: "₹3,50,000 EV Battery Research Grant" },
    ],
  },
];
