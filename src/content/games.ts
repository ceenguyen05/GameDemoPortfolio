import type { Game, LiveGame } from "../types/game";
import { validateGames } from "../lib/validateGames";

/**
 * The catalog. Every route, card, redirect, command, sitemap entry and OG image
 * is generated from this list; adding a game never needs new page code.
 * Order is display order. The first live game is featured on the home page.
 * See docs/ADDING_A_GAME.md.
 */
export const games: Game[] = validateGames([
  // Verified against github.com/ceenguyen05/ACI-SND at 3ec4a9e ("Version 1.7.6"):
  // README, src/config/controls.ts (DEFAULT_BINDINGS), src/config/gadgets.ts.
  {
    slug: "aci-series-1",
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
    repoUrl: "https://github.com/ceenguyen05/ACI-SND",
    releaseDate: "2026-11-09", // Confirmed by Casey: first hub release is today.
    accentColor: "#ff743d",
    coverImage: {
      src: "/games/aci-series-1/cover.webp",
      alt: "First-person view of ACI HQ's brick loading yard, with a teammate running ahead at round start",
      caption: "ACI HQ / Loading yard",
      width: 1280,
      height: 720,
    },
    // TODO(casey): these three captures come from test sessions and show debug
    // health values (+999999967 and similar) in the HUD. Replace them with clean
    // captures from a normal match; same filenames, 1280×720 WebP.
    screenshots: [
      {
        src: "/games/aci-series-1/screenshot-01.webp",
        alt: "Looking down an ACI HQ office corridor after a triple kill, with the killstreak list on screen",
        caption: "ACI HQ / Office corridor",
        width: 1280,
        height: 720,
      },
      {
        src: "/games/aci-series-1/screenshot-02.webp",
        alt: "A squad lined up in ACI Building 2's atrium at round start, with the buy-menu tip on screen",
        caption: "ACI Building 2 / Atrium",
        width: 1280,
        height: 720,
      },
      {
        src: "/games/aci-series-1/screenshot-03.webp",
        alt: "Zombies mode in ACI HQ's main lobby, facing locked security doors with five zombies left in the wave",
        caption: "Zombies / Main lobby",
        width: 1280,
        height: 720,
      },
    ],
    // Confirmed by Casey: one entry for the current version, dated the hub
    // release, listing the game's features (from the ACI-SND README).
    changelog: [
      {
        version: "1.7.6",
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

  // Upcoming games. Casey asked for simple "Coming soon" cards for these three.
  // Only the names and the player count below come from Casey; everything else
  // stays empty until confirmed. The cover art is placeholder SVG made for the hub.
  {
    slug: "devil-game",
    title: "Devil Game", // TODO(casey): confirm the public or working title.
    tagline: "Next on the workbench.",
    description: {
      short: "Coming soon. Details arrive with the first playable build.",
      long: "Devil Game is in the works. Genre, controls, and screenshots land here with the first playable build.",
    },
    status: "coming-soon",
    genre: [], // TODO(casey): add the genre once it's settled.
    platforms: [],
    controls: [],
    techStack: [],
    releaseDate: null,
    accentColor: "#e5484d",
    coverImage: {
      src: "/games/devil-game/cover.svg",
      alt: "Placeholder artwork for Devil Game: a red horned circle above a dark horizon",
      caption: "Placeholder art",
      width: 1280,
      height: 720,
    },
    screenshots: [],
  },
  {
    slug: "untitled-obby",
    title: "Untitled obby", // TODO(casey): add the game's name.
    tagline: "An obstacle course for 2–6 players.",
    description: {
      short:
        "A multiplayer obby for two to six players. Coming soon. Details arrive with the first playable build.",
      long: "A 2–6 player obby is in the works. Name, controls, and screenshots land here with the first playable build.",
    },
    status: "coming-soon",
    genre: ["Obby", "Multiplayer"],
    platforms: [],
    controls: [],
    techStack: [],
    releaseDate: null,
    accentColor: "#f5b82e",
    coverImage: {
      src: "/games/untitled-obby/cover.svg",
      alt: "Placeholder artwork for an untitled obby: amber platforms climbing to the right, with six player markers",
      caption: "Placeholder art",
      width: 1280,
      height: 720,
    },
    screenshots: [],
  },
  {
    slug: "moon-sweeper",
    title: "Moon Sweeper",
    tagline: "In the works.",
    description: {
      short: "Coming soon. Details arrive with the first playable build.",
      // TODO(casey): Moon Sweeper was described as a remake of a Roblox game.
      // Add a one-line pitch you're happy to make public.
      long: "Moon Sweeper is in the works. Genre, controls, and screenshots land here with the first playable build.",
    },
    status: "coming-soon",
    genre: [],
    platforms: [],
    controls: [],
    techStack: [],
    releaseDate: null,
    accentColor: "#8fb3ff",
    coverImage: {
      src: "/games/moon-sweeper/cover.svg",
      alt: "Placeholder artwork for Moon Sweeper: a pale cratered moon rising over a dark lunar horizon",
      caption: "Placeholder art",
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
