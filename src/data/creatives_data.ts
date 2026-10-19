export interface CreativeArtwork {
  id: string;
  title: string;
  subtitle: string;
  category: "all" | "festivals" | "racedays" | "fests";
  date: string;
  image: string;
  tags: string[];
  designedBy: string;
  description: string;
}

export const CREATIVE_ARTWORKS: CreativeArtwork[] = [
  {
    id: "diwali-paddock",
    title: "DIWALI PADDOCK",
    subtitle: "Lighting Up the Track with Electric Voltage",
    category: "festivals",
    date: "Deepavali Festive Edition",
    image: "/creatives/diwali-paddock.jpg",
    tags: ["Diwali", "Festivals", "Induction & Fests"],
    designedBy: "VeerRacerss Media Wing",
    description: "Custom celebratory graphic fusing traditional earthen diyas with the high-voltage electrical arcs of our 72V formula accumulator, designed by the VeerRacerss Creative Wing."
  },
  {
    id: "utkala-dibasa",
    title: "UTKALA DIBASA",
    subtitle: "Odisha's Engineering Pride on National Asphalt",
    category: "festivals",
    date: "Odisha Cultural Heritage",
    image: "/creatives/utkala-dibasa.jpg",
    tags: ["Odisharia", "Race Days", "Heritage"],
    designedBy: "VeerRacerss Media Wing",
    description: "Honoring Odisha Foundation Day by intertwining the ancient architectural Konark Sun Temple chariot wheel with the carbon-fiber aerodynamics of VeerRacerss electric racing."
  },
  {
    id: "independence-day",
    title: "INDEPENDENCE DAY",
    subtitle: "Engineered for India, Built in Burla",
    category: "festivals",
    date: "15th August National Celebration",
    image: "/creatives/independence-day.jpg",
    tags: ["Saffron", "Tricolor", "Day"],
    designedBy: "VeerRacerss Media Wing",
    description: "A high-velocity celebration of Indian Independence featuring supersonic tricolor aerodynamic streaks cutting through the dark track."
  },
  {
    id: "season-opener-2025",
    title: "SEASON OPENER 2025",
    subtitle: "Buddh International Circuit Testing Launch",
    category: "racedays",
    date: "Formula Student Season Launch",
    image: "/creatives/season-opener-2025.jpg",
    tags: ["Track", "Telemetry", "Race Days"],
    designedBy: "VeerRacerss Media Wing",
    description: "Cybernetic telemetry artwork commemorating the opening of our national testing campaign with live CAN-bus timing and apex trajectory lines."
  }
];
