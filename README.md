# Portfolio Pro — White-Label Wealth Management & Mutual Fund Software

**Portfolio Pro** is a complete, production-quality SaaS platform designed specifically for **Mutual Fund Distributors (MFDs)**, **Independent Financial Advisors (IFAs)**, and **Corporate Wealth Desks** in India.

The platform provides a traditional, bank-grade private wealth management client portal and mobile app, complete with automated transaction execution (BSE StarMF & NSE NMF II), CAS mailback reconciliation, robo-advisory rebalancing, trail commission accounting, and comprehensive CRM.

---

## 🏛️ Brand & UI Identity

- **Brand Name**: Portfolio Pro
- **Tagline**: *"Invest Smarter. Grow Together."*
- **Aesthetic**: Classic private bank / institutional wealth advisory feel. Symmetrical, balanced, with antique gold dividers and border accents.
- **Palette Tokens**:
  - **Primary Navy** (`#0B1F3A`): Dominant in headers, footer, hero, headings, and role login portals.
  - **Logo Blue** (`#1F5FD6`): Primary buttons on light surfaces, active indicators, and key financial metrics.
  - **Logo Teal** (`#1BB5D0`): Accent touches in the monogram emblem and chart highlights.
  - **Antique Gold** (`#B08D57`): Ornamental rules, borders, badges, and luxury hover accents.
  - **Ivory Background** (`#FAF7F0`): Warm, classic private bank surface (light theme only; no dark mode).
  - **White Cards** (`#FFFFFF`): Elevated modules with subtle 2–4px border radius.
  - **Charcoal Typography** (`#222222`): High-contrast readability.
- **Typography**: Playfair Display (Serif Headings) + Source Sans 3 (Body).

---

## 🚀 Quick Start (Local Development)

The application is pre-configured with **SQLite** out of the box so it runs locally without requiring an active external database daemon:

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Push schema to SQLite database (dev.db)
npm run db:push

# 3. Seed realistic Indian mutual fund data (all 8 roles, funds, folios, leads)
npm run db:seed

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Login Portals & Pre-Seeded Accounts

The platform includes dedicated dashboards for all **8 organizational roles**.

> **Global Test Password for all accounts**: `password123`

| Role | Email | Description & Dashboard Route |
| :--- | :--- | :--- |
| **Investor** | `investor@portfoliopro.in` | Portfolio value, XIRR, asset allocation, folios, SIPs, goals (`/dashboard/investor`) |
| **IFA / Advisor** | `advisor@portfoliopro.in` | Supervised AUM, SIP book, leads pipeline, trail commission (`/dashboard/advisor`) |
| **Corporate ARN** | `corporate@portfoliopro.in` | Multi-branch consolidated AUM, regional allocation (`/dashboard/corporate`) |
| **Employee (Ops)** | `employee@portfoliopro.in` | CAMS/KFintech mailback reconciliation & ingestion logs (`/dashboard/employee`) |
| **Sub-Broker** | `subbroker@portfoliopro.in` | Mapped investor folios & monthly trail commission splits (`/dashboard/sub-broker`) |
| **Branch Head** | `branch@portfoliopro.in` | Local branch AUM target vs achievement, RM leaderboard (`/dashboard/branch`) |
| **Relationship Mgr** | `rm@portfoliopro.in` | Assigned HNI clients, today's review schedule & notes (`/dashboard/rm`) |
| **Super Admin** | `admin@portfoliopro.in` | Manage users, leads pipeline with CSV export, testimonial moderation (`/dashboard/admin`) |

*Passwordless mobile OTP login is also available at `/auth/otp-login` using mock OTP `123456`.*

---

## 🎨 How to Customize Brand Name, Logo, Colors & Content

All content, pricing plans, and contact details are driven from **centralized configuration files** in `src/config/`:

1. **Company Details, Phone, Email & ARN**:
   - Edit [`src/config/site.ts`](file:///c:/old%20lap%20data/new%20web/src/config/site.ts)
   - Update `companyName`, `address`, `phone`, `email`, `whatsapp`, and `arnNumber`.

2. **Custom Logo (Your Own PNG)**:
   - Place your white-text logo at: `/public/brand/logo.png` (shown on navy surfaces: Header, Footer, Login screens).
   - Place your dark-text logo at: `/public/brand/logo-dark.png` (shown on light surfaces: printouts, PDFs, emails).
   - If either file is not uploaded, the application automatically renders our pixel-perfect SVG fallback with the monogram P emblem!

3. **Pricing Tiers & Plan Features**:
   - Edit [`src/config/pricing.ts`](file:///c:/old%20lap data/new%20web/src/config/pricing.ts)
   - Update `monthlyPrice`, `yearlyPrice`, or feature strings.

4. **12 Features & Specifications**:
   - Edit [`src/config/features.ts`](file:///c:/old%20lap%20data/new%20web/src/config/features.ts)

5. **FAQs**:
   - Edit [`src/config/faq.ts`](file:///c:/old%20lap%20data/new%20web/src/config/faq.ts)

---

## ☁️ Production Deployment (Vercel + Managed PostgreSQL)

To deploy to production with high scalability:

1. **Provision a PostgreSQL Database**:
   - Create a database on Supabase, Neon, Railway, or AWS RDS.
   - Obtain your connection string:
     `postgresql://postgres:[PASSWORD]@[HOST]:5432/[DB_NAME]?schema=public`

2. **Update Prisma Schema**:
   In `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Set Environment Variables on Vercel**:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Random 32-character string (`openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your production domain (`https://yourportal.com`)

4. **Deploy**:
   ```bash
   npx prisma migrate deploy
   node scripts/seed.js
   ```

---

## 🔌 Mocked Integrations vs. Real Production Credentials

| Service / Subsystem | Current State in Project | Where to Plug Real Credentials |
| :--- | :--- | :--- |
| **BSE StarMF Gateway** | Realistic mock adapter in `src/lib/integrations/bse-nse.ts` simulating order acceptance and payment URL generation. | Set `BSE_STAR_MEMBER_CODE`, `BSE_STAR_USER_ID`, `BSE_STAR_PASSWORD`, and `BSE_STAR_API_URL` in `.env`. |
| **NSE NMF II Gateway** | Unified adapter interface with simulated order IDs and UPI intent strings. | Set `NSE_NMF_BROKER_CODE`, `NSE_NMF_APP_KEY`, and `NSE_NMF_API_URL` in `.env`. |
| **Payment Gateway (Pay Online)** | Razorpay UI checkout scaffold with simulated transaction IDs. | Configure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`. |
| **SMTP Transactional Emails** | Nodemailer with development console logging fallback. | Enter your SMTP credentials (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`) in `.env`. |
| **Mobile OTP Provider** | Mock provider accepting `123456`. | Integrate Twilio / MSG91 / Gupshup in `/api/auth/otp` using `WHATSAPP_API_TOKEN`. |
| **Digital Video KYC** | Simulated verified KRA / DigiLocker flow. | Plug in your licensed KRA provider API (CVL, NDML, CAMS). |

---

## 🧪 Testing

Run financial formula and schema validation unit tests:

```bash
npm test
```
All calculator functions (SIP, SWP, Step-Up, 12.5% LTCG, 20% STCG) and Zod schema validations are covered.

