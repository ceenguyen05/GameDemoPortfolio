import type { Game } from "../types/game";
import { validateGames } from "../lib/validateGames";

// Verified against local ACI-SND README, package.json, src/config/controls.ts,
// and src/ui/screens/ModeSelect.ts at commit 3ec4a9e (2026-11-05).
export const games: Game[] = validateGames([
  {
    slug: "aci-series-1",
    title: "ACI: Series 1",
    tagline: "Hold the site. Or survive the night.",
    description: {
      short:
        "A tactical first-person shooter. Two hand-built maps. Search & Destroy and Zombies. All in your browser.",
      long: "Plant the bomb, hold the site, or survive the horde. Fight through the offices and factory floor of ACI HQ, or the engineering spaces of ACI Building 2. Search & Destroy pairs a round economy with learnable recoil and tactical utility. Zombies turns ACI HQ into a survival run with perks, weapon upgrades, revives, and an exfil to work toward. Play against bots or join an online room.",
    },
    status: "live",
    genre: ["Tactical FPS", "Search & Destroy", "Zombies"],
    platforms: ["Desktop browser", "Keyboard + mouse"],
    controls: [
      { keys: ["W", "A", "S", "D"], action: "Move" },
      { keys: ["LMB", "RMB"], action: "Fire / Aim" },
      { keys: ["Space"], action: "Jump / Mantle" },
      { keys: ["R"], action: "Reload" },
      { keys: ["C"], action: "Crouch · hold to go prone" },
      { keys: ["Q", "E"], action: "Lean left / right" },
      { keys: ["L Alt"], action: "Slide while running forward" },
      { keys: ["L Shift"], action: "Walk quietly" },
      { keys: ["F"], action: "Use / Defuse / Buy in Zombies" },
      { keys: ["B"], action: "Buy menu" },
      { keys: ["1", "2", "3"], action: "Weapons / Knife" },
      { keys: ["4", "5", "6"], action: "Grenades / Bomb / Gadgets" },
      { keys: ["Tab"], action: "Hold for scoreboard" },
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
    releaseDate: "2026-11-09", // Release date confirmed by Casey.
    accentColor: "#ff743d",
    coverImage: {
      src: "/games/aci-series-1/cover.webp",
      alt: "First-person view of ACI HQ's brick loading yard with an armed teammate ahead",
      caption: "ACI HQ / Loading yard",
      width: 1280,
      height: 720,
    },
    screenshots: [
      {
        src: "/games/aci-series-1/screenshot-01.webp",
        alt: "First-person combat inside ACI HQ",
        caption: "ACI HQ / Contact",
        width: 1280,
        height: 720,
      },
      {
        src: "/games/aci-series-1/screenshot-02.webp",
        alt: "The engineering atrium in ACI Building 2, captured during a development session",
        caption: "ACI Building 2 / Development capture",
        width: 1280,
        height: 720,
      },
      {
        src: "/games/aci-series-1/screenshot-03.webp",
        alt: "The first wave of Zombies mode in ACI HQ",
        caption: "ACI HQ / Outbreak",
        width: 1280,
        height: 720,
      },
    ],
    changelog: [{"version":"1.7.6","date":"2026-11-09","notes":["Search & Destroy: competitive bomb defusal, buy phases, round economy, halftime side swaps, and offline bot matches from 1v1 to 5v5.","Two hand-built maps: ACI HQ's offices and factory floor, and ACI Building 2's engineering offices. Map selection and randomized round spawns.","Zombies: ACI HQ: Outbreak. Solo or co-op squads of up to five, with friends or bots, wave survival, Endless mode, revives, and a helicopter exfil.","22 original guns plus a knife across eight classes. Learnable spray patterns, hit groups, range falloff, and penetration through wood, glass, and thin metal.","Gunsmith with up to five attachments per gun, including optics, muzzles, grips, lasers, magazines, and ammunition types.","Source-style movement: counter-strafing, air-strafing, crouch-jumps, slides, prone, mantling, and leaning.","Frags, flashbangs, smokes, Molotovs, and Recon Pulse. Drones, sticky cameras, trip mines, barbed wire, shields, EMP, and building CCTV.","Fortify and breach doorways with barricades, a crowbar, and C4. UAV, Counter-UAV, Hunter Drone, and a steerable Cruise Missile killstreak.","Zombies progression: ten enemy types, 14 wall weapons, Mystery Box, Disruptor wonder weapon, Prototype Forge upgrades, eight perks, seven power-ups, and the Armory.","Team-aware bots that buy, use utility, plant, defuse, rotate, and retake, with four difficulty levels in both modes.","Online casual and ranked Search & Destroy, private rooms with five-digit invite codes, bot-filled slots, placements, Iron-to-Champion ranks, career XP, levels, and daily-play rewards.","Operator and weapon-finish customization, live 3D previews, pings, final killcam, clutch and ACE callouts, and an optional animated character paper doll.","Procedural models, animation, and audio; baked global illumination; Low, Medium, and High graphics presets; rebindable controls and configurable aim assist."]}],
  },
  ...["02", "03"].map((slot): Game => ({
    slug: `coming-soon-${slot}`,
    title: "Coming soon",
    tagline: "More games, when they are ready.",
    description: {
      short: "A space for what comes next.",
      long: "Another place in the collection, reserved for a future game. Check back for details.",
    },
    status: "coming-soon",
    genre: [],
    platforms: [],
    controls: [],
    techStack: [],
    releaseDate: null,
    accentColor: "#ff743d",
    coverImage: {
      src: `/games/coming-soon-${slot}/cover.svg`,
      alt: `Abstract artwork for upcoming game ${slot}`,
      caption: "Coming soon",
      width: 1280,
      height: 720,
    },
    screenshots: [],
  })),
]);
export function getGame(slug: string) {
  return games.find((game) => game.slug === slug);
}
