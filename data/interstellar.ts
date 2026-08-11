import type { InterstellarObject } from "@/lib/types";

// The only confirmed interstellar objects observed passing through our solar
// system. Static educational content — update as new visitors are confirmed.
export const interstellarObjects: InterstellarObject[] = [
  {
    designation: "1I/2017 U1",
    nickname: "ʻOumuamua",
    discovered: "19 October 2017",
    discoveredBy: "Pan-STARRS survey, Haleakalā, Hawaiʻi",
    classification: "Unknown — no coma, comet-like acceleration",
    speedKps: 26,
    status: "Departed the solar system",
    facts: [
      "First interstellar object ever detected passing through our solar system.",
      "Extremely elongated shape — up to 10× longer than wide, tumbling end over end.",
      "Accelerated away from the Sun slightly faster than gravity alone explains, with no visible outgassing — still debated by scientists.",
      "Its name is Hawaiian for 'a messenger from afar arriving first'.",
    ],
  },
  {
    designation: "2I/Borisov",
    nickname: "Borisov",
    discovered: "30 August 2019",
    discoveredBy: "Gennadiy Borisov, amateur astronomer, Crimea",
    classification: "Identified — active comet",
    speedKps: 32,
    status: "Departed the solar system",
    facts: [
      "First confirmed interstellar comet — it looked and behaved like comets born here.",
      "Grew a visible tail as the Sun warmed its ices, unlike ʻOumuamua.",
      "Carried unusually high amounts of carbon monoxide, hinting it formed around a colder, redder star.",
      "Its nucleus partially fragmented in 2020 as it left the inner solar system.",
    ],
  },
  {
    designation: "3I/ATLAS",
    nickname: "ATLAS",
    discovered: "1 July 2025",
    discoveredBy: "ATLAS survey telescope, Río Hurtado, Chile",
    classification: "Identified — active comet",
    speedKps: 58,
    status: "Passed perihelion October 2025",
    facts: [
      "Third confirmed interstellar visitor, and the fastest of the three.",
      "Arrived from the direction of the galactic centre on a sharply hyperbolic orbit.",
      "May have formed billions of years before our solar system, making it possibly the oldest comet ever observed.",
      "Studied by telescopes worldwide — including observations from Mars orbiters as it passed.",
    ],
  },
];
