// Single source of truth: colours, easings, springs, fonts, canvas.
import { Easing } from "remotion";

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const theme = {
  colors: {
    blue: "#004BE0", // Bizif brand blue — the hero colour
    blueDeep: "#0A2A8C",
    blueSoft: "#DCE6FF",
    ink: "#0B1535",
    inkSoft: "#1B2A5A",
    paper: "#F3F4F6",
    card: "#FFFFFF",
    muted: "#6B7690",
    line: "#D5DAE6",
    gold: "#F2B33D", // meaning: gold backing / value
    goldDeep: "#B97A0B",
    goldLight: "#FFE29A",
    good: "#12A150",
  },
  fonts: {
    display: "Outfit",
    body: "Inter",
    mono: "JetBrains Mono",
  },
  ease: {
    out: Easing.bezier(0.23, 1, 0.32, 1),
    inOut: Easing.bezier(0.77, 0, 0.175, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 15, stiffness: 170, mass: 0.6 },
    smooth: { damping: 22, stiffness: 95, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    slam: { damping: 9, stiffness: 260, mass: 0.7 },
  },
} as const;

export const clampX = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
