# 🚀 HueMatch Bridal — Deployment Guide (Vercel & Render)

This guide walks you through deploying **HueMatch Bridal** to **Vercel** and **Render** with complete Single Page Application (SPA) routing, environment variable configuration, and Supabase integration.

---

## 📋 Required Environment Variables

Regardless of whether you choose Vercel or Render, you must configure these two variables:

| Variable Name | Description | Example |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xyzcompany.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase public anonymous API key | `eyJhbGciOi...` |

*(Find these in your Supabase Dashboard under **Project Settings ➔ API**)*

---

## ⚡ Option 1: Deploying to Vercel (Recommended)

Vercel provides edge hosting, automatic HTTPS, and instant preview deployments for every Git commit.

### Method A: Via Vercel Web Dashboard (Simplest)
1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Deploy HueMatch Bridal"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/huematch.git
   git push -u origin main
   ```
2. Log into [vercel.com](https://vercel.com) and click **"Add New..." ➔ "Project"**.
3. Select your GitHub repository.
4. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** If your repository has `huematch` as a subfolder, click **Edit** and choose `huematch`. If the repo root is already `huematch`, leave it as `./`.
   - **Build Command:** `npm run build` (automatic)
   - **Output Directory:** `dist` (automatic)
5. **Environment Variables:**
   - Add `VITE_SUPABASE_URL` with your Supabase URL.
   - Add `VITE_SUPABASE_ANON_KEY` with your anon key.
6. Click **Deploy**.

> ℹ️ The included [`vercel.json`](vercel.json) automatically handles SPA route rewrites (`/scan`, `/results`, `/brief`, `/artists`) to `index.html` so direct link reloads never return 404.

### Method B: Via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# From the huematch directory
cd huematch
vercel

# Deploy to production
vercel --prod
```

---

## 🌐 Option 2: Deploying to Render

Render supports both **Static Sites** (100% free) and **Web Services** (Node.js).

### Method A: Render Static Site (Recommended — 100% Free)

1. Log into [render.com](https://render.com) and click **"New +" ➔ "Static Site"**.
2. Connect your Git repository.
3. **Configure Settings:**
   - **Name:** `huematch-bridal`
   - **Root Directory:** `huematch` (or `./` if `huematch` is the root of your repo)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. **Redirects/Rewrites (Critical for React Router):**
   - Click **Redirects/Rewrites**
   - Add Rule:
     - **Type:** `Rewrite`
     - **Source:** `/*`
     - **Destination:** `/index.html`
   *(This is also pre-configured automatically if using [`render.yaml`](render.yaml))*
5. **Environment Variables:**
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`
6. Click **Create Static Site**.

### Method B: Render Blueprint (Infrastructure as Code)
Render automatically recognizes [`render.yaml`](render.yaml):
1. On Render, click **"New +" ➔ "Blueprint"**.
2. Connect your repository.
3. Render reads `render.yaml` and provisions the site with the rewrite rules, headers, and build commands pre-configured.
4. Fill in the values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Click **Apply**.

### Method C: Render Web Service (Node.js fallback)
If you prefer or require a Render Web Service container:
- **Build Command:** `npm run build`
- **Start Command:** `npm start` *(Runs [`server.js`](server.js) — zero external dependencies, binds to `$PORT`, and serves `/dist` with SPA fallbacks)*

---

## 🔒 Post-Deployment Supabase Configuration

Once your app is deployed and you have your live URL (e.g., `https://huematch.vercel.app` or `https://huematch.onrender.com`):

1. Go to your **Supabase Dashboard**.
2. Navigate to **Authentication ➔ URL Configuration**.
3. In **Site URL**, enter your production URL:
   ```
   https://huematch.vercel.app
   ```
4. In **Redirect URLs**, add:
   ```
   https://huematch.vercel.app/**
   https://huematch.onrender.com/**
   http://localhost:5173/**
   ```
5. Click **Save**.

This ensures magic link authentication and OAuth redirects function properly in production.
