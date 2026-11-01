# Portfolio Pro - Live Real-Money Trading Go-Live Switch Checklist

This operational runbook defines the exact protocol to flip the switch from **Stage 1 (Showcase Preview)** to **Stage 2 (Live Real-Money Trading)** when your distributor credentials arrive.

---

## Pre-Flight Status Matrix

| Component | Stage 1 (Current Showcase) | Stage 2 (Live Target) | Responsible Party |
| :--- | :--- | :--- | :--- |
| **`LIVE_TRADING_ENABLED`** | `false` (Orders disabled / preview lead form) | `true` (Direct execution active) | Production Engineer |
| **Broker Rails** | Sandbox simulated responses | Live BSE StarMF / NSE NMF API | BSE / NSE + You |
| **Payment Gateway** | Sandbox simulation | Live Razorpay / BillDesk | Razorpay + You |
| **Database** | SQLite (`dev.db`) | Managed PostgreSQL (Supabase) | Production Engineer |
| **AMFI ARN & EUIN** | Pending Activation / Configurable | Live AMFI Registered License | You |
| **Legal Pages** | Counsel Review Draft Template | Lawyer-Approved Final Text | Your Legal Counsel |

---

## Step-by-Step Go-Live Switch Protocol

### Step 1: Plug In Your Regulatory License Credentials
In your production environment variables (Vercel / Cloud dashboard):
```env
NEXT_PUBLIC_AMFI_ARN="ARN-[YOUR_ACTUAL_NUMBER]"
NEXT_PUBLIC_AMFI_EUIN="E[YOUR_ACTUAL_EUIN]"
```
*Effect: Automatically updates the header utility bar, regulatory footer, invoice generator, and transaction confirmation slips across all 53 routes without code rewrites.*

---

### Step 2: Plug In Exchange Gateway Credentials (BSE StarMF or NSE NMF II)

#### Option A: If Using BSE StarMF
1. Complete MFD registration at [bsestarmf.in](https://www.bsestarmf.in).
2. Obtain your **Member Code**, **API User ID**, and **API Password**.
3. Set environment variables:
   ```env
   BSE_NSE_MODE="production"
   BSE_STAR_MEMBER_CODE="[YOUR_MEMBER_CODE]"
   BSE_STAR_USER_ID="[YOUR_API_USER_ID]"
   BSE_STAR_PASSWORD="[YOUR_API_PASSWORD]"
   BSE_STAR_API_URL="https://bsestarmf.bseindia.com/StarMFWebService/StarMFWebService.svc"
   ```

#### Option B: If Using NSE NMF II
1. Complete onboarding with NSE India.
2. Obtain your **Broker Code** and **Production App Key**.
3. Set environment variables:
   ```env
   BSE_NSE_MODE="production"
   NSE_NMF_BROKER_CODE="[YOUR_BROKER_CODE]"
   NSE_NMF_APP_KEY="[YOUR_PRODUCTION_KEY]"
   NSE_NMF_API_URL="https://api.nsenmf.com/v2"
   ```

---

### Step 3: Plug In Payment Gateway (Razorpay or BillDesk)
1. Complete Business KYC and bank account verification on Razorpay Dashboard.
2. Generate Live API Keys (**Key ID** and **Key Secret**).
3. Set up Webhook URL: `https://portfoliopro.in/api/webhooks/razorpay` with event `payment.captured`.
4. Set environment variables:
   ```env
   PAYMENT_GATEWAY_MODE="production"
   RAZORPAY_KEY_ID="rzp_live_[YOUR_KEY]"
   RAZORPAY_KEY_SECRET="[YOUR_SECRET]"
   RAZORPAY_WEBHOOK_SECRET="[YOUR_WEBHOOK_SECRET]"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_[YOUR_KEY]"
   ```

---

### Step 4: Database PostgreSQL Activation
1. Confirm managed PostgreSQL is active on Supabase:
   ```env
   DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   ```
2. Run database migration and seed:
   ```bash
   node scripts/switch-db.js postgresql
   npx prisma db push
   node scripts/seed.js
   ```

---

### Step 5: THE GO-LIVE FLIP
In your Vercel Project Dashboard → **Settings → Environment Variables**:
Change:
```env
NEXT_PUBLIC_LIVE_TRADING_ENABLED="true"
```
Click **Redeploy**.

---

## Step 6: The Mandatory ₹100 / ₹500 End-to-End Verification Test

Immediately after deployment, execute a live test transaction:
1. **Login** to the investor portal with a real PAN and test bank account.
2. Navigate to **Fund Explorer** → Select **Nippon India Liquid Fund** or **HDFC Liquid Fund**.
3. Click **Start Systematic SIP** (₹500) or **Lumpsum** (₹1,000 minimum).
4. Verify:
   - [ ] Payment gateway opens in live mode (UPI / NetBanking debit).
   - [ ] Amount debits correctly and webhook logs `payment.captured` in database `AuditLog`.
   - [ ] Order status changes from `PENDING` to `ACCEPTED` with a valid BSE/NSE Order ID.
   - [ ] Folio creation is confirmed via AMC SMS/email within 1 business day (T+1).
   - [ ] Check `AuditLog` table for correct IP, timestamp, and user hash.

---

## Emergency Kill-Switch

If any anomaly occurs during live trading (e.g. exchange timeout or payment webhook desync):
1. Immediately set `NEXT_PUBLIC_LIVE_TRADING_ENABLED="false"` in Vercel.
2. Click **Redeploy**.
3. Within 60 seconds, all direct purchase buttons revert to the safe Showcase Lead-Capture mode, protecting client capital while you investigate.
