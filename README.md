# Life Command Center

Your personal life operating system — track goals, milestones, tasks, daily habits, and weekly reviews across every area of your life.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Deploy to Vercel (Free)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Vercel auto-detects Vite — click Deploy
4. Your app is live at `your-project.vercel.app`

## Deploy to Netlify (Free)

```bash
npm run build
```

Then drag the `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop).

## How It Works

- **Today tab** — Set top 3 priorities, check off 14 daily habits (with streaks), rate your day
- **Goals tab** — 8 life areas → 25 goals → ~60 milestones → ~250 tasks. Check tasks to auto-update progress
- **Review tab** — Weekly stats, area breakdown, 7-day habit heatmap, wins & blockers
- **Settings tab** — Edit areas, habits, or reset everything

All data is stored in `localStorage` — it stays in your browser across sessions.
