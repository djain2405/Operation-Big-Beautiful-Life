# Life Command Center

Your personal life operating system — track goals, habits, and milestones across every area of your life. Cloud synced.

## Quick Start (local dev)

```bash
npm install
npm run dev
```

## Cloud Sync Setup (5 minutes)

### Step 1: Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it anything (e.g., "life-hq"), set a password, pick a region close to you
3. Wait ~1 minute for it to spin up

### Step 2: Create the database table

1. In your Supabase dashboard → **SQL Editor**
2. Paste the contents of `supabase-setup.sql` and click **Run**

### Step 3: Get your credentials

1. In Supabase → **Settings** → **API**
2. Copy your **Project URL** (looks like `https://abc123.supabase.co`)
3. Copy your **anon public** key (the long string)

### Step 4: Add to Vercel

1. In your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
3. **Redeploy** (Settings → Deployments → redeploy latest)

That's it. Your app now syncs to the cloud. Open on any device, same data.

### Cross-device sync

Your first device auto-generates a Sync ID. Find it in **Settings → Cloud Sync**. On a second device, paste that Sync ID and tap Sync. Both devices now share the same data.

## Deploy to Vercel

```bash
git add .
git commit -m "your change"
git push   # auto-deploys
```

## How It Works

- **Today** — priorities, quick tasks, habits, day rating, plan tomorrow
- **Goals** — 8 life areas → 25 goals → milestones → tasks (auto-calculated progress)
- **Review** — weekly stats, area breakdown, habit heatmap, wins & blockers
- **Settings** — edit areas, habits, backup, cloud sync, reset

Data syncs to Supabase (cloud) and localStorage (offline fallback).
