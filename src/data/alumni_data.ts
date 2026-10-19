export interface AlumniProfile {
  id: string;
  name: string;
  batch: string;
  formerClubRole: string;
  currentRole: string;
  company: string;
  image: string;
  linkedin: string;
  mentorshipDomain: string;
  bio?: string;
}

export const ALUMNI_PROFILES: AlumniProfile[] = [
  {
    id: "siddhartha-senapati",
    name: "Siddhartha Senapati",
    batch: "Batch 2021",
    formerClubRole: "Former Team Captain & Powertrain Lead",
    currentRole: "Battery Systems Engineer",
    company: "Ather Energy",
    image: "/alumni/siddhartha-senapati.jpg",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    mentorshipDomain: "Li-Ion Thermal Architecture & BMS",
    bio: "Pioneered VeerRacerss initial transition into high-voltage electric powertrains; now driving battery pack thermal safety and pack engineering at Ather Energy."
  },
  {
    id: "priyanka-das",
    name: "Priyanka Das",
    batch: "Batch 2022",
    formerClubRole: "Former Powertrain Lead",
    currentRole: "Powertrain Calibration Lead",
    company: "Tata Motors EV",
    image: "/alumni/priyanka-das.jpg",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    mentorshipDomain: "Motor Inverter Tuning & Drive Cycles",
    bio: "Engineered vehicle dynamometer testing pipelines for Aether; currently calibrating permanent magnet electric motor drives across production Tata EVs."
  },
  {
    id: "aman-patnaik",
    name: "Aman Patnaik",
    batch: "Batch 2023",
    formerClubRole: "Former Chassis & Vehicle Dynamics Lead",
    currentRole: "Vehicle Dynamics Engineer",
    company: "Mahindra Racing",
    image: "/alumni/aman-patnaik.jpg",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    mentorshipDomain: "Suspension Kinematics & CFD Aero",
    bio: "Designed our multi-link double-wishbone suspension setup; currently developing dynamic lap simulations and track vehicle dynamics with Mahindra Racing."
  },
  {
    id: "rohan-mohanty",
    name: "Rohan Mohanty",
    batch: "Batch 2023",
    formerClubRole: "Former Electronics & Telemetry Lead",
    currentRole: "Motor Controller Firmware",
    company: "Ola Electric",
    image: "/alumni/rohan-mohanty.jpg",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    mentorshipDomain: "CAN-Bus Telemetry & Embedded Firmware",
    bio: "Architected custom telemetry logging units streaming real-time tire temperatures; now building field-oriented control firmware for high-performance EV controllers."
  }
];
