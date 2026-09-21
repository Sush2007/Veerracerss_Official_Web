export interface FacultyAdvisor {
  name: string;
  role: string;
  department: string;
  tenure: string;
  image: string;
  profileUrl: string;
}

export interface CoreLeader {
  name: string;
  role: string;
  subgroup: string;
  image: string;
  description: string;
  linkedin: string;
}

export interface TeamMemberProfile {
  name: string;
  role: string;
  department: string;
  year: string;
  image: string;
  regdNo?: string;
  subgroup: string;
  socials: {
    linkedin?: string;
    instagram?: string;
    email?: string;
    github?: string;
  };
}

export const FACULTY_ADVISORS: FacultyAdvisor[] = [
  {
    name: "Dr. Debasish Tripathy",
    role: "Faculty Advisor",
    department: "Mechanical Engineering",
    tenure: "Present",
    image: "https://veerracersselectric.netlify.app/team/debasish%20tripathy.jpg",
    profileUrl: "https://www.vssut.ac.in/faculty-profile.php?furl=debasish-tripathy"
  },
  {
    name: "Prof. (Dr.) P. Nanda",
    role: "Senior Faculty Advisor",
    department: "Mechanical Engineering",
    tenure: "Present",
    image: "https://veerracersselectric.netlify.app/team/pnanda.png",
    profileUrl: "https://www.vssut.ac.in/"
  },
  {
    name: "Dr. Swagatika Mishra",
    role: "Faculty Advisor",
    department: "Electrical Engineering",
    tenure: "Present",
    image: "https://veerracersselectric.netlify.app/team/swagatika%20mishra.jpg",
    profileUrl: "https://www.vssut.ac.in/"
  },
  {
    name: "Mr. Prabir Kumar Jena",
    role: "Former Faculty Advisor",
    department: "Mechanical Engineering",
    tenure: "2020 - 2023",
    image: "https://veerracersselectric.netlify.app/team/prabir%20kumar%20jena.jpg",
    profileUrl: "https://www.vssut.ac.in/faculty-profile.php?furl=prabir-kumar-jena"
  }
];

export const CORE_LEADERSHIP: CoreLeader[] = [
  {
    name: "Amritanshu Tripathy",
    role: "Team Captain",
    subgroup: "Team Lead",
    image: "https://veerracersselectric.netlify.app/Team/Council-26/AmritanshuTr.png",
    description: "Leading overall vehicle engineering, dynamic track operations, and team coordination.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/"
  },
  {
    name: "Darshana Puhan",
    role: "Vice-Captain & P.R.O.",
    subgroup: "Team Lead",
    image: "https://veerracersselectric.netlify.app/Team/Council-26/Darshana.png",
    description: "Managing corporate sponsorships, media outreach, and institutional relations.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/"
  },
  {
    name: "Adyasha Deb",
    role: "Public Relations Officer (P.R.O.)",
    subgroup: "Team Lead",
    image: "https://veerracersselectric.netlify.app/Team/Council-26/Adyasha.png",
    description: "Spearheading branding, external communications, and partner engagements.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/"
  },
  {
    name: "Atmabhu Padhi",
    role: "Treasurer & Drivetrain Head",
    subgroup: "Team Lead",
    image: "https://veerracersselectric.netlify.app/Team/Council-26/AtmabhuP.png",
    description: "Directing financial planning, budget allocations, and drivetrain dynamics.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/"
  },
  {
    name: "Debesh Kumar Nayak",
    role: "Inventory Head & Chassis Lead",
    subgroup: "Team Lead",
    image: "https://veerracersselectric.netlify.app/Team/Council-26/Debesh.png",
    description: "Overseeing procurement, workshop tooling, and chassis inventory systems.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/"
  },
  {
    name: "Ayush Kumar",
    role: "Media & Videography Head",
    subgroup: "Team Lead",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Ayush Kumar.jpg",
    description: "Leading visual documentation, telemetry media, and brand storytelling.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/"
  }
];

export const TEAM_DEPARTMENTS = [
  "Team Lead",
  "Chassis & Design",
  "Suspension & Steering",
  "Powertrain & Drivetrain",
  "Brakes"
];

export const ACTIVE_MEMBERS: TeamMemberProfile[] = [
  // ==========================================
  // 1. TEAM LEAD
  // ==========================================
  {
    name: "Amritanshu Tripathy",
    role: "Team Captain",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/Council-26/AmritanshuTr.png",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Darshana Puhan",
    role: "Vice-Captain & P.R.O.",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/Council-26/Darshana.png",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Adyasha Deb",
    role: "Public Relations Officer (P.R.O.)",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/Council-26/Adyasha.png",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Atmabhu Padhi",
    role: "Treasurer & Drivetrain Head",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/Council-26/AtmabhuP.png",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Debesh Kumar Nayak",
    role: "Inventory Head & Chassis Lead",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/Council-26/Debesh.png",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Ayush Kumar",
    role: "Media & Videography Head",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Ayush Kumar.jpg",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },

  // ==========================================
  // 2. CHASSIS & DESIGN
  // ==========================================
  {
    name: "Ayush Biswal",
    role: "Chassis & Aerodynamics Lead",
    department: "Chassis & Design",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Ayush Biswal.jpg",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Debesh Kumar Nayak",
    role: "Chassis Manufacturing Head",
    department: "Chassis & Design",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/Council-26/Debesh.png",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Shriyans Hota",
    role: "Composite Fabrication & Aero",
    department: "Chassis & Design",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402020065",
    image: "https://veerracersselectric.netlify.app/Team/2ndYears/shriyans hota.jpg",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Asmit Kumar Swain",
    role: "CAD Modeling & FEA Integration",
    department: "Chassis & Design",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402050074",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Adyasha Kar",
    role: "Ergonomics & Styling",
    department: "Chassis & Design",
    year: "3rd Year (Pre-Final)",
    regdNo: "2401010018",
    image: "https://veerracersselectric.netlify.app/Team/2ndYears/Adyasha Kar.jpg",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Anima Padhi",
    role: "Structural Analysis & Spaceframe",
    department: "Chassis & Design",
    year: "2nd Year",
    regdNo: "2502090046",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Richi Dhal",
    role: "Chassis Integration & Mountings",
    department: "Chassis & Design",
    year: "2nd Year",
    regdNo: "2502050033",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Bijeyita Nayak",
    role: "Aerodynamic CFD Simulation",
    department: "Chassis & Design",
    year: "2nd Year",
    regdNo: "2502070126",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&auto=format&fit=crop",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Parshuram Nath",
    role: "Roll Cage Integrity & Safety",
    department: "Chassis & Design",
    year: "2nd Year",
    regdNo: "2502061043",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Akshit Bindhani",
    role: "Material Selection & Metallurgy",
    department: "Chassis & Design",
    year: "2nd Year",
    regdNo: "2502100010",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Manisha Meher",
    role: "Composite Layup & Testing",
    department: "Chassis & Design",
    year: "2nd Year",
    regdNo: "2502100007",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    subgroup: "Chassis & Design",
    socials: {}
  },

  // ==========================================
  // 3. SUSPENSION & STEERING
  // ==========================================
  {
    name: "Rohit Sharma",
    role: "Suspension & Dynamics Lead",
    department: "Suspension & Steering",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/sahil.jpg",
    subgroup: "Suspension & Steering",
    socials: {}
  },
  {
    name: "Mohit Mishra",
    role: "Steering Kinematics & Uprights Lead",
    department: "Suspension & Steering",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Mohit Mishra.jpg",
    subgroup: "Suspension & Steering",
    socials: {}
  },
  {
    name: "Guduli Patro",
    role: "Pushrod & Damper Geometry",
    department: "Suspension & Steering",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/gudli - KAKS.jpg",
    subgroup: "Suspension & Steering",
    socials: {}
  },
  {
    name: "Hrishita Behera",
    role: "Wishbone Design & Hub Geometry",
    department: "Suspension & Steering",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Hrishita Behera.jpg",
    subgroup: "Suspension & Steering",
    socials: {}
  },
  {
    name: "Nilu Mahankuda",
    role: "Alignment & Trackside Setup",
    department: "Suspension & Steering",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Nilu Mahankuda.jpg",
    subgroup: "Suspension & Steering",
    socials: {}
  },
  {
    name: "Harsh Mittal",
    role: "Steering Column & Packaging",
    department: "Suspension & Steering",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Harsh Mittal.jpg",
    subgroup: "Suspension & Steering",
    socials: {}
  },
  {
    name: "Sushree M Mayurika",
    role: "Dynamics Simulation & Testing",
    department: "Suspension & Steering",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Mayurika.jpg",
    subgroup: "Suspension & Steering",
    socials: {}
  },
  {
    name: "Pankaj Kumar Patra",
    role: "Suspension Kinematics & Wishbones",
    department: "Suspension & Steering",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402090026",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
    subgroup: "Suspension & Steering",
    socials: {}
  },
  {
    name: "Shubransu Shekhar Sethy",
    role: "Steering Assembly & Uprights",
    department: "Suspension & Steering",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402030111",
    image: "https://veerracersselectric.netlify.app/Team/2ndYears/Shubhransu Shekhar.jpg",
    subgroup: "Suspension & Steering",
    socials: {}
  },

  // ==========================================
  // 4. POWERTRAIN & DRIVETRAIN
  // ==========================================
  {
    name: "Radhashyam Jena",
    role: "Powertrain & High Voltage Lead",
    department: "Powertrain & Drivetrain",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Radhashyam Jena.png",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Yash Safi",
    role: "BMS Architecture & Cell Packaging",
    department: "Powertrain & Drivetrain",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/Yash Safi.jpeg",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Sahil Ahmed",
    role: "Inverter Control & Motor Telemetry",
    department: "Powertrain & Drivetrain",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Sahil_ahmed.jpg",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Rakesh Barik",
    role: "Drivetrain & Transmission Lead",
    department: "Powertrain & Drivetrain",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Rakesh Barik.jpg",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Atmabhu Padhi",
    role: "Differential & Half-Shaft Dynamics",
    department: "Powertrain & Drivetrain",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/Council-26/AtmabhuP.png",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Krishnachandra Panigrahy",
    role: "High Voltage Packaging & Harnessing",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402050104",
    image: "https://veerracersselectric.netlify.app/Team/2ndYears/Krishnachandra panigrahy.jpg",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Satyaranjan Pusti",
    role: "Chain Drive & Sprocket Design",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    regdNo: "2503090007",
    image: "https://veerracersselectric.netlify.app/Team/2ndYears/Satyaranjan pusti.jpg",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Rajat Mishra",
    role: "Planetary Gearbox & Mountings",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402090075",
    image: "https://veerracersselectric.netlify.app/Team/2ndYears/Rajat mishra.jpg",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Siddharth Singh",
    role: "Low Voltage Systems & ECU",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402061047",
    image: "https://veerracersselectric.netlify.app/Team/2ndYears/Siddharth Singh.jpeg",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Manas Ranjan Pattnayak",
    role: "Thermal Management & Cooling Loop",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402090028",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Subash Pradhan",
    role: "Drivetrain Alignment & Validation",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    regdNo: "2503090008",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Arman Mishra",
    role: "Battery Safety & Pre-Charge Circuits",
    department: "Powertrain & Drivetrain",
    year: "2nd Year",
    regdNo: "2502061073",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400&auto=format&fit=crop",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Salabega Majhi",
    role: "Drivetrain Sensors & Telemetry",
    department: "Powertrain & Drivetrain",
    year: "2nd Year",
    regdNo: "2502070008",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },

  // ==========================================
  // 5. BRAKES
  // ==========================================
  {
    name: "Mansha Naaz",
    role: "Braking Systems Lead",
    department: "Brakes",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Mansha Naaz.jpg",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Aryean Prasad Panigrahi",
    role: "Calipers & Hydraulic Circuitry",
    department: "Brakes",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Aryean Prasad Panigrahi.jpg",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "K Asish Subudhi",
    role: "Master Cylinder & Pedal Box",
    department: "Brakes",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/K ASISH SUBUDHI.jpg",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Abhisek Sethi",
    role: "Brake Discs & Thermal Dissipation",
    department: "Brakes",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/Abhisek Sethi.jpg",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Ganesh Bhuyan",
    role: "Brake Bias & Balancing",
    department: "Brakes",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/Ganesh Bhuyan.jpeg",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Asmit Kumar Malla",
    role: "Pneumatics & Over-Travel Switch",
    department: "Brakes",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/Asmit Kumar Malla.jpeg",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Aparna Behera",
    role: "Regenerative Braking & Electronic Bias",
    department: "Brakes",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402050082",
    image: "https://veerracersselectric.netlify.app/Team/2ndYears/Aparna.jpg",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Mohammad Saad",
    role: "Brake Line Routing & Bleeding",
    department: "Brakes",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402030086",
    image: "https://veerracersselectric.netlify.app/Team/2ndYears/Mohammad Saad.jpg",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Kamal Behera",
    role: "Brake Rotor Design & Rigidity",
    department: "Brakes",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402090043",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=400&auto=format&fit=crop",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Sagar Gouda",
    role: "Brake Temperature DAQ & Sensors",
    department: "Brakes",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402070106",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Subhranshu Mallik",
    role: "Caliper Mounting & Assembly",
    department: "Brakes",
    year: "2nd Year",
    regdNo: "2502090047",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Aditya Kumar Jha",
    role: "Brake Fluid Dynamics & Hydraulics",
    department: "Brakes",
    year: "2nd Year",
    regdNo: "2502020041",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Swagat Nayak",
    role: "Tyre Compound Analysis & Traction",
    department: "Brakes",
    year: "2nd Year",
    regdNo: "2500190019",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=400&auto=format&fit=crop",
    subgroup: "Brakes",
    socials: {}
  }
];

// Cohorts for historical tabs while default is the active upgraded roster
export const TEAM_COHORTS: Record<string, TeamMemberProfile[]> = {
  "2026": ACTIVE_MEMBERS,
  "2025": ACTIVE_MEMBERS.filter(m => m.year.includes("Final Year")),
  "2024": ACTIVE_MEMBERS.filter(m => m.department === "Team Lead")
};
