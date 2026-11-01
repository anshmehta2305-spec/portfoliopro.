# Portfolio Pro - Vercel Showcase Deployment & Operations Guide

This guide provides step-by-step instructions to deploy the Portfolio Pro Showcase website to **Vercel** with zero downtime, automated SSL, custom domain mapping, and instant rollback capabilities.

---

## 1. Quick Deploy via Vercel Dashboard

### Step A: Push Code to GitHub / GitLab
```bash
git add .
git commit -m "feat: Stage 1 Showcase launch configuration"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio-pro.git
git push -u origin main
```

### Step B: Import into Vercel
1. Log in to [vercel.com](https://vercel.com) and click **"Add New..." → "Project"**.
2. Select your `portfolio-pro` repository and click **Import**.
3. Framework Preset: **Next.js** (automatically detected).
4. Root Directory: `./` (leave default).
5. Build Command: `npx prisma generate && next build` (defined in `vercel.json`).

### Step C: Configure Production Environment Variables
In the **Environment Variables** section on Vercel, paste the following values:

| Variable Name | Recommended Showcase Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_LIVE_TRADING_ENABLED` | `false` | Keeps live broker orders disabled |
| `NEXT_PUBLIC_AMFI_ARN` | `""` (or your valid ARN) | Displays ARN or 'Pending Activation' |
| `NEXT_PUBLIC_AMFI_EUIN` | `""` (or your valid EUIN) | Optional EUIN license number |
| `DEMO_ACCESS_PASSWORD` | `demomode2026` | Passcode for `/demo` presentation portal |
| `DATABASE_URL` | `postgresql://...` | Connection pooling URL from Supabase |
| `DIRECT_URL` | `postgresql://...` | Direct connection URL from Supabase |
| `NEXTAUTH_SECRET` | *(Generate via `openssl rand -base64 32`)* | Strong 256-bit encryption secret |
| `NEXTAUTH_URL` | `https://yourdomain.com` | Production canonical URL |

Click **Deploy**. Vercel compiles the 53 routes and assigns an active `*.vercel.app` live showcase URL within 2 minutes.

---

## 2. Custom Domain & Automated SSL Setup

1. In your Vercel Project Dashboard, navigate to **Settings → Domains**.
2. Enter your custom domain (e.g. `portfoliopro.in` or `wealth.yourfirm.com`).
3. Add the DNS records shown by Vercel into your Domain Registrar (GoDaddy / Cloudflare / Namecheap):
   - **Apex domain (`portfoliopro.in`)**:
     - Type: `A`
     - Name: `@`
     - Value: `76.76.21.21`
   - **Subdomain / WWW (`www.portfoliopro.in`)**:
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com`
4. Vercel automatically provisions a free **Let's Encrypt SSL/TLS Certificate** and enforces HTTPS redirects globally across 100+ edge locations.

---

## 3. Staging Environment & CI/CD Pipeline

* **Production Branch**: `main` (auto-deploys to `portfoliopro.in`).
* **Staging / Preview**: Any git branch (e.g. `git checkout -b staging; git push origin staging`) generates an isolated preview deployment (e.g. `portfolio-pro-git-staging-yourfirm.vercel.app`) with its own environment variables.
* Team members can preview design changes, content revisions, and new calculators before merging into `main`.

---

## 4. Disaster Recovery & Instant Rollback Plan

If an unintended bug or configuration error is deployed to production:
1. Open Vercel Project Dashboard → **Deployments**.
2. Locate the last known good deployment.
3. Click the **three dots (...)** menu next to that deployment and select **Instant Rollback**.
4. Traffic is redirected to the healthy build in under **5 seconds** without recompilation.

