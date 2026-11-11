# ACI screenshot refresh

Captured November 10, 2026 from https://aci-series1.vercel.app/, showing version 1.7.6. All six are real 1920 x 1080 browser captures using High graphics.

| Asset              | Scene                                     | Health          |
| ------------------ | ----------------------------------------- | --------------- |
| screenshot-01.webp | ACI HQ loading yard                       | 100 / 100       |
| screenshot-02.webp | ACI HQ assembly line                      | 100 / 100       |
| screenshot-03.webp | ACI Building 2 main entrance              | 100 / 100       |
| screenshot-04.webp | ACI Building 2 prototype lab              | 100 / 100       |
| cover.webp         | Animated title screen over ACI HQ factory | No gameplay HUD |
| screenshot-05.webp | Zombies first wave in the main lobby      | 100 / 100       |

[Contact sheet](aci-captures.png). Files live in public/games/aci-series-1/.

Capture method: isolated Chromium sessions against the production game, with the game's existing pointer-lock test helper to avoid trapping the Windows cursor. Ordinary graphics/tip settings were set in an isolated profile. The title screen was captured during its unmodified camera fly-through. Offline matches were paused internally after the round began; the game's existing camera-position helper framed the four map shots. Zombies spawned naturally in a solo first wave; only the view direction was adjusted before capture. No health, damage, ammo, inventory, enemies, HUD text, or game source files were changed. The five gameplay captures were checked against both the rendered HUD and player health/maxHealth (100/100).

WebP encoding at quality 82 preserves full resolution. There was no retouching or HUD replacement. Original PNGs, capture scripts, and machine-readable session evidence remain locally in .cache/aci-captures/ (ignored by Git). The cover is reused as the fifth gallery entry, and the hero filters duplicate source URLs so it offers six distinct previews.
