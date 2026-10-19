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
  department?: string;
  image: string;
  description: string;
  linkedin: string;
  year: string;
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
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/faculty/debasish-tripathy.webp",
    profileUrl: "https://www.vssut.ac.in/faculty-profile.php?furl=debasish-tripathy"
  },
  {
    name: "Dr. Amit Mallick",
    role: "Faculty Advisor",
    department: "Electrical Engineering",
    tenure: "Present",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/faculty/amit-mallick-v2.webp",
    profileUrl: "https://www.vssut.ac.in/faculty-profile.php?furl=amit-mallick"
  }
];

export const CORE_LEADERSHIP: CoreLeader[] = [
  {
    name: "Amritanshu Tripathy",
    role: "Team Captain",
    subgroup: "Executive Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/amritanshu-tripathy.webp",
    description: "Leading overall vehicle engineering, dynamic track operations, and team coordination.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "Final Year (4th Year)"
  },
  {
    name: "Rohit Sharma",
    role: "Vice-Captain",
    subgroup: "Executive Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/rohit-sharma.webp",
    description: "Directing executive club operations, vehicle testing pipelines, and team strategy.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "Final Year (4th Year)"
  },
  {
    name: "Atmabhu Padhi",
    role: "Technical Head",
    subgroup: "Technical Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/atmabhu-padhi.webp",
    description: "Overseeing multi-subsystem engineering integration, telemetry, and electric powertrain validation.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "Final Year (4th Year)"
  },
  {
    name: "Adyasha Deb",
    role: "Marketing & Sponsorship Head",
    subgroup: "Executive Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/adyasha-deb.webp",
    description: "Spearheading corporate sponsorships, institutional relations, and team marketing strategy.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "Final Year (4th Year)"
  },
  {
    name: "Aryean Prasad Panigrahi",
    role: "Manufacturing Head",
    subgroup: "Technical Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/aryean-prasad-panigrahi.webp",
    description: "Directing workshop tooling, precision machining, chassis fabrication, and manufacturing standards.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "Final Year (4th Year)"
  },
  {
    name: "Debesh Kumar Nayak",
    role: "Procurement Head",
    subgroup: "Executive Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/debesh-kumar-nayak.webp",
    description: "Managing component sourcing, supply-chain logistics, vendor negotiations, and procurement.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "Final Year (4th Year)"
  },
  {
    name: "K. Asish Subudhi",
    role: "Brakes & Tyres Head",
    subgroup: "Technical Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/k-asish-subudhi.webp",
    description: "Engineering hydraulic braking circuits, thermal dissipation, brake bias, and tyre dynamics.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "Final Year (4th Year)"
  },
  {
    name: "Darshana Puhan",
    role: "Chassis & Design Head",
    subgroup: "Technical Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/darshana-puhan.webp",
    description: "Directing spaceframe structural integrity, aerodynamic envelope design, and torsional rigidity optimization.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "Final Year (4th Year)"
  },
  {
    name: "Radhashyam Jena",
    role: "Powertrain & Drivetrain Head",
    subgroup: "Technical Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/radhashyam-jena.webp",
    description: "Leading high-voltage accumulator systems, tractive system safety, and motor controller integration.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "Final Year (4th Year)"
  },
  {
    name: "Harsh Mittal",
    role: "Suspension & Steering Head",
    subgroup: "Technical Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/harsh-mittal.webp",
    description: "Leading double-wishbone suspension kinematics, steering geometry, and track handling dynamics.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "Final Year (4th Year)"
  },
  {
    name: "Abhisek Sethi",
    role: "Event Manager",
    subgroup: "Operations Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/abhisek-sethi.webp",
    description: "Orchestrating competition logistics, national event operations, and team showcase presentations.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "Final Year (4th Year)"
  },
  {
    name: "Nrusingha Dalai",
    role: "Team Manager",
    department: "Suspension & Steering",
    subgroup: "Operations Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/nrusingha-dalai.webp",
    description: "Managing daily workshop workflows, team schedules, milestone tracking, and intra-club operations.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "3rd Year (Pre-Final)"
  },
  {
    name: "Sourav Muduly",
    role: "PR Officer ( P.R.O )",
    department: "Powertrain & Drivetrain",
    subgroup: "Communications Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/sourav-muduly.webp",
    description: "Leading media communications, press releases, digital presence, and external public relations.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "3rd Year (Pre-Final)"
  },
  {
    name: "Bineeta Sinha",
    role: "PR Officer ( P.R.O )",
    department: "Powertrain & Drivetrain",
    subgroup: "Communications Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/bineeta-sinha.webp",
    description: "Spearheading outreach campaigns, community engagement, brand identity, and student relations.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "3rd Year (Pre-Final)"
  },
  {
    name: "P. Devi Prasad Achary",
    role: "Treasurer",
    department: "Chassis & Design",
    subgroup: "Operations Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/p-devi-prasad-achary.webp",
    description: "Controlling team financial accounting, budget distributions, audit compliance, and resource allocation.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "3rd Year (Pre-Final)"
  },
  {
    name: "Tikeshwar Pradhan",
    role: "Inventory Head",
    department: "Powertrain & Drivetrain",
    subgroup: "Operations Council",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/tikeshwar-pradhan.webp",
    description: "Overseeing workshop inventory management, tool calibrations, raw stock cataloging, and equipment control.",
    linkedin: "https://www.linkedin.com/company/veerracerss-electric/",
    year: "3rd Year (Pre-Final)"
  }
];

export const FINAL_YEAR_LEADERS = CORE_LEADERSHIP.filter(l => l.year === "Final Year (4th Year)");
export const PREFINAL_YEAR_LEADERS = CORE_LEADERSHIP.filter(l => l.year === "3rd Year (Pre-Final)");

export interface DomainMember {
  name: string;
  role: string;
  department: string;
  subgroup: string;
  year: string;
  image: string;
}

export const DOMAIN_MEMBERS: DomainMember[] = [
  // ==========================================
  // 1. PRE-FINAL YEAR (3RD YEAR) DOMAIN MEMBERS
  // ==========================================
  {
    "name": "Biswabhanu Panda",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "3rd Year (Pre-Final)",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/biswabhanu-panda.webp"
  },
  {
    "name": "Shoaib Khan",
    "role": "Brakes and Tyres Engineer",
    "department": "Brakes & Tyres",
    "subgroup": "Engineering Domain",
    "year": "3rd Year (Pre-Final)",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/shoaib-khan.webp"
  },
  {
    "name": "Swagat Ranjan Swain",
    "role": "Chassis and Design Engineer",
    "department": "Chassis & Design",
    "subgroup": "Engineering Domain",
    "year": "3rd Year (Pre-Final)",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/swagat-ranjan-swain.webp"
  },
  {
    "name": "Kiran Kumar Hota",
    "role": "Brakes and Tyres Engineer",
    "department": "Brakes & Tyres",
    "subgroup": "Engineering Domain",
    "year": "3rd Year (Pre-Final)",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/kiran-kumar-hota.webp"
  },
  {
    "name": "Anshuman Mishra",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "3rd Year (Pre-Final)",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/anshuman-mishra.webp"
  },
  {
    "name": "Alonya Dung Dung",
    "role": "Chassis and Design Engineer",
    "department": "Chassis & Design",
    "subgroup": "Engineering Domain",
    "year": "3rd Year (Pre-Final)",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/alonya-dung-dung.webp"
  },
  {
    "name": "Arpan Mishra",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "3rd Year (Pre-Final)",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/arpan-mishra.webp"
  },

  // ==========================================
  // 2. SECOND YEAR (2ND YEAR) MEMBERS BY DOMAIN
  // ==========================================

  // --- Group 1: Chassis & Design (11 Members) ---
  {
    "name": "Deepishree Meher",
    "role": "Chassis and Design Engineer",
    "department": "Chassis & Design",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/deepishree-meher.png"
  },
  {
    "name": "Sanjeet Behera",
    "role": "Chassis and Design Engineer",
    "department": "Chassis & Design",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/sanjeet-behera.png"
  },
  {
    "name": "Pragyan Bhanja",
    "role": "Chassis and Design Engineer",
    "department": "Chassis & Design",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/pragyan-bhanja.png"
  },
  {
    "name": "Rohan Saha",
    "role": "Chassis and Design Engineer",
    "department": "Chassis & Design",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/rohan-saha.png"
  },
  {
    "name": "Baibhab Dhal",
    "role": "Chassis and Design Engineer",
    "department": "Chassis & Design",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/baibhab-dhal.png"
  },
  {
    "name": "Jenisha Sahoo",
    "role": "Chassis and Design Engineer",
    "department": "Chassis & Design",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/jenisha-sahoo.png"
  },
  {
    "name": "Smruti",
    "role": "Chassis and Design Engineer",
    "department": "Chassis & Design",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/smruti.png"
  },
  {
    "name": "Bhumika Mirdha",
    "role": "Chassis and Design Engineer",
    "department": "Chassis & Design",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/bhumika-mirdha.png"
  },
  {
    "name": "Madhusmita Biswal",
    "role": "Chassis and Design Engineer",
    "department": "Chassis & Design",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/madhusmita-biswal.png"
  },
  {
    "name": "Biswashree Behura",
    "role": "Chassis and Design Engineer",
    "department": "Chassis & Design",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/biswashree-behura.png"
  },
  {
    "name": "Mukta Hota",
    "role": "Chassis and Design Engineer",
    "department": "Chassis & Design",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/mukta-hota.png"
  },

  // --- Group 2: Suspension & Steering (11 Members) ---
  {
    "name": "Tejaswini Behera",
    "role": "Suspension and Steering Engineer",
    "department": "Suspension & Steering",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/tejaswini-behera.png"
  },
  {
    "name": "Pratyush Tripathy",
    "role": "Suspension and Steering Engineer",
    "department": "Suspension & Steering",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/pratyush-tripathy.png"
  },
  {
    "name": "Somnath Sahu",
    "role": "Suspension and Steering Engineer",
    "department": "Suspension & Steering",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/somnath-sahu.png"
  },
  {
    "name": "Diptansu Sahoo",
    "role": "Suspension and Steering Engineer",
    "department": "Suspension & Steering",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/diptansu-sahoo.png"
  },
  {
    "name": "Ankit Chandra",
    "role": "Suspension and Steering Engineer",
    "department": "Suspension & Steering",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/ankit-chandra.png"
  },
  {
    "name": "Bibhutananda Jena",
    "role": "Suspension and Steering Engineer",
    "department": "Suspension & Steering",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/bibhu-jena.png"
  },
  {
    "name": "Anshuman Satpathy",
    "role": "Suspension and Steering Engineer",
    "department": "Suspension & Steering",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/anshuman-satpathy.png"
  },
  {
    "name": "Soham Mishra",
    "role": "Suspension and Steering Engineer",
    "department": "Suspension & Steering",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/soham-mishra.png"
  },
  {
    "name": "K Ankita Patra",
    "role": "Suspension and Steering Engineer",
    "department": "Suspension & Steering",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/k-ankita-patra.png"
  },
  {
    "name": "Rajib Debnath",
    "role": "Suspension and Steering Engineer",
    "department": "Suspension & Steering",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/rajiv-debnath.png"
  },
  {
    "name": "Angel Mahananda",
    "role": "Suspension and Steering Engineer",
    "department": "Suspension & Steering",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/angel-mahananda.png"
  },

  // --- Group 3: Brakes & Tyres (9 Members) ---
  {
    "name": "Aryapriya Panigrahi",
    "role": "Brakes and Tyres Engineer",
    "department": "Brakes & Tyres",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/aryapriya-panigrahi.png"
  },
  {
    "name": "Siddharth Swain",
    "role": "Brakes and Tyres Engineer",
    "department": "Brakes & Tyres",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/siddharth-swain.png"
  },
  {
    "name": "Debashish Mahato",
    "role": "Brakes and Tyres Engineer",
    "department": "Brakes & Tyres",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/debashish-mahato.png"
  },
  {
    "name": "Suchit Sourav Barik",
    "role": "Brakes and Tyres Engineer",
    "department": "Brakes & Tyres",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/suchit-sourav-barik.png"
  },
  {
    "name": "Abhishek Pradhan",
    "role": "Brakes and Tyres Engineer",
    "department": "Brakes & Tyres",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/abhishek-pradhan.png"
  },
  {
    "name": "Farhan Khan",
    "role": "Brakes and Tyres Engineer",
    "department": "Brakes & Tyres",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/farhan-khan.png"
  },
  {
    "name": "Abhishek Pattnaik",
    "role": "Brakes and Tyres Engineer",
    "department": "Brakes & Tyres",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/abhishek-pattnaik.png"
  },
  {
    "name": "Arpita Biswal",
    "role": "Brakes and Tyres Engineer",
    "department": "Brakes & Tyres",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/arpita-biswal.png"
  },
  {
    "name": "Silki Priya Seth",
    "role": "Brakes and Tyres Engineer",
    "department": "Brakes & Tyres",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/silki-priya-seth.png"
  },

  // --- Group 4: Powertrain & Drivetrain (14 Members) ---
  {
    "name": "Pratyush Sahoo",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/pratyush-sahoo.png"
  },
  {
    "name": "Sushmit Kumar Satapathy",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/sushmit-kumar.png"
  },
  {
    "name": "Soumya Ranjan Panda",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/soumya-ranjan-panda.png"
  },
  {
    "name": "Lokanath Swain",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/loknath-swain.png"
  },
  {
    "name": "Anshuman Swain",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/anshuman-swain.png"
  },
  {
    "name": "Aditya Samal",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/aditya-samal.png"
  },
  {
    "name": "Manoranjan Panda",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/manoranjan-panda.png"
  },
  {
    "name": "Omkar Tripathy",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/omkar-tripathy.png"
  },
  {
    "name": "Arsalan Ali",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/arsalan-ali.png"
  },
  {
    "name": "Badri Prasad Baral",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/badri-prasad-baral.png"
  },
  {
    "name": "Sujata Sahu",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/sujata-sahu.png"
  },
  {
    "name": "Payosmi Pritismita",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/payosmi-pritismita.png"
  },
  {
    "name": "Somya Ranjan Panda",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/somya-ranjan-panda.png"
  },
  {
    "name": "Prabhu Pritam Sabat",
    "role": "Powertrain and Drivetrain Engineer",
    "department": "Powertrain & Drivetrain",
    "subgroup": "Engineering Domain",
    "year": "2nd Year",
    "image": "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/domain-members/prabhu-pritam-sabat.png"
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
  // 1. TEAM LEAD / EXECUTIVE COUNCIL
  // ==========================================
  {
    name: "Amritanshu Tripathy",
    role: "Team Captain",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/amritanshu-tripathy.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Rohit Sharma",
    role: "Vice-Captain",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/rohit-sharma.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Atmabhu Padhi",
    role: "Technical Head",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/atmabhu-padhi.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Adyasha Deb",
    role: "Marketing & Sponsorship Head",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/adyasha-deb.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Aryean Prasad Panigrahi",
    role: "Manufacturing Head",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/aryean-prasad-panigrahi.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Debesh Kumar Nayak",
    role: "Procurement Head",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/debesh-kumar-nayak.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "K. Asish Subudhi",
    role: "Brakes & Tyres Head",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/k-asish-subudhi.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Darshana Puhan",
    role: "Chassis & Design Head",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/darshana-puhan.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Radhashyam Jena",
    role: "Powertrain & Drivetrain Head",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/radhashyam-jena.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Harsh Mittal",
    role: "Suspension & Steering Head",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/harsh-mittal.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Abhisek Sethi",
    role: "Event Manager",
    department: "Team Lead",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/abhisek-sethi.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Nrusingha Dalai",
    role: "Team Manager",
    department: "Suspension & Steering",
    year: "3rd Year (Pre-Final)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/nrusingha-dalai.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Sourav Muduly",
    role: "PR Officer ( P.R.O )",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/sourav-muduly.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Bineeta Sinha",
    role: "PR Officer ( P.R.O )",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/bineeta-sinha.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "P. Devi Prasad Achary",
    role: "Treasurer",
    department: "Chassis & Design",
    year: "3rd Year (Pre-Final)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/p-devi-prasad-achary.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Tikeshwar Pradhan",
    role: "Inventory Head",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/tikeshwar-pradhan.webp",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Ayush Kumar",
    role: "Media & Videography Head",
    department: "Team Lead",
    year: "3rd Year (Pre-Final)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Ayush%20Kumar.jpg",
    subgroup: "Team Lead",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },

  // ==========================================
  // 2. CHASSIS & DESIGN
  // ==========================================
  {
    name: "Darshana Puhan",
    role: "Chassis & Design Head",
    department: "Chassis & Design",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/darshana-puhan.webp",
    subgroup: "Chassis & Design",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Ayush Biswal",
    role: "Chassis & Aerodynamics Lead",
    department: "Chassis & Design",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Ayush%20Biswal.jpg",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Debesh Kumar Nayak",
    role: "Chassis Manufacturing Head",
    department: "Chassis & Design",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/debesh-kumar-nayak.webp",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Shriyans Hota",
    role: "Composite Fabrication & Aero",
    department: "Chassis & Design",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402020065",
    image: "https://veerracersselectric.netlify.app/Team/2ndYears/shriyans%20hota.jpg",
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
    image: "https://veerracersselectric.netlify.app/Team/2ndYears/Adyasha%20Kar.jpg",
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
    regdNo: "2502020054",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Bijeyita Nayak",
    role: "Aerodynamic CFD Simulation",
    department: "Chassis & Design",
    year: "2nd Year",
    regdNo: "2502020015",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Parshuram Nath",
    role: "Roll Cage Integrity & Safety",
    department: "Chassis & Design",
    year: "2nd Year",
    regdNo: "2502020042",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Akshit Bindhani",
    role: "Material Selection & Metallurgy",
    department: "Chassis & Design",
    year: "2nd Year",
    regdNo: "2502020008",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    subgroup: "Chassis & Design",
    socials: {}
  },
  {
    name: "Manisha Meher",
    role: "Composite Layup & Testing",
    department: "Chassis & Design",
    year: "2nd Year",
    regdNo: "2502020037",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    subgroup: "Chassis & Design",
    socials: {}
  },

  // ==========================================
  // 3. SUSPENSION & STEERING
  // ==========================================
  {
    name: "Harsh Mittal",
    role: "Suspension & Steering Head",
    department: "Suspension & Steering",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/harsh-mittal.webp",
    subgroup: "Suspension & Steering",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Rohit Sharma",
    role: "Vice-Captain & Vehicle Dynamics Lead",
    department: "Suspension & Steering",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/rohit-sharma.webp",
    subgroup: "Suspension & Steering",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Mohit Mishra",
    role: "Steering Kinematics & Uprights Lead",
    department: "Suspension & Steering",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/mohit%20mishra.jpg",
    subgroup: "Suspension & Steering",
    socials: {}
  },
  {
    name: "Guduli Patro",
    role: "Pushrod & Damper Geometry",
    department: "Suspension & Steering",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Guduli%20Patro.jpg",
    subgroup: "Suspension & Steering",
    socials: {}
  },
  {
    name: "Hrishita Behera",
    role: "Wishbone Design & Hub Geometry",
    department: "Suspension & Steering",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Hrishita%20Behera.jpg",
    subgroup: "Suspension & Steering",
    socials: {}
  },
  {
    name: "Nilu Mahankuda",
    role: "Alignment & Trackside Setup",
    department: "Suspension & Steering",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/nilu.jpg",
    subgroup: "Suspension & Steering",
    socials: {}
  },
  {
    name: "Sushree M Mayurika",
    role: "Dynamics Simulation & Testing",
    department: "Suspension & Steering",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Sushree%20M%20Mayurika.jpg",
    subgroup: "Suspension & Steering",
    socials: {}
  },
  {
    name: "Pankaj Kumar Patra",
    role: "Suspension Kinematics & Wishbones",
    department: "Suspension & Steering",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402090038",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    subgroup: "Suspension & Steering",
    socials: {}
  },
  {
    name: "Shubransu Shekhar Sethy",
    role: "Steering Assembly & Uprights",
    department: "Suspension & Steering",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402090059",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
    subgroup: "Suspension & Steering",
    socials: {}
  },

  // ==========================================
  // 4. POWERTRAIN & DRIVETRAIN
  // ==========================================
  {
    name: "Radhashyam Jena",
    role: "Powertrain & Drivetrain Head",
    department: "Powertrain & Drivetrain",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/radhashyam-jena.webp",
    subgroup: "Powertrain & Drivetrain",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Atmabhu Padhi",
    role: "Technical Head & HV Integration",
    department: "Powertrain & Drivetrain",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/atmabhu-padhi.webp",
    subgroup: "Powertrain & Drivetrain",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Yash Safi",
    role: "BMS Architecture & Cell Packaging",
    department: "Powertrain & Drivetrain",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/yash%20safi.jpg",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Sahil Ahmed",
    role: "Inverter Control & Motor Telemetry",
    department: "Powertrain & Drivetrain",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/sahil%20ahmed.jpg",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Rakesh Barik",
    role: "Drivetrain & Transmission Lead",
    department: "Powertrain & Drivetrain",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Rakesh%20Barik.jpg",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Krishnachandra Panigrahy",
    role: "High Voltage Packaging & Harnessing",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402050045",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Satyaranjan Pusti",
    role: "Chain Drive & Sprocket Design",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402050077",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Rajat Mishra",
    role: "Planetary Gearbox & Mountings",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402050068",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Siddharth Singh",
    role: "Low Voltage Systems & ECU",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402050085",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Manas Ranjan Pattnayak",
    role: "Thermal Management & Cooling Loop",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402050051",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Subash Pradhan",
    role: "Drivetrain Alignment & Validation",
    department: "Powertrain & Drivetrain",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402050089",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Arman Mishra",
    role: "Battery Safety & Pre-Charge Circuits",
    department: "Powertrain & Drivetrain",
    year: "2nd Year",
    regdNo: "2502050012",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },
  {
    name: "Salabega Majhi",
    role: "Drivetrain Sensors & Telemetry",
    department: "Powertrain & Drivetrain",
    year: "2nd Year",
    regdNo: "2502050064",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    subgroup: "Powertrain & Drivetrain",
    socials: {}
  },

  // ==========================================
  // 5. BRAKES
  // ==========================================
  {
    name: "K. Asish Subudhi",
    role: "Brakes & Tyres Head",
    department: "Brakes",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/k-asish-subudhi.webp",
    subgroup: "Brakes",
    socials: { linkedin: "https://www.linkedin.com/company/veerracerss-electric/" }
  },
  {
    name: "Mansha Naaz",
    role: "Braking Systems Lead",
    department: "Brakes",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/mansha%20naaz.jpg",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Aryean Prasad Panigrahi",
    role: "Manufacturing Head & Calipers",
    department: "Brakes",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/aryean-prasad-panigrahi.webp",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Abhisek Sethi",
    role: "Event Manager & Brake Discs",
    department: "Brakes",
    year: "Final Year (4th Year)",
    image: "https://fizxzmnvsbsjrmgthdqq.supabase.co/storage/v1/object/public/member-images/council/abhisek-sethi.webp",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Ganesh Bhuyan",
    role: "Brake Bias & Balancing",
    department: "Brakes",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Ganesh%20Bhuyan.jpg",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Asmit Kumar Malla",
    role: "Pneumatics & Over-Travel Switch",
    department: "Brakes",
    year: "Final Year (4th Year)",
    image: "https://veerracersselectric.netlify.app/Team/3rdYears/Asmit%20Kumar%20Malla.jpg",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Aparna Behera",
    role: "Regenerative Braking & Electronic Bias",
    department: "Brakes",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402090014",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Mohammad Saad",
    role: "Brake Line Routing & Bleeding",
    department: "Brakes",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402090035",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Kamal Behera",
    role: "Brake Rotor Design & Rigidity",
    department: "Brakes",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402090028",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Sagar Gouda",
    role: "Brake Temperature DAQ & Sensors",
    department: "Brakes",
    year: "3rd Year (Pre-Final)",
    regdNo: "2402090053",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Subhranshu Mallik",
    role: "Caliper Mounting & Assembly",
    department: "Brakes",
    year: "2nd Year",
    regdNo: "2502090062",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Aditya Kumar Jha",
    role: "Brake Fluid Dynamics & Hydraulics",
    department: "Brakes",
    year: "2nd Year",
    regdNo: "2502090005",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    subgroup: "Brakes",
    socials: {}
  },
  {
    name: "Swagat Nayak",
    role: "Tyre Compound Analysis & Traction",
    department: "Brakes",
    year: "2nd Year",
    regdNo: "2502090065",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    subgroup: "Brakes",
    socials: {}
  }
];
