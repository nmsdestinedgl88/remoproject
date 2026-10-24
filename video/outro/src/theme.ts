// theme.ts — single source of truth for the Sevun outro.
import { Easing } from "remotion";

export const theme = {
  fps: 30,
  duration: 10,
  colors: {
    paper: "#F7F3EE",
    ink: "#22162F",
    orange: "#FF6600", // measured from the logo
    orangeDeep: "#C24A00",
    purple: "#7851A9", // measured from the logo
    purpleDeep: "#4E3175",
  },
  fonts: { display: "Outfit" },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    move: Easing.bezier(0.65, 0, 0.35, 1),
  },
  spring: {
    premium: { damping: 16, stiffness: 120, mass: 1 },
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    land: { damping: 11, stiffness: 150, mass: 0.8 },
  },
} as const;
