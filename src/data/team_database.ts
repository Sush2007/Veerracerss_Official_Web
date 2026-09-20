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
  image: string;
  year: string;
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
    "name": "Prof. (Dr.) P. Nanda",
    "role": "Senior Faculty Advisor",
    "department": "Mechanical Engineering",
    "tenure": "Present",
    "image": "https://veerracersselectric.netlify.app/team/pnanda.png",
    "profileUrl": "https://www.vssut.ac.in/"
  },
  {
    "name": "Mr. Debasish Tripathy",
    "role": "Faculty Advisor",
    "department": "Mechanical Engineering",
    "tenure": "Present",
    "image": "https://veerracersselectric.netlify.app/team/debasish%20tripathy.jpg",
    "profileUrl": "https://www.vssut.ac.in/faculty-profile.php?furl=debasish-tripathy"
  },
  {
    "name": "Dr. Swagatika Mishra",
    "role": "Faculty Advisor",
    "department": "Electrical Engineering",
    "tenure": "Present",
    "image": "https://veerracersselectric.netlify.app/team/swagatika%20mishra.jpg",
    "profileUrl": "https://www.vssut.ac.in/"
  },
  {
    "name": "Mr. Prabir Kumar Jena",
    "role": "Former Faculty Advisor",
    "department": "Mechanical Engineering",
    "tenure": "2020 - 2023",
    "image": "https://veerracersselectric.netlify.app/team/prabir%20kumar%20jena.jpg",
    "profileUrl": "https://www.vssut.ac.in/faculty-profile.php?furl=prabir-kumar-jena"
  }
];

export const CORE_LEADERSHIP: CoreLeader[] = [
  {
    "name": "Satyabrata Sahoo",
    "role": "Team Captain",
    "subgroup": "Executive Leadership",
    "image": "https://veerracersselectric.netlify.app/Team/Satyabrata%20sahoo.jpeg",
    "description": "Leading vehicle architecture, team coordination, and dynamic track operations.",
    "linkedin": "https://www.linkedin.com/company/veerracerss-electric/"
  },
  {
    "name": "Abhishek Sabat",
    "role": "Vice-Captain",
    "subgroup": "Executive Leadership",
    "image": "https://veerracersselectric.netlify.app/Team/Abhishek.jpg",
    "description": "Overseeing static events, business presentation, and powertrain validation.",
    "linkedin": "https://www.linkedin.com/company/veerracerss-electric/"
  },
  {
    "name": "Bishnu Prasad Sahu",
    "role": "Technical Head",
    "subgroup": "Technical Leadership",
    "image": "https://veerracersselectric.netlify.app/imgs/bishnu%20(2).jpeg",
    "description": "Directing electrical design, HV battery systems, and aerodynamic simulations.",
    "linkedin": "https://www.linkedin.com/in/bishnu393/"
  },
  {
    "name": "Darshana Puhan",
    "role": "Public Relations Officer (P.R.O.)",
    "subgroup": "Public Relations & Operations",
    "image": "https://veerracersselectric.netlify.app/Team/Council-26/Darshana.png",
    "description": "Managing corporate sponsorships, media outreach, and institutional relations.",
    "linkedin": "https://www.linkedin.com/company/veerracerss-electric/"
  }
];

export const TEAM_COHORTS: Record<string, TeamMemberProfile[]> = {
  "2026": [
    {
      "name": "Sai Sankar Patnaik",
      "role": "Brakes and Tyres  - Captain",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/SaiCap.png",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Subham Dash",
      "role": "Chassis and Design - Vice-Captain",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/SubhamD.png",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Karan Patel",
      "role": "Power Train  - Technical Head",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/KaranP.png",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "K Anish Kumar Subudhi",
      "role": "Suspension and Steering - Sponsorship and Marketing Head",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/AnishSp.png",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "K Shivaram",
      "role": "Chassis and Design  - Manufacturing Head",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/KShivram.png",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Rabinarayan Barik",
      "role": "Chassis and Design  -  Procurement Head",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/Rabi.png",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Sudipti Nayak",
      "role": "Brakes and Tyres  - Brakes and Tyres Head",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/Sudipti.png",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Atulya Bhoi",
      "role": "Chassis and Design  - Chassis and Design Head",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/AtulyaCD.png",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Rudra Narayan Sahu",
      "role": "Suspension and Steering - Suspension and Steering Head",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/Rudra.png",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Anurag Mohakud",
      "role": "Drivetrain  - Drivetrain Head",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/AnuragMoh.png",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Anurag Pradhan",
      "role": "Powertrain  - Powertrain Head",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/AnuragPradhan.png",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Jyoti Priyadarshni Jena",
      "role": "Chassis and Design  - Event Manager",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/JyotiPri.png",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Adity Bishoyi",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Adity%20Bishoyi.jpg",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Abhisek Kumar Choudhary",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Abhisek%20Kumar%20Choudhary.jpeg",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Jatadhari Sahoo",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/JD1.jpg",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Ankita Panda",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/Ankita%20Panda.jpeg",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Ashutosh Sahu",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/Ashutosh%20sahu.jpeg",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Anshuman Sahu",
      "role": "Drivetrain",
      "image": "https://veerracersselectric.netlify.app/Team/Anshuman%20Sahu.jpg",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Ujwal Singh",
      "role": "Drivetrain",
      "image": "https://veerracersselectric.netlify.app/Team/Ujjwal.jpg",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Priyakanta Prusty",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/Priyakanta%20prusty.jpg",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Nazrul Mohammed Nut",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Nazrul%20Mohammed%20Nut.jpg",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Shishir Ranjan Patra",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/SHISHIR%20RANJAN%20PATRA.jpg",
      "year": "2026",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Amritanshu Tripathy",
      "role": "Chassis and Design - Team Manager",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/AmritanshuTr.png",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Darshana Puhan",
      "role": "Chassis and Design - P.R.O.",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/Darshana.png",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Adyasha Deb",
      "role": "Chassis and Design  - P.R.O.",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/Adyasha.png",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Atmabhu Padhi",
      "role": "DriveTrain -  Treasurer",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/AtmabhuP.png",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Debesh Kumar Nayak",
      "role": "Chassis and Design  - Inventory Head",
      "image": "https://veerracersselectric.netlify.app/Team/Council-26/Debesh.png",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Ayush Kumar",
      "role": "DriveTrain - Videographer",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/Ayush%20Kumar.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Mansha Naaz",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/Mansha%20Naaz.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Aryean Prasad Panigrahi",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/Aryean%20Prasad%20Panigrahi.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "K Asish Subudhi",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/K%20ASISH%20SUBUDHI.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Abhisek Sethi",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Abhisek%20Sethi.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Ganesh Bhuyan",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Ganesh%20Bhuyan.jpeg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Asmit Kumar Malla",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Asmit%20Kumar%20Malla.jpeg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Ayush Biswal",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/Ayush%20Biswal.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Rakesh Barik",
      "role": "Drivetrain",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/Rakesh%20Barik.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Radhashyam Jena",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/Radhashyam%20Jena.png",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Yash Safi",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/Yash%20Safi.jpeg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Sahil Ahmed",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/Sahil_ahmed.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Rohit Sharma",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/sahil.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Mohit Mishra",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/Mohit%20Mishra.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Guduli Patro",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/gudli%20-%20KAKS.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Hrishita Behera",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/Hrishita%20Behera.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Nilu Mahankuda",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/Nilu%20Mahankuda.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Harsh Mittal",
      "role": "Suspension And Steering",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/Harsh%20Mittal.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Sushree M Mayurika",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/3rdYears/Mayurika.jpg",
      "year": "2026",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Shoaib Khan",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Shoaib%20Khan.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Kiran Kumar Hota",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Som%20Hota.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Aparna Behera",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Aparna.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Akash Dansana",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Akash%20Dansana.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Shobhit Kandulna",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Shobhit%20Kandulna.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Soham satyabrata samal",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Soham%20Samal.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Binit Agrawal",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Binit%20Agrawal.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Sohan Kumar Deep",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Sohan%20Deep.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Ayush Samantasinghar",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Ayush%20Samantasinghar.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Mohit Das",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Mohit%20Das.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Shriyans Hota",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/shriyans%20hota.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "P Devi Prasad Achary",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Devi%20Prasad%20Achary.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Swagat Ranjan Swain",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Swagat%20Ranjan%20Swain.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Adyasha Kar",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Adyasha%20Kar.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "S Trisha Reddy",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Trisha%20Reddy.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Adeshna Panda",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Adeshna%20Panda.png",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Alonya Dungdung",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Alonya.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Biswabhanu Panda",
      "role": "DriveTrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Biswabhanu%20Panda.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Anshuman Mishra",
      "role": "DriveTrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/A%20Mishra.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Subham Nayak",
      "role": "DriveTrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Nayak%20S.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Utsav Gardia",
      "role": "DriveTrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Utsav.jpeg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Siddharth Singh",
      "role": "DriveTrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Siddharth%20Singh.jpeg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Rajat Mishra",
      "role": "DriveTrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Rajat%20mishra.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "K Dharmesh",
      "role": "DriveTrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Dharmesh%20K.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Satyaranjan Pusti",
      "role": "DriveTrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Satyaranjan%20pusti.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Arpan Mishra",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Arpan%20Mishra.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Krishnachandra Panigrahy",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Krishnachandra%20panigrahy.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Tirthesh P Biswal",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Tirthesh%20P%20Biswal.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Ranjan kumar Dansana",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Ranjan.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Bineeta Sinha",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Bineeta%20Sinha.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Tikeshwar Pradhan",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Tikeshwar%20Pradhan.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Sourav Muduly",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/SoURaVv.png",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Sumina Padhan",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Sumina%20Padhan.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Alina Lakra",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Alina%20Lakra.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Priyanshu Pati",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Priyanshu%20Pati.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Nrusingha Dalai",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Nrusingha%20Dalai.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Kedar Dharei",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/kedar%20dharei.jpeg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Roshan Dang",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/RoshanDang.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Anjishnu Pattanayak",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Anjishnu%20P.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Mohammad Saad aad",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Mohammad%20Saad.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Shubhransu Shekhar Sethy",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/2ndYears/Shubhransu%20Shekhar.jpg",
      "year": "2026",
      "subgroup": "Second Years",
      "socials": {}
    }
  ],
  "2025": [
    {
      "name": "Satyabrata sahoo",
      "role": "Brakes and Tyres  - Captain",
      "image": "https://veerracersselectric.netlify.app/Team/sat.jpeg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Abhishek Sabat",
      "role": "Suspension and Steering  - Vice-Captain",
      "image": "https://veerracersselectric.netlify.app/Team/Abhishek.jpg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Bishnu Prasad Sahu",
      "role": "Chassis and Design  - Technical Head",
      "image": "https://veerracersselectric.netlify.app/Team/bishnu%203.jpeg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Janmajaya Jena",
      "role": "Chassis and Design  - Manufacturing Head",
      "image": "https://veerracersselectric.netlify.app/Team/Janmajaya%20Jena.jpg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Soumya Saswati Sahoo",
      "role": "Suspension and Steering - Sponsorship and Marketing Head",
      "image": "https://veerracersselectric.netlify.app/Team/Soumya%20Sahoo.jpg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Anindita Pati",
      "role": "Suspension and Steering - Suspension and Steering Head",
      "image": "https://veerracersselectric.netlify.app/Team/Anindita%20Pati.jpg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Peter Toppo",
      "role": "Chassis and Design  - Chassis and Design Head",
      "image": "https://veerracersselectric.netlify.app/Team/Peter%20Toppo.jpg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "B. Milan Prusty",
      "role": "Brakes and Tyres  - Brakes and Tyres Head",
      "image": "https://veerracersselectric.netlify.app/Team/milan.jpg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Girija Meher",
      "role": "Powertrain and Drivetrain  - Drivetrain Head",
      "image": "https://veerracersselectric.netlify.app/Team/girja.jpeg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Samrit Krushan",
      "role": "Powertrain  - Powertrain Head",
      "image": "https://veerracersselectric.netlify.app/Team/Samrit%20Krushan.jpg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Soumya Ranjan Biswal",
      "role": "Chassis and Design  -  Procurement Head",
      "image": "https://veerracersselectric.netlify.app/Team/soumya.jpeg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Tanisha Das",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/tanisha.jpeg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Soumya Ranjan Gouda",
      "role": "Chassis and Design  - Event Manager",
      "image": "https://veerracersselectric.netlify.app/Team/soumya%20gauda.jpeg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Himadri Tanaya Acharya",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Himadri%20Acharya.jpg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Sanjana Mohanty",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Sanjana%20Mohanty.jpg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Tamanna Nandi",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/Tamanna.jpg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Shakambari Sahoo",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Shakumbari.jpeg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Sidrah Kamal",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/sidrha.png",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Suraj Kumar Mohanty",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Suraj%20Kumar%20Mohanty.jpg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Gokul chandra Mahapatra",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Gokul%20chandra%20Mahapatra.jpg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Aparna Bisoyee",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Aparna%20Bisoyee.jpg",
      "year": "2025",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Anshal Kumar Bhoi",
      "role": "Brakes and Tyres  - Team Manager",
      "image": "https://veerracersselectric.netlify.app/Team/ANSHAL%20KUMAR%20BHOI.jpg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "K Anish Kumar Subudhi",
      "role": "Suspension and Steering  - P.R.O.",
      "image": "https://veerracersselectric.netlify.app/Team/K%20ANISH%20KUMAR%20SUBUDHI.jpg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Subham Dash",
      "role": "Chassis and Design  - P.R.O.",
      "image": "https://veerracersselectric.netlify.app/Team/Itishree%20Dash.jpg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Jatadhari Sahoo",
      "role": "Chassis and Design  - Inventory Head",
      "image": "https://veerracersselectric.netlify.app/Team/Jatadhari%20Sahoo.jpg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Sai Sankar Patnaik",
      "role": "Brakes and Tyres  -  Treasurer",
      "image": "https://veerracersselectric.netlify.app/Team/sai%20shankar.jpeg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Rudra Narayan Sahu",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Rudra%20Narayan%20Sahu.jpeg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Ankita Panda",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/Ankita%20Panda.jpeg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Jyoti Priyadarshni Jena",
      "role": "",
      "image": "https://veerracersselectric.netlify.app/Team/Jyoti%20Priyadarshni%20Jena.jpeg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Sudipti Nayak",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Sudipti%20Nayak.jpg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Adity Bishoyi",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Adity%20Bishoyi.jpg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Atulya Bhoi",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/Atulya%20Bhoi.jpg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Nazrul Mohammed Nut",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Nazrul%20Mohammed%20Nut.jpg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Abhisek Kumar Choudhary",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Abhisek%20Kumar%20Choudhary.jpeg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Anurag Pradhan",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/Anurag%20Pradhan.jpg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Ashutosh Sahu",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/Ashutosh%20sahu.jpeg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "K Shivaram",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/K%20Shivaram.jpg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Priyakanta Prusty",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/Priyakanta%20prusty.jpg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Karan Patel",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/karan%20patel.jpeg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Shishir Ranjan Patra",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/SHISHIR%20RANJAN%20PATRA.jpg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Anurag Mohakud",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/Anurag%20Mohakud.jpg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Rabinarayan Barik",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/Rabinarayan%20Barik.jpeg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Anshuman Sahu",
      "role": "Drivetrain",
      "image": "https://veerracersselectric.netlify.app/Team/Anshuman%20Sahu.jpg",
      "year": "2025",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Adyasha Deb",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Adyasha%20Deb.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Mansha Naaz",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Mansha%20Naaz.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Aryean Prasad Panigrahi",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Aryean%20Prasad%20Panigrahi.png",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Atmabhu Padhi",
      "role": "Drivetrain",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/ATMABHU%20PADHI.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Ambika Prasad Dora",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Ambika%20Prasad%20Dora.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Bhababhuti Parida",
      "role": "Drivetrain",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Bhababhuti%20Parida.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Rohit Sharma",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/sahil.jpeg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Anwesha Ananya Mahendra",
      "role": "Drivetrain",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Anwesha%20Ananya%20Mahendra.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Darshana Puhan",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Darshana%20Puhan.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Mohit Mishra",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Mohit%20Mishra.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Debesh Kumar Nayak",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Debesh%20Kumar%20Nayak.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Guduli Patro",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/gudli%20-%20KAKS.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Hrishita Behera",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Hrishita%20Behera.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Nilu Mahankuda",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Nilu%20Mahankuda.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Ayush Biswal",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Ayush%20Biswal.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "K Asish Subudhi",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/K%20ASISH%20SUBUDHI.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Abhisek Nayak",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Abhisek%20Nayak.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Amritanshu Tripathy",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Amritanshu%20Tripathi.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Alanjay Lakra",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/ALANJAY%20LAKRA.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Harsh Mittal",
      "role": "Suspension And Steering",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Harsh%20Mittal.jpeg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Arshu Soren",
      "role": "Brakes And Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Arshu%20Soren.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Radhashyam Jena",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Radhashyam%20Jena.png",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Ayush Kumar",
      "role": "Drivetrain",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Ayush%20Kumar.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Ronak Pradhan",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Ronak%20Pradhan.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Rakesh Barik",
      "role": "Drivetrain",
      "image": "https://veerracersselectric.netlify.app/Team/second%20year/Rakesh%20Barik.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Abhisek Sethi",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Abhisek%20Sethi.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Aisha Ghosh",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/Aisha%20Ghosh.jpeg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Subham Kumar Nayak",
      "role": "Drivetrain",
      "image": "https://veerracersselectric.netlify.app/Team/Subham%20Kumar%20Nayak.jpeg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Eshaan Anish Bilung",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/Eshaan%20Anish%20Bilung.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Ganesh Bhuyan",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Ganesh%20Bhuyan.jpeg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Yash Safi",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/Yash%20Safi.jpeg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Sushree M Mayurika",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Sushree%20M%20Mayurika.jpg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Asmit Kumar Malla",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Asmit%20Kumar%20Malla.jpeg",
      "year": "2025",
      "subgroup": "Second Years",
      "socials": {}
    }
  ],
  "2024": [
    {
      "name": "Rajiv Lochan Singh",
      "role": "Chassis and Design  -  Captain",
      "image": "https://veerracersselectric.netlify.app/Team/Rajiv%20Lochan%20%20Singh.jpeg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Om Prakash Sahoo",
      "role": "Powertrain - Vice-captain",
      "image": "https://veerracersselectric.netlify.app/Team/om.jpeg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Diptesh Singh",
      "role": "Powertrain Head  - Technical Head",
      "image": "https://veerracersselectric.netlify.app/Team/Diptesh%20Ranjan%20Singh.jpeg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Nihar Purohit",
      "role": "Suspension and Steering  -  Marketing and Procurement Head",
      "image": "https://veerracersselectric.netlify.app/Team/Nihar%20Purohit.jpg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Sanidhya Soni",
      "role": "Chassis and Design Head  - Sponsorship Head",
      "image": "https://veerracersselectric.netlify.app/Team/sanidhiya.jpg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Jyotiraditya Sahoo",
      "role": "Suspension and Steering Head -",
      "image": "https://veerracersselectric.netlify.app/Team/Jyoti.jpeg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Arpan Kumar Routray",
      "role": "Brakes and Tyres Head",
      "image": "https://veerracersselectric.netlify.app/Team/ARPAN.jpg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Sourav Ranjan Behera",
      "role": "Brakes and Tyres  - Manufacturing Head",
      "image": "https://veerracersselectric.netlify.app/Team/Sourav.jpeg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Amarnath Maharana",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/Amarnath%20Maharana.png",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Biswajeet Mohanty",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Biswajeet%20Mohanty.jpg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Subhashree Nayak",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/Subhashree%20Nayak.jpg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Shradhananda Nayak",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/Shradhananda%20Nayak.jpg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Biswajeet Nayak",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/BISWAJEET%20NAYAK.jpg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Dibyajyoti Sahoo",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/Dibyajyoti%20Sahoo.jpeg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Tapaswini Paul",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Tapaswini%20Paul.jpg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "PADMESH RANJAN SAHU",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/PADMESH%20RANJAN%20SAHU.jpeg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Anmol Singh Bawa",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Anmol%20Bawa.jpeg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Rohit Das",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Rohit%20Das.jpg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Akash Sharma",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Akash%20Sharma.jpg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Shrikant Sahu",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Shrikant%20Sahu.jpeg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Manik Panda",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Manik%20Panda.jpeg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Puspanjali Bisoi",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Puspanjali%20Bisoi.jpg",
      "year": "2024",
      "subgroup": "Final Years",
      "socials": {}
    },
    {
      "name": "Bishnu Prasad Sahu",
      "role": "Chassis and Design  -  Web Developer",
      "image": "https://veerracersselectric.netlify.app/Team/Bishnu%20Sahu.jpeg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Satyabrata sahoo",
      "role": "Brakes and Tyres  -  Team Manager",
      "image": "https://veerracersselectric.netlify.app/Team/sat.jpeg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Soumya Saswati Sahoo",
      "role": "Suspension and Steering - P. R. O.",
      "image": "https://veerracersselectric.netlify.app/Team/Soumya%20Sahoo.jpg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Tanisha Das",
      "role": "Powertrain  - P. R. O.",
      "image": "https://veerracersselectric.netlify.app/Team/tanisha.jpeg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Janmajaya Jena",
      "role": "Chassis and Design  -  Treasurer",
      "image": "https://veerracersselectric.netlify.app/Team/Janmajaya%20Jena.jpg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Anindita Pati",
      "role": "Suspension and Steering  - Public Relations",
      "image": "https://veerracersselectric.netlify.app/Team/Anindita%20Pati.jpg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "B. Milan Prusty",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/milan.jpg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Abhishek Sabat",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Abhishek.jpg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Girija Meher",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/girja.jpeg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Samrit Krushan",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/Samrit%20Krushan.jpg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Soumya Ranjan Biswal",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/soumya.jpeg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Peter Toppo",
      "role": "Chassis and Design  -  Aerodynamics analyst",
      "image": "https://veerracersselectric.netlify.app/Team/Peter%20Toppo.jpg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Himadri Tanaya Acharya",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Himadri%20Acharya.jpg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Sanjana Mohanty",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Sanjana%20Mohanty.jpg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Tamanna Nandi",
      "role": "Powertrain",
      "image": "https://veerracersselectric.netlify.app/Team/Tamanna.jpg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Sidrah Kamal",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/sidrah_photo-removebg-preview.png",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Suraj Kumar Mohanty",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Suraj%20Kumar%20Mohanty.jpg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Gokul chandra Mahapatra",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Gokul%20chandra%20Mahapatra.jpg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Aparna Bisoyee",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Aparna%20Bisoyee.jpg",
      "year": "2024",
      "subgroup": "Pre-Final Years",
      "socials": {}
    },
    {
      "name": "Subham Dash",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/Itishree%20Dash.jpg",
      "year": "2024",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Jatadhari Sahoo",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/Jatadhari%20Sahoo.jpg",
      "year": "2024",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Anshal Kumar Bhoi",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/ANSHAL%20KUMAR%20BHOI.jpg",
      "year": "2024",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Sai Sankar Patnaik",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/sai%20shankar.jpeg",
      "year": "2024",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "K Anish Kumar Subudhi",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/K%20ANISH%20KUMAR%20SUBUDHI.jpg",
      "year": "2024",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Rudra Narayan Sahu",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Rudra%20Narayan%20Sahu.jpeg",
      "year": "2024",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Sudipti Nayak",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Sudipti%20Nayak.jpg",
      "year": "2024",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Adity Bishoyi",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Adity%20Bishoyi.jpg",
      "year": "2024",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Ankita Panda",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/Ankita%20Panda.jpeg",
      "year": "2024",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Jyoti Priyadarshni Jena",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Jyoti%20Priyadarshni%20Jena.jpeg",
      "year": "2024",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Atulya Bhoi",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/Atulya%20Bhoi.jpg",
      "year": "2024",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Nazrul Mohammed Nut",
      "role": "Suspension and Steering",
      "image": "https://veerracersselectric.netlify.app/Team/Nazrul%20Mohammed%20Nut.jpg",
      "year": "2024",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Abhisek Kumar Choudhary",
      "role": "Brakes and Tyres",
      "image": "https://veerracersselectric.netlify.app/Team/Abhisek%20Kumar%20Choudhary.jpeg",
      "year": "2024",
      "subgroup": "Second Years",
      "socials": {}
    },
    {
      "name": "Ashutosh Sahu",
      "role": "Chassis and Design",
      "image": "https://veerracersselectric.netlify.app/Team/Ashutosh%20sahu.jpeg",
      "year": "2024",
      "subgroup": "Second Years",
      "socials": {}
    }
  ],
  "2023": [],
  "2022": []
};

export const ALL_ACTIVE_MEMBERS: TeamMemberProfile[] = TEAM_COHORTS["2026"] || [];
