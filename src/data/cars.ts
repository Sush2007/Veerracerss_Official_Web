export interface CarSpec {
  name: string;
  year: string;
  category: "EV" | "Combustion";
  features: string[];
  stats: {
    speed: string;
    accel: string;
    weight: string;
    power: string;
  };
  image: string;
  competition: string;
  description: string;
}

export const CARS_DATA: CarSpec[] = [
  {
    name: "AETHER",
    year: "2025",
    category: "EV",
    features: [
      "10 KW PMSM Motor",
      "72V High Energy Density Battery Pack",
      "First EV in Odisha by an Engineering College",
      "Formula Imperial 2024 Overall P3 (EV)"
    ],
    stats: {
      speed: "115 km/h",
      accel: "3.1s 0-100",
      weight: "240kg",
      power: "10kW"
    },
    image: "/cars/aether.jpg",
    competition: "Formula Imperial 2024 @ Buddh International Circuit (P3 Overall EV)",
    description: "AETHER is the latest innovation of VeerRacerss Electric for the season 2024-25. It is the first EV made by any engineering college in Odisha. Powered by a 10 KW PMSM Motor with exceptional acceleration and torque, paired with an in-house developed 72V high energy density battery pack. The team passed technical inspections, driver egress, and brake tests with flying colours, culminating in an endurance run that secured P3 Overall in the EV category at Buddh International Circuit."
  },
  {
    name: "ZEUS 1.0",
    year: "2023",
    category: "EV",
    features: [
      "Custom Battery Management System (BMS)",
      "Aerodynamic Package & Diffuser",
      "RWD Dynamics Architecture",
      "Electrical Powertrain Platform"
    ],
    stats: {
      speed: "105 km/h",
      accel: "4.2s 0-100",
      weight: "260kg",
      power: "8kW"
    },
    image: "/cars/zeus-1.0.jpg",
    competition: "Formula Bharat 2023",
    description: "ZEUS 1.0 marked our historic transition into the EV domain. It served as the proving ground for electric motor controller calibration, safety interlock loops, and regenerative braking studies, establishing the engineering benchmarks that define our electric racing program."
  },
  {
    name: "VENTUS 5.0",
    year: "2022",
    category: "Combustion",
    features: [
      "High-Torsional Rigidity Steel Spaceframe",
      "Reliable Powertrain Calibration",
      "Custom Double-Wishbone Suspension",
      "Aerodynamic Winglets"
    ],
    stats: {
      speed: "95 km/h",
      accel: "4.8s 0-100",
      weight: "275kg",
      power: "Combustion"
    },
    image: "/cars/ventus-5.0.jpg",
    competition: "Formula Bharat 2022",
    description: "Part of the legendary Ventus combustion lineage. Built with a focus on mechanical grip, thermal stability, and endurance durability, establishing the fundamental vehicle dynamics philosophies that carried directly into our electric vehicle development."
  },
  {
    name: "VENTUS 4.0",
    year: "2020",
    category: "Combustion",
    features: [
      "Lightweight Chassis Optimization",
      "Custom 3D-Printed Air Intake",
      "Endurance-Tuned ECU Mapping",
      "Optimized Driver Ergonomics"
    ],
    stats: {
      speed: "90 km/h",
      accel: "5.1s 0-100",
      weight: "280kg",
      power: "Combustion"
    },
    image: "/cars/ventus-4.0.jpg",
    competition: "SUPRA SAE India 2020",
    description: "A relentless track machine designed to withstand the toughest dynamic endurance stages. Ventus 4.0 pushed our combustion engine tuning, cooling architecture, and weight reduction strategies to the limit."
  },
  {
    name: "VENTUS 16.3",
    year: "2019",
    category: "Combustion",
    features: [
      "Ergonomic Cockpit & Quick-Release Steering",
      "Robust Chain-Driven Differential",
      "Tuned Exhaust Resonance System",
      "Stiffened Uprights"
    ],
    stats: {
      speed: "85 km/h",
      accel: "5.5s 0-100",
      weight: "290kg",
      power: "Combustion"
    },
    image: "/cars/ventus-16.3.jpg",
    competition: "Formula Bharat 2019",
    description: "An evolutionary leap in the Ventus series, refining the driver interface, pedal box adjustability, and manufacturing precision to trim lap times and bolster structural reliability."
  },
  {
    name: "VENTUS 15.2",
    year: "2018",
    category: "Combustion",
    features: [
      "Foundation Tubular Spaceframe",
      "100% Student Fabricated",
      "Reliable Brake Over-Travel Switch Setup",
      "Proven Suspension Geometry"
    ],
    stats: {
      speed: "80 km/h",
      accel: "6.0s 0-100",
      weight: "300kg",
      power: "Combustion"
    },
    image: "/cars/ventus-15.2.jpg",
    competition: "SUPRA SAE India 2018",
    description: "The early foundations of Team VeerRacerss. Ventus 15.2 was the proving ground for student fabrication, machining, and competition team coordination at VSSUT Burla, sparking the electric racing legacy that thrives today."
  }
];
