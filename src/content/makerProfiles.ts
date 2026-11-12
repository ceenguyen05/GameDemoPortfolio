import { developers } from "./developers";
import type { MakerProfile } from "../types/developer";

// Casey's supplied resume and maker descriptions, confirmed November 11, 2026.
// Do not infer employers, credentials, links, or shipped features for a maker.
export const makerProfiles: Record<string, MakerProfile> = {
  [developers.casey.slug]: {
    role: "Software engineer / AI graduate student",
    introduction:
      "From production web applications to a multiplayer FPS in a browser, Casey builds the systems behind the experience and the interface people use. He created Playroom as a shared home for games made by friends, alongside his work at Applied Concepts and graduate studies in artificial intelligence.",
    specialties: [
      "Full-Stack Development",
      "Game Development",
      "Agentic Software",
      "Web Applications",
      "Machine Learning",
      "Deep Learning",
    ],
    sections: [
      {
        title: "Selected engineering work",
        entries: [
          {
            title: "ACI: Series 1",
            detail: "TypeScript / Three.js / Node.js / WebSockets / MySQL",
            description:
              "Built a deterministic 64-tick simulation shared by browser gameplay, headless tests, and an authoritative multiplayer server. Client prediction, matchmaking, bot backfill, and ranked progression support online play. Serializing snapshots once per room reduced server snapshot cost by up to 4.7×, with 320+ tests in the deployment checks.",
          },
          {
            title: "Playroom",
            detail: "Next.js / React / TypeScript / Tailwind CSS",
            description:
              "Designed and built this collection with a validated game catalog, static pages, persistent saved picks, and on-demand previews. Keyboard navigation, reduced-motion support, Playwright checks, and Lighthouse audits are part of the experience from the start.",
          },
          {
            title: "Alzheimer's disease classification from EEG",
            detail: "Python / scikit-learn / FastAPI",
            description:
              "Built a three-class classifier using OpenNeuro data and a web app for EEG upload, preprocessing, predictions, and feature visualization. After correcting data leakage, a tuned Random Forest reached 81.06% held-out accuracy and a 0.86 F1 score for Alzheimer's detection.",
          },
        ],
      },
      {
        title: "Experience",
        entries: [
          {
            title: "Software Engineer · Applied Concepts, Inc.",
            detail: "October 2025–present / Richardson, TX",
            description:
              "Joined as an intern and moved into a full-time engineering role in May 2026. Builds traffic-device monitoring applications with React, ASP.NET, and SQL, including Azure-hosted REST APIs, real-time dashboards, and customer and device registration.",
          },
          {
            title: "Software Development Instructor · iCode School",
            detail: "September–November 2025 / Murphy, TX",
            description:
              "Taught programming, Unreal Engine 5, and AI tools to students ages 5–15. Mentored small teams building robotics, web applications, and cybersecurity projects.",
          },
        ],
      },
      {
        title: "Education",
        entries: [
          {
            title: "M.S. in Artificial Intelligence · UT Austin",
            detail: "August 2026–expected December 2027 / GPA 4.00",
            description:
              "Graduate study in machine learning, reinforcement learning, and agentic software engineering.",
          },
          {
            title: "B.S. in Computer Science · UT Dallas",
            detail: "August 2023–May 2026 / GPA 3.80",
            description:
              "Named to the Dean's List for five consecutive semesters.",
          },
        ],
      },
    ],
  },
  [developers.trea.slug]: {
    role: "Electrical engineer / Game creator",
    introduction:
      "Trea is an electrical engineer inspired by game development and the possibilities of AI. He is bringing that curiosity into browser games with Devil 2, a remake project currently in development.",
    specialties: [
      "Electrical engineering",
      "Game development",
      "AI exploration",
    ],
    sections: [
      {
        title: "On the workbench",
        entries: [
          {
            title: "Devil 2",
            detail: "Browser remake / In development",
            description:
              "A familiar idea, a fresh browser tab. Trea is working toward a first playable demo; the game page will collect previews, controls, and a launch link as the project takes shape.",
          },
        ],
      },
    ],
  },
};
