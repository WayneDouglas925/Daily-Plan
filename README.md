
# The Re-Build: Identity-2026

Welcome to the premium identity management system. This application tracks your metabolic and circadian consistency.

## Identity Metrics
- **Equity**: Your current standing. Higher is better.
- **HighWaterMark**: The peak discipline you've achieved.
- **Debt**: The gap between your peak and your current state. Recover debt by remaining consistent.

## Protocols
- **OMAD**: 4-hour feeding window.
- **ADF**: 36-hour fasting window.
- **Circadian**: Respecting the light/dark cycle and the 3-hour pre-sleep kitchen closure.

## Install & Deploy
- **Develop:** `npm install && npm run dev`
- **Build:** `npm run build` (set `BASE_PATH=/Daily-Plan/` to match GitHub Pages)
- **PWA:** installable and works offline after the first load (service worker via `vite-plugin-pwa`). Data stays in the browser's `localStorage`.
- **Deploy:** `.github/workflows/deploy.yml` publishes `dist/` to GitHub Pages on every push to `main`. One-time setup: repo **Settings → Pages → Source: GitHub Actions**.
- **Install on Android:** open the Pages URL in Chrome → menu → *Install app* / *Add to Home screen*.
