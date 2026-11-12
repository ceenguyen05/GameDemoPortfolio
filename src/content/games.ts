import { developers } from "./developers";
import type { Game, LiveGame } from "../types/game";
import { validateGames } from "../lib/validateGames";

/**
 * The catalog. Every route, card, redirect, command, sitemap entry and OG image
 * is generated from this list; adding a game never needs new page code.
 * Order is display order. The first live game is featured on the home page.
 * See docs/ADDING_A_GAME.md.
 */
export const games: Game[] = validateGames([
  // Verified against github.com/ceenguyen05/ACI-Series1 at 3ec4a9e ("Version 1.7.6"):
  // README, src/config/controls.ts (DEFAULT_BINDINGS), src/config/gadgets.ts.
  {
    slug: "aci-series-1",
    developer: developers.casey,
    title: "ACI: Series 1",
    tagline: "Plant the bomb. Hold the site. Survive the horde.",
    description: {
      short:
        "A tactical first-person shooter. Two hand-built maps, Search & Destroy and Zombies, all in your browser.",
      long: "Fight through the offices and factory floor of ACI HQ, or the engineering spaces of ACI Building 2. Search & Destroy runs competitive bomb-defusal rounds with a full economy, learnable recoil, and tactical utility. Zombies turns ACI HQ into a round-based survival run with perks, weapon upgrades, revives, and an exfil to work toward. Play bots offline, or go online for casual, ranked, and private matches.",
    },
    status: "live",
    genre: ["Tactical FPS", "Search & Destroy", "Zombies"],
    platforms: ["Desktop browser", "Keyboard + mouse"],
    controlsNote:
      "Click inside the game to capture the mouse; Esc pauses and releases it. Every key can be rebound in Settings → Controls.",
    controls: [
      { keys: ["W", "A", "S", "D"], action: "Move" },
      { keys: ["LMB", "RMB"], action: "Fire / Aim" },
      { keys: ["Space"], action: "Jump / Mantle" },
      { keys: ["R"], action: "Reload" },
      { keys: ["C"], action: "Crouch, hold to go prone" },
      { keys: ["Q", "E"], action: "Lean left / right" },
      { keys: ["L Alt"], action: "Slide while running forward" },
      { keys: ["L Shift"], action: "Walk quietly" },
      { keys: ["F"], action: "Use / Defuse / Buy in Zombies" },
      { keys: ["B"], action: "Buy menu" },
      { keys: ["1", "2", "3"], action: "Weapons / Knife" },
      { keys: ["4", "5", "6"], action: "Grenades / Bomb / Gadgets" },
      { keys: ["Tab"], action: "Scoreboard (hold)" },
      { keys: ["Esc"], action: "Pause / Release mouse" },
      { keys: ["V"], action: "Quick melee" },
      { keys: ["H"], action: "Stim yourself" },
      { keys: ["7"], action: "Use killstreak" },
      { keys: ["Z"], action: "Detonate C4" },
      { keys: ["T"], action: "Camera / Drone feeds" },
      { keys: ["MMB"], action: "Ping enemy / Location" },
      { keys: ["G"], action: "Drop weapon" },
      { keys: ["X"], action: "Last weapon" },
      { keys: ["Y"], action: "Inspect weapon" },
      { keys: ["L"], action: "Weapon light" },
    ],
    techStack: [
      "TypeScript",
      "Three.js",
      "Vite",
      "Web Audio",
      "Node.js",
      "WebSockets",
      "MySQL",
    ],
    playUrl: "https://aci-series1.vercel.app/",
    repoUrl: "https://github.com/ceenguyen05/ACI-Series1",
    releaseDate: "2026-11-09", // Confirmed by Casey: first hub release is today.
    accentColor: "#ff743d",
    // Live v1.7.6 captures, November 10, 2026. See docs/ACI_CAPTURES.md.
    coverImage: {
      src: "/games/aci-series-1/cover.webp",
      alt: "ACI: Series 1 title screen over the ACI HQ factory, with Click or press any key",
      caption: "Startup / ACI HQ",
      width: 1920,
      height: 1080,
    },
    screenshots: [
      {
        src: "/games/aci-series-1/screenshot-01.webp",
        alt: "First-person view along ACI HQ's brick loading yard with a normal 100-health HUD",
        caption: "ACI HQ / Loading yard",
        width: 1920,
        height: 1080,
      },
      {
        src: "/games/aci-series-1/screenshot-02.webp",
        alt: "The assembly line and industrial equipment at ACI HQ's A site",
        caption: "ACI HQ / Assembly line",
        width: 1920,
        height: 1080,
      },
      {
        src: "/games/aci-series-1/screenshot-03.webp",
        alt: "ACI Building 2's brick exterior and main entrance from the parking lot",
        caption: "ACI Building 2 / Main entrance",
        width: 1920,
        height: 1080,
      },
      {
        src: "/games/aci-series-1/screenshot-04.webp",
        alt: "Engineering workbenches and testing equipment inside ACI Building 2's prototype lab",
        caption: "ACI Building 2 / Prototype lab",
        width: 1920,
        height: 1080,
      },
      {
        src: "/games/aci-series-1/cover.webp",
        alt: "ACI: Series 1 title screen over the ACI HQ factory, with Click or press any key",
        caption: "Startup / ACI HQ",
        width: 1920,
        height: 1080,
      },
      {
        src: "/games/aci-series-1/screenshot-05.webp",
        alt: "Facing an approaching zombie in the ACI HQ lobby during the first survival wave",
        caption: "Zombies / First wave",
        width: 1920,
        height: 1080,
      },
    ],
    // Confirmed by Casey: one entry for the current version, dated the hub
    // release, listing the game's features (from the ACI-Series1 README).
    changelog: [
      {
        version: "1.8.0",
        date: "2026-11-09",
        notes: [
          "Search & Destroy: competitive bomb defusal with buy phases, a round economy, halftime side swaps, and offline bot matches from 1v1 to 5v5.",
          "Two hand-built maps, ACI HQ and ACI Building 2, with map selection, Randomize, and spawns that change every round.",
          "Zombies: ACI HQ: Outbreak. Round-based survival solo or in squads of up to five, with friends or bots, Endless mode, revives, and a helicopter exfil.",
          "22 original guns plus a knife across eight classes, with learnable spray patterns, hit groups, range falloff, and wallbangs through wood, glass, and thin metal.",
          "Gunsmith: up to five attachments per gun, including optics, muzzles, grips, lasers, magazines, and ammo types.",
          "Source-style movement: counter-strafing, air-strafing, crouch-jumps, slides, prone, mantling, and leaning.",
          "Frags, flashbangs, smokes, Molotovs, and Recon Pulse; drones, sticky cams, trip mines, barbed wire, shields, EMP, and building CCTV.",
          "Fortify and breach doorways with barricades, a crowbar, and C4. Killstreaks: UAV, Counter-UAV, Hunter Drone, and a steerable Cruise Missile.",
          "Zombies arsenal: ten zombie types, 14 wall weapons, the Mystery Box, the Disruptor wonder weapon, Prototype Forge upgrades, eight perks, seven power-ups, and the Armory.",
          "Team-aware bots that buy, throw utility, plant, defuse, rotate, and retake, with four difficulty levels in both modes.",
          "Online casual and ranked Search & Destroy, private rooms with five-digit invite codes, bot-filled slots, placements, and Iron-to-Champion ranks.",
          "Career XP and levels in both modes, daily-play rewards, and operator and weapon-finish customization with live 3D previews.",
          "Pings, a final killcam, clutch and ACE callouts, and an optional live character paper doll.",
          "Every model, animation, and sound generated in code; baked global illumination; Low, Medium, and High graphics presets; rebindable controls and configurable aim assist.",
        ],
      },
    ],
  },

  // Names, browser platform, creators and coming-soon status confirmed 2026-11-10.
  // TODO(casey): each cover.webp below is concept art rendered from
  // art/covers/<slug>.svg (npm run render:covers). Replace it with a real
  // 1280×720 capture when the game has one, and delete the SVG source.
  {
    slug: "devil-game",
    developer: developers.trea,
    title: "Devil 2",
    tagline: "A new take. A new tab.",
    description: {
      short:
        "A browser-first remake in the works. A familiar idea, a fresh build, and a first playable demo still to come.",
      long: "Devil 2 is a browser-first remake project by Trea Edwards. Work is underway; the first playable build will bring controls, screenshots, and more details.",
    },
    status: "coming-soon",
    genre: [], // TODO(casey): add the genre once it's settled.
    platforms: ["Web browser"],
    controls: [],
    techStack: [],
    releaseDate: null,
    accentColor: "#e5484d",
    coverImage: {
      src: "/games/devil-game/cover.webp",
      alt: "Concept illustration for Devil 2: a glowing red portal between angular dark cliffs",
      caption: "Concept artwork / Gameplay not yet revealed",
      width: 1280,
      height: 720,
    },
    screenshots: [],
  },
  {
    slug: "untitled-obby",
    developer: developers.casey,
    title: "Multi Player Obby",
    tagline: "Good jumps. Better teamwork.",
    description: {
      short:
        "A co-op obstacle course for 2–6 players. Time your jumps, tackle challenges together, and get the whole crew to the finish.",
      long: "A browser-first take on the teamwork obby: an obstacle course for 2–6 friends, built around helping each other through tricky jumps and shared challenges. Work in progress; controls and gameplay previews will arrive with a playable build.",
    },
    status: "coming-soon",
    genre: ["Obby", "Multiplayer"],
    platforms: ["Web browser"],
    controls: [],
    techStack: [],
    releaseDate: null,
    accentColor: "#f5b82e",
    coverImage: {
      src: "/games/untitled-obby/cover.webp",
      alt: "Concept illustration for Multi Player Obby: colorful floating obstacle platforms and a checkered finish flag",
      caption: "Concept artwork / Gameplay not yet revealed",
      width: 1280,
      height: 720,
    },
    screenshots: [],
  },
  {
    slug: "moon-sweeper",
    developer: developers.casey,
    title: "Moon Sweeper",
    // Concept direction confirmed 2026-11-10; references in docs/CONTENT_SOURCES.md.
    tagline: "A small brush. A very big job.",
    description: {
      short:
        "A browser-first lunar cleanup game in the works. Sweep up moon dust and turn a tiny cleaning job into a bigger adventure.",
      long: "Inspired by the lunar-cleaning loop of Moon Sweepers and Roblox moon-cleaning games, this browser-first project starts with a simple idea: turn a dusty Moon into a satisfying cleanup job. The planned loop is to sweep, collect, and work toward better tools. Work in progress; final features and controls are still being built.",
    },
    status: "coming-soon",
    genre: ["Simulation", "Lunar cleanup"],
    platforms: ["Web browser"],
    controls: [],
    techStack: [],
    releaseDate: null,
    accentColor: "#8fb3ff",
    coverImage: {
      src: "/games/moon-sweeper/cover.webp",
      alt: "Concept illustration for Moon Sweeper: a cratered moon, an abstract lunar tile field, and a sweeping brush",
      caption: "Concept artwork / Gameplay not yet revealed",
      width: 1280,
      height: 720,
    },
    screenshots: [],
  },
]);

export function getGame(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}

export const liveGames = games.filter(
  (game): game is LiveGame => game.status === "live",
);

/** The first live game, or the first entry if nothing is live yet. */
export const featuredGame: Game | undefined = liveGames[0] ?? games[0];
