export interface RecruitmentCustomQuestion {
  id: string;
  label: string;
  type: 'textbox' | 'dropdown';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export interface SiteSettings {
  hero_title?: string;
  hero_subtitle?: string;
  recruitment_cta_label: string;
  recruitment_cta_url: string;
  recruitment_cta_enabled: boolean;
  announcement_badge_text: string;
  announcement_badge_enabled: boolean;
  contact_email: string;
  recruitment_open?: boolean;
  recruitment_form_enabled?: boolean;
  recruitment_form_title?: string;
  recruitment_form_deadline?: string;
  recruitment_instructions?: string;
  recruitment_eligibility?: string;
  recruitment_question_prompt?: string;
  recruitment_custom_questions?: RecruitmentCustomQuestion[];
  onboarding_email_subject?: string;
  onboarding_email_template?: string;
  whatsapp_recruit_link?: string;
  about_image_url?: string;
  about_title?: string;
  about_subtitle?: string;
  about_description?: string;
  telemetry_stats?: Array<{
    stat: string;
    unit: string;
    label: string;
    detail: string;
  }>;
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
  cad_model_url?: string;
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

export interface VehicleRecord {
  id: string;
  name: string;
  year: string;
  category: "EV" | "Combustion";
  tagline?: string;
  competition: string;
  description: string;
  image: string;
  cad_image?: string;
  cad_model_url?: string;
  stats: {
    speed: string;
    accel: string;
    weight: string;
    power: string;
    voltage?: string;
  };
  features: string[];
  subsystems?: {
    powertrain_headline?: string;
    powertrain_specs?: string;
    accumulator_headline?: string;
    accumulator_specs?: string;
    chassis_headline?: string;
    chassis_specs?: string;
    aero_headline?: string;
    aero_specs?: string;
  };
  is_spotlight?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SponsorRecord {
  id: string;
  name: string;
  category: string;
  logo: string;
  url: string;
  tier: "title" | "partner";
  order_index?: number;
}

export interface AwardItem {
  title: string;
  rank?: string;
  category?: string;
  type: "champion" | "runner_up" | "podium" | "top10" | "special";
}

export interface CompetitionAchievement {
  id: string;
  year: string;
  competition: string;
  tagline: string;
  location: string;
  carName?: string;
  image?: string;
  isChampion?: boolean;
  featured?: boolean;
  awards: AwardItem[];
  summary: string;
}

export const DEFAULT_ACHIEVEMENTS: CompetitionAchievement[] = [
  {
    id: "supra-sae-2026",
    year: "2026",
    competition: "SUPRA SAE INDIA 2026",
    tagline: "National Top-10 Design & Social Excellence",
    location: "Formula Student India Track",
    featured: true,
    awards: [
      {
        title: "BEST SOCIAL MEDIA AWARD",
        category: "Media & Outreach",
        type: "special"
      },
      {
        title: "AIR-9 IN BUSINESS PRESENTATION",
        rank: "AIR 9",
        category: "Static Event",
        type: "top10"
      },
      {
        title: "AIR-10 IN DESIGN PRESENTATION",
        rank: "AIR 10",
        category: "Engineering Design",
        type: "top10"
      },
      {
        title: "AIR-11 IN COST PRESENTATION",
        rank: "AIR 11",
        category: "Manufacturing & Cost",
        type: "top10"
      }
    ],
    summary: "Delivered standout static engineering evaluations at SUPRA SAE India, penetrating the national top-10 across Business & Design while capturing the Best Social Media honor nationwide."
  },
  {
    id: "formula-imperial-2025",
    year: "2025",
    competition: "FORMULA IMPERIAL 2025",
    tagline: "National Champions in Lightweight Chassis & EV Runner-Up",
    location: "Buddh International Circuit, Greater Noida",
    isChampion: true,
    featured: true,
    awards: [
      {
        title: "AIR-1 IN LIGHTEST WEIGHT",
        rank: "AIR 1",
        category: "Structural Dynamics",
        type: "champion"
      },
      {
        title: "AIR-2 IN EV CATEGORY",
        rank: "AIR 2",
        category: "Overall Electric",
        type: "runner_up"
      },
      {
        title: "AIR-2 IN BUSINESS PLAN",
        rank: "AIR 2",
        category: "Commercial Scalability",
        type: "runner_up"
      },
      {
        title: "BEST WOMEN PARTICIPATION",
        category: "Diversity & Inclusion",
        type: "special"
      }
    ],
    summary: "Dominated Buddh International Circuit with an ultralight carbon-tubular architecture, capturing All India Rank 1 in Lightest Weight alongside 2nd overall in the Electric Vehicle division."
  },
  {
    id: "formula-imperial-2024",
    year: "2024",
    competition: "FORMULA IMPERIAL 2024",
    tagline: "National Podium Finish in Electric Class",
    location: "Buddh International Circuit, Greater Noida",
    carName: "AETHER",
    awards: [
      {
        title: "AIR-3 IN EV CATEGORY",
        rank: "AIR 3",
        category: "Overall Electric",
        type: "podium"
      }
    ],
    summary: "Campaigned AETHER—Odisha's first collegiate Formula Student EV—powered by a custom 72V battery pack and PMSM drive to seize the 3rd place National EV podium at BIC."
  },
  {
    id: "formula-imperial-2023",
    year: "2023",
    competition: "FORMULA IMPERIAL 2023",
    tagline: "Double All India Rank 1 & Endurance Champions",
    location: "Formula Imperial Circuit",
    carName: "ZEUS 1.0",
    isChampion: true,
    featured: true,
    awards: [
      {
        title: "AIR-1 IN EV CATEGORY",
        rank: "AIR 1",
        category: "Championship Winner",
        type: "champion"
      },
      {
        title: "AIR-1 IN ENDURANCE (EV)",
        rank: "AIR 1",
        category: "Dynamic Reliability",
        type: "champion"
      },
      {
        title: "AIR-2 IN ENDURANCE (OVERALL)",
        rank: "AIR 2",
        category: "EV + Combustion Overall",
        type: "runner_up"
      },
      {
        title: "AIR-3 IN OVERALL CHAMPIONSHIP",
        rank: "AIR 3",
        category: "National Grand Total",
        type: "podium"
      }
    ],
    summary: "Historic national breakthrough: vehicle ZEUS 1.0 completed a flawless 22km endurance run, crowning VeerRacerss as the All India Rank 1 Electric Champions and Endurance Champions."
  },
  {
    id: "pi-ev-2022",
    year: "2022",
    competition: "PI-EV 2022",
    tagline: "National Leadership in Team Governance",
    location: "Formula Bharat Virtual",
    awards: [
      {
        title: "AIR-4 IN TEAM MANAGEMENT",
        rank: "AIR 4",
        category: "Project Governance",
        type: "top10"
      }
    ],
    summary: "Awarded 4th in India for executive engineering management, financial allocation, and comprehensive supply chain planning."
  },
  {
    id: "ffs-india-2019",
    year: "2019",
    competition: "FFS INDIA 2019",
    tagline: "National Cost Podium & Top-10 Design",
    location: "Kari Motor Speedway, Coimbatore",
    carName: "VENTUS 5.0",
    awards: [
      {
        title: "AIR-3 IN COST",
        rank: "AIR 3",
        category: "Cost & Manufacturing",
        type: "podium"
      },
      {
        title: "AIR-4 IN DESIGN",
        rank: "AIR 4",
        category: "Engineering Design",
        type: "top10"
      },
      {
        title: "AIR-7 OVERALL",
        rank: "AIR 7",
        category: "National Grand Total",
        type: "top10"
      }
    ],
    summary: "Conquered Kari Motor Speedway with Ventus 5.0, achieving a top-3 podium in manufacturing cost optimization and finishing 7th overall nationally."
  },
  {
    id: "formula-bharat-2019",
    year: "2019",
    competition: "FORMULA BHARAT 2019",
    tagline: "National Contender at Kari Motor Speedway",
    location: "Kari Motor Speedway, Coimbatore",
    awards: [
      {
        title: "SECURED AIR 22/70 TEAMS",
        rank: "AIR 22/70",
        category: "Overall Championship",
        type: "top10"
      }
    ],
    summary: "Competed at Kari Motor Speedway against 70 top engineering collegiate teams across the nation, securing All India Rank 22 overall."
  },
  {
    id: "supra-sae-2018",
    year: "2018",
    competition: "SUPRA SAE INDIA 2018",
    tagline: "AIR 9/112 Teams - Most Successful Season in VSSUT Formula SAE History",
    location: "Madras Motor Race Track (MMRT), Chennai",
    carName: "VENTUS 4.0",
    awards: [
      {
        title: "AIR-9 / 112 TEAMS OVERALL",
        rank: "AIR 9/112",
        category: "Overall Championship",
        type: "top10"
      },
      {
        title: "AIR-7 / 112 IN ENDURANCE EVENT",
        rank: "AIR 7/112",
        category: "Dynamic Endurance",
        type: "top10"
      },
      {
        title: "2ND RUNNERS UP IN ENGINEERING DESIGN",
        rank: "AIR 3",
        category: "Engineering Design",
        type: "podium"
      },
      {
        title: "AIR-7 IN BUSINESS COST EVENT",
        rank: "AIR 7",
        category: "Business Cost",
        type: "top10"
      }
    ],
    summary: "The most successful season ever in the history of VSSUT Formula SAE at MMRT Chennai: captured AIR 9 out of 112 teams overall, finished AIR 7 in Endurance, seized 2nd Runners Up in Engineering Design, and placed AIR 7 in the Business Cost Event."
  },
  {
    id: "formula-bharat-2018",
    year: "2018",
    competition: "FORMULA BHARAT 2018",
    tagline: "National Engineering Design Contender",
    location: "Kari Motor Speedway, Coimbatore",
    awards: [
      {
        title: "SECURED AIR 15/55 IN ENGINEERING DESIGN",
        rank: "AIR 15/55",
        category: "Engineering Design",
        type: "top10"
      }
    ],
    summary: "Evaluated by veteran automotive industry judges in rigorous static design evaluations, capturing All India Rank 15 out of 55 teams in Engineering Design."
  }
];

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

export const DEFAULT_RECRUITMENT_QUESTIONS: RecruitmentCustomQuestion[] = [
  {
    id: "q-1",
    label: "Why VeerRacerss Electric & Prior Technical Experience / Hands-on Projects",
    type: "textbox",
    placeholder: "Describe your interests, software proficiency, past projects, or reasons for joining VeerRacerss Electric...",
    required: true,
  },
  {
    id: "q-2",
    label: "Prior EV / Robotics / Automotive Experience Level",
    type: "dropdown",
    options: [
      "Beginner (Passionate & Eager to Learn)",
      "Intermediate (Academic / Club Projects)",
      "Advanced (Formula Student / Competition Experience)",
      "None (Fresh Mindset)"
    ],
    required: false,
  },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  hero_title: "VEERRACERSS ELECTRIC",
  hero_subtitle: "Odisha’s Premier Formula Student EV Racing Team | VSSUT Burla • Est. 2018.\nEngineered from raw CAD into high-voltage, track-dominating electric formula racecars.",
  recruitment_cta_label: "RECRUITMENT 2026",
  recruitment_cta_url: "/recruitment",
  recruitment_cta_enabled: true,
  announcement_badge_text: "FORMULA STUDENT ELECTRIC // VSSUT BURLA",
  announcement_badge_enabled: true,
  contact_email: "veerracersselectric.database@gmail.com",
  recruitment_open: true,
  recruitment_form_enabled: true,
  recruitment_form_title: "Formula Student Electric 2026 - Official Recruitment",
  recruitment_form_deadline: "Season 2026 Phase 1 Induction",
  recruitment_instructions: "Complete all fields accurately. Shortlisted candidates will be contacted via WhatsApp/Email for the technical discussion and workshop induction.",
  recruitment_eligibility: "Open to 1st Year (Freshers) & 2nd Year (Lateral) B.Tech students across all engineering branches of VSSUT Burla.",
  recruitment_question_prompt: "Why VeerRacerss Electric & Prior Technical Experience / Hands-on Projects",
  recruitment_custom_questions: DEFAULT_RECRUITMENT_QUESTIONS,
  onboarding_email_subject: "Welcome to VeerRacerss Electric // Application Accepted",
  onboarding_email_template: "Dear {candidate_name},\n\nCongratulations! We are pleased to inform you that following the review of your induction application, you have been accepted into VeerRacerss Electric for the 2026 Season under the {primary_domain} division.\n\nNext Steps:\n1. Join our official recruitment WhatsApp group: {whatsapp_link}\n2. Attend our induction briefing at the Central Workshop Block, VSSUT Burla.\n3. Bring your college student ID card.\n\nWelcome to the team!\n\nWarm regards,\nTeam VeerRacerss Electric\nVSSUT Burla",
  whatsapp_recruit_link: "https://chat.whatsapp.com/veerracerss-recruits-2026",
  about_image_url: "/team/who-we-are.jpg",
  about_title: "WHO WE ARE",
  about_subtitle: "THE OFFICIAL STUDENT FORMULA RACING CLUB",
  about_description: "We are VeerRacerss Electric, the official Formula Student EV team of VSSUT Burla. We design, fabricate, and race high-performance electric race cars from the ground up, pushing the limits of lightweight composites, battery thermal safety, and dynamic vehicle telemetry.",
  telemetry_stats: [
    {
      stat: "P3",
      unit: "OVERALL",
      label: "NATIONAL PODIUM",
      detail: "Formula Imperial EV at Buddh International Circuit",
    },
    {
      stat: "AIR 1",
      unit: "TROPHY",
      label: "LIGHTEST EV",
      detail: "Lowest curb weight in national formula scrutiny",
    },
    {
      stat: "55+",
      unit: "ENGINEERS",
      label: "STUDENT SQUAD",
      detail: "Multi-disciplinary R&D and race crew",
    },
    {
      stat: "6",
      unit: "GENERATIONS",
      label: "EV FLEET ITERATIONS",
      detail: "Ventus series through flagship Aether",
    },
    {
      stat: "100%",
      unit: "IN-HOUSE",
      label: "FABRICATION & CODE",
      detail: "Spaceframe, BMS, aerodynamics & telemetry",
    },
  ],
};

export const DEFAULT_SETTINGS = DEFAULT_SITE_SETTINGS;

export const DEFAULT_FEATURED_MACHINE: FeaturedMachine = {
  car_name: "AETHER 2024-25",
  season_tag: "FORMULA STUDENT EV PROTOTYPE",
  description: "Engineered from the ground up by student engineers at VSSUT Burla. Passing rigorous technical scrutiny at Formula Imperial (Buddh International Circuit).",
  cad_model_url: "/car-raw.glb",
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

export const DEFAULT_MACHINE = DEFAULT_FEATURED_MACHINE;

export const DEFAULT_VEHICLES: VehicleRecord[] = [
  {
    id: "car-aether",
    name: "AETHER",
    year: "2025",
    category: "EV",
    tagline: "FORMULA STUDENT EV PROTOTYPE",
    competition: "Formula Imperial 2024 @ Buddh International Circuit (P3 Overall EV)",
    description: "AETHER is the flagship innovation of VeerRacerss Electric for the season 2024-25. It is the first EV made by any engineering college in Odisha. Powered by a 10 kW PMSM Motor with exceptional acceleration and torque, paired with an in-house developed 72V high energy density battery pack. The team passed technical inspections, driver egress, and brake tests with flying colours, culminating in an endurance run that secured P3 Overall in the EV category at Buddh International Circuit.",
    image: "/cars/aether.jpg",
    cad_image: "/cars/aether-spotlight.jpg",
    cad_model_url: "/car-raw.glb",
    stats: {
      speed: "115 km/h",
      accel: "3.1s 0-100",
      weight: "182 kg",
      power: "10 kW",
      voltage: "72V",
    },
    features: [
      "10 KW PMSM Motor",
      "72V High Energy Density Battery Pack",
      "First EV in Odisha by an Engineering College",
      "Formula Imperial 2024 Overall P3 (EV)",
    ],
    subsystems: {
      powertrain_headline: "10 kW PMSM Motor",
      powertrain_specs: "85 Nm Peak Torque • Direct Chain Reduction • Regenerative Braking",
      accumulator_headline: "72V High-Energy Li-Ion Pack",
      accumulator_specs: "In-House BMS • Active Thermal Monitoring • IP67 Isolation",
      chassis_headline: "AISI 4130 Chromoly Spaceframe",
      chassis_specs: "182 kg Curb Weight • Torsional Stiffness > 1450 Nm/deg • FIA Egress",
      aero_headline: "Dual-Element Carbon Wings",
      aero_specs: "CFD Optimised Endplates • Drag Reduction System • High Downforce",
    },
    is_spotlight: true,
  },
  {
    id: "car-zeus-1",
    name: "ZEUS 1.0",
    year: "2023",
    category: "EV",
    tagline: "INAUGURAL ELECTRIC RACE PLATFORM",
    competition: "Formula Bharat 2023",
    description: "ZEUS 1.0 marked our historic transition into the EV domain. It served as the proving ground for electric motor controller calibration, safety interlock loops, and regenerative braking studies, establishing the engineering benchmarks that define our electric racing program.",
    image: "/cars/zeus-1.0.jpg",
    cad_image: "/cars/zeus-1.0.jpg",
    stats: {
      speed: "105 km/h",
      accel: "4.2s 0-100",
      weight: "260 kg",
      power: "8 kW",
      voltage: "60V",
    },
    features: [
      "Custom Battery Management System (BMS)",
      "Aerodynamic Package & Diffuser",
      "RWD Dynamics Architecture",
      "Electrical Powertrain Platform",
    ],
    subsystems: {
      powertrain_headline: "8 kW High-Efficiency BLDC Motor",
      powertrain_specs: "Custom Inverter Calibration • Rear-Wheel Drive",
      accumulator_headline: "60V High-Discharge Battery Architecture",
      accumulator_specs: "Modular Pack Assembly • Master Interlock Circuitry",
      chassis_headline: "Tubular Steel Spaceframe",
      chassis_specs: "Optimized Torsional Rigidity • Driver Safety Cell",
      aero_headline: "High-Downforce Rear Diffuser",
      aero_specs: "Underbody Aerodynamic Management",
    },
    is_spotlight: false,
  },
  {
    id: "car-ventus-5",
    name: "VENTUS 5.0",
    year: "2022",
    category: "Combustion",
    tagline: "PINNACLE COMBUSTION ARCHITECTURE",
    competition: "Formula Bharat 2022",
    description: "Part of the legendary Ventus combustion lineage. Built with a focus on mechanical grip, thermal stability, and endurance durability, establishing the fundamental vehicle dynamics philosophies that carried directly into our electric vehicle development.",
    image: "/cars/ventus-5.0.jpg",
    stats: {
      speed: "95 km/h",
      accel: "4.8s 0-100",
      weight: "275 kg",
      power: "Combustion",
    },
    features: [
      "High-Torsional Rigidity Steel Spaceframe",
      "Reliable Powertrain Calibration",
      "Custom Double-Wishbone Suspension",
      "Aerodynamic Winglets",
    ],
    is_spotlight: false,
  },
  {
    id: "car-ventus-4",
    name: "VENTUS 4.0",
    year: "2020",
    category: "Combustion",
    tagline: "ENDURANCE-TUNED CHASSIS",
    competition: "SUPRA SAE India 2020",
    description: "A relentless track machine designed to withstand the toughest dynamic endurance stages. Ventus 4.0 pushed our combustion engine tuning, cooling architecture, and weight reduction strategies to the limit.",
    image: "/cars/ventus-4.0.jpg",
    stats: {
      speed: "90 km/h",
      accel: "5.1s 0-100",
      weight: "280 kg",
      power: "Combustion",
    },
    features: [
      "Lightweight Chassis Optimization",
      "Custom 3D-Printed Air Intake",
      "Endurance-Tuned ECU Mapping",
      "Optimized Driver Ergonomics",
    ],
    is_spotlight: false,
  },
  {
    id: "car-ventus-163",
    name: "VENTUS 16.3",
    year: "2019",
    category: "Combustion",
    tagline: "PRECISION HANDLING ITERATION",
    competition: "Formula Bharat 2019",
    description: "An evolutionary leap in the Ventus series, refining the driver interface, pedal box adjustability, and manufacturing precision to trim lap times and bolster structural reliability.",
    image: "/cars/ventus-16.3.jpg",
    stats: {
      speed: "85 km/h",
      accel: "5.5s 0-100",
      weight: "290 kg",
      power: "Combustion",
    },
    features: [
      "Ergonomic Cockpit & Quick-Release Steering",
      "Robust Chain-Driven Differential",
      "Tuned Exhaust Resonance System",
      "Stiffened Uprights",
    ],
    is_spotlight: false,
  },
  {
    id: "car-ventus-152",
    name: "VENTUS 15.2",
    year: "2018",
    category: "Combustion",
    tagline: "THE GENESIS FORMULA CAR",
    competition: "SUPRA SAE India 2018",
    description: "The early foundations of Team VeerRacerss. Ventus 15.2 was the proving ground for student fabrication, machining, and competition team coordination at VSSUT Burla, sparking the electric racing legacy that thrives today.",
    image: "/cars/ventus-15.2.jpg",
    stats: {
      speed: "80 km/h",
      accel: "6.0s 0-100",
      weight: "300 kg",
      power: "Combustion",
    },
    features: [
      "Foundation Tubular Spaceframe",
      "100% Student Fabricated",
      "Reliable Brake Over-Travel Switch Setup",
      "Proven Suspension Geometry",
    ],
    is_spotlight: false,
  },
];

export const DEFAULT_SPONSORS: SponsorRecord[] = [
  {
    id: "sp-1",
    name: "KTM",
    category: "Title Sponsor & Powertrain",
    logo: "/sponsors/ktm.svg",
    url: "https://www.ktm.com",
    tier: "title",
  },
  {
    id: "sp-2",
    name: "CrossHead Engineering",
    category: "Title Sponsor & Precision Engineering",
    logo: "/sponsors/crosshead.svg",
    url: "https://www.instagram.com/crosshead_engineering/",
    tier: "title",
  },
  {
    id: "sp-3",
    name: "SolidWorks",
    category: "3D CAD & Digital Twin",
    logo: "/sponsors/solidworks.svg",
    url: "https://www.solidworks.com",
    tier: "partner",
  },
  {
    id: "sp-4",
    name: "Ansys",
    category: "Simulation & FEA/CFD",
    logo: "/sponsors/ansys.svg",
    url: "https://www.ansys.com",
    tier: "partner",
  },
  {
    id: "sp-5",
    name: "Snap-on",
    category: "Precision Workshop Tools",
    logo: "/sponsors/snapon.svg",
    url: "https://www.snapon.com",
    tier: "partner",
  },
  {
    id: "sp-6",
    name: "Bender",
    category: "Electrical Safety & IMD",
    logo: "/sponsors/bender.svg",
    url: "https://www.bender.de",
    tier: "partner",
  },
  {
    id: "sp-7",
    name: "AMEC Mobility",
    category: "EV Lithium Battery & Powertrain",
    logo: "/sponsors/amec.svg",
    url: "https://www.amecmobility.com",
    tier: "partner",
  },
  {
    id: "sp-8",
    name: "Burnout by 3 Brothers",
    category: "CNC Machining & Drivetrain",
    logo: "/sponsors/burnout3brothers.svg",
    url: "https://www.facebook.com/3BrothersAhmedabad/",
    tier: "partner",
  },
  {
    id: "sp-9",
    name: "My Pit Crew",
    category: "Trackside & Engineering Solutions",
    logo: "/sponsors/mypitcrew.svg",
    url: "https://www.instagram.com/mypitcrew.india/",
    tier: "partner",
  },
  {
    id: "sp-10",
    name: "MCL",
    category: "Public Sector Patron",
    logo: "/sponsors/mcl.svg",
    url: "https://www.mahanadicoal.in",
    tier: "partner",
  },
  {
    id: "sp-11",
    name: "Morphine Motorsports",
    category: "Motorsport & Racing Equipment",
    logo: "/sponsors/morphine.svg",
    url: "https://www.gomorphine.com",
    tier: "partner",
  },
];

export function extractSpotlightFromVehicles(vehicles: VehicleRecord[]): FeaturedMachine {
  if (!vehicles || vehicles.length === 0) return DEFAULT_FEATURED_MACHINE;

  // Prefer explicitly marked spotlight car, or newest by year
  const spotlightCar =
    vehicles.find((v) => v.is_spotlight) ||
    [...vehicles].sort((a, b) => parseInt(b.year || "0") - parseInt(a.year || "0"))[0];

  if (!spotlightCar) return DEFAULT_FEATURED_MACHINE;

  const speedVal = spotlightCar.stats.speed.replace(/[^0-9]/g, "") || "115";
  const accelVal = spotlightCar.stats.accel.replace(/[^0-9.]/g, "") || "3.1";
  const voltVal = spotlightCar.stats.voltage
    ? spotlightCar.stats.voltage.replace(/[^0-9]/g, "")
    : "72";
  const weightVal = spotlightCar.stats.weight.replace(/[^0-9]/g, "") || "182";

  return {
    car_name: `${spotlightCar.name} ${spotlightCar.year}`,
    season_tag: spotlightCar.tagline || `FORMULA STUDENT ${spotlightCar.category} PROTOTYPE`,
    description: spotlightCar.description,
    cad_model_url: (spotlightCar.cad_model_url && spotlightCar.cad_model_url.trim()) ? spotlightCar.cad_model_url.trim() : "/car-raw.glb",
    cad_image_url: spotlightCar.cad_image || spotlightCar.image,
    track_image_url: spotlightCar.image,
    top_speed_val: speedVal,
    accel_val: accelVal,
    voltage_val: voltVal,
    weight_val: weightVal,
    powertrain_headline:
      spotlightCar.subsystems?.powertrain_headline || `${spotlightCar.stats.power} Motor`,
    powertrain_specs:
      spotlightCar.subsystems?.powertrain_specs ||
      "85 Nm Peak Torque • Direct Chain Reduction • Regenerative Braking",
    accumulator_headline:
      spotlightCar.subsystems?.accumulator_headline ||
      `${spotlightCar.stats.voltage || "72V"} High-Energy Pack`,
    accumulator_specs:
      spotlightCar.subsystems?.accumulator_specs ||
      "In-House BMS • Active Thermal Monitoring • IP67 Isolation",
    chassis_headline:
      spotlightCar.subsystems?.chassis_headline || "AISI 4130 Chromoly Spaceframe",
    chassis_specs:
      spotlightCar.subsystems?.chassis_specs ||
      `${spotlightCar.stats.weight} Curb Weight • Torsional Stiffness > 1450 Nm/deg • FIA Egress`,
    aero_headline:
      spotlightCar.subsystems?.aero_headline || "Dual-Element Carbon Wings",
    aero_specs:
      spotlightCar.subsystems?.aero_specs ||
      "CFD Optimised Endplates • Drag Reduction System • High Downforce",
  };
}

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
    id: "00000000-0000-0000-0000-000000000001",
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
    id: "00000000-0000-0000-0000-000000000002",
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
