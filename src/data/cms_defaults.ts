export interface SiteSettings {
  recruitment_cta_label: string;
  recruitment_cta_url: string;
  recruitment_cta_enabled: boolean;
  announcement_badge_text: string;
  announcement_badge_enabled: boolean;
  contact_email: string;
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
  recruitment_cta_url: "/members",
  recruitment_cta_enabled: true,
  announcement_badge_text: "FORMULA STUDENT ELECTRIC // VSSUT BURLA",
  announcement_badge_enabled: true,
  contact_email: "veerracersselectric.database@gmail.com",
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
