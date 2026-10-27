# PropertyOS v2 (live data)

Liquid-glass property management app with real accounts and a real database (Supabase). No demo data: you sign up, create your workspace, and everything you enter is stored in your own Supabase project, isolated per workspace by row-level security.

Features: sign up / sign in / password reset, workspaces, properties and units, tenants, leases, monthly rent generation, manual payments and reversals, repair requests, inquiries, owner invitations (shareable links) for tenants and managers, tenant portal view, export, installable PWA.

## Deploy (about 10 minutes)

1. **Create a Supabase project** (supabase.com).
2. **Run the database migrations**: in the Supabase SQL editor, run each file in `supabase/migrations/` in numeric order (001 to 006; 005 turns on live updates, 006 adds the shared UPI ID and next-month rent).
3. **Auth settings** (Authentication > Providers/URL): enable Email with "Confirm email" on. Set Site URL to your deployed address and add it to Redirect URLs. Configure SMTP for reliable verification and reset emails.
4. **Edit `config.js`**: paste your Project URL and the `anon` public key (Project Settings > API). Never use the `service_role` key here.
5. **Deploy the folder** as a static site: Vercel (`vercel --prod` or import the repo), Netlify, Cloudflare Pages or GitHub Pages. HTTPS is needed for install-as-app and offline.
6. Open the site, create an account, verify your email, then create your workspace.

Local test: `python3 -m http.server 3000` in this folder, then open http://localhost:3000 (add that URL to Supabase Redirect URLs).

## Using it
- Owner/Manager: add property > unit > tenant > lease, then "Generate rent" each month and "Record" payments.
- Tenants: Settings > Invite someone, pick Tenant (a tenant record with the same email must exist), send them the link. They sign up, open it, and see only their own lease, rent and repairs.
- Amounts are stored in paise (INR) per the original schema; the app shows rupees.

## Add your logo
Put a square `assets/logo.png` (512×512) in `assets/`. It replaces the placeholder in the app, sign-in screen and home-screen icon.

## Not included yet
Online rent payments (Razorpay), invitation emails and the public listing website need a server and were part of your old Next.js project. The database already supports them (`payment_orders`, `capture_payment`, `reserve_order`, public listing views); a next step can add serverless endpoints. Until then payments are recorded manually by managers, and invite links are shared by hand.

## What is new in this version
- Search anything (magnifier button or Ctrl/Cmd+K).
- Dashboard: collection-rate ring, overdue rent with one-tap WhatsApp/email reminders, leases ending within 60 days.
- Adjust a rent charge with an audited reason; edit tenants and units (tap them); payments CSV export.
- Live sync across devices and users via Supabase Realtime.

## QR codes and receipts
- **Designer receipts:** Rent view > Receipt (also opens right after you record a payment). Three designs: Aurora, Ledger, Noir. Print or Save as PDF from the print dialog, or Share. Includes the amount in words, payment history, balance, signature line and a verification QR. Tenants can print their own receipts.
- **Verify QR:** scanning a receipt QR (signed in to the same workspace) shows whether it matches your records.
- **Unit repair labels:** Properties > QR labels prints a card per unit. Scanning it opens a repair request for that unit.
- **UPI pay QR:** Settings > UPI ID, then "QR" on any unpaid rent charge shows a scannable UPI payment code for the balance. The UPI ID is saved to the workspace (migration 006), so tenants see a Pay button too.
- **Invite QR:** invitation links also show a QR code.
- **In-app scanner:** the QR button in the header scans codes live where the browser supports it (Chrome/Android); otherwise use the phone camera.
- QR generation uses a bundled MIT-licensed library (`vendor/`), so it works offline.

## Security headers
`vercel.json` sets a Content-Security-Policy that allows Supabase on `*.supabase.co`. If you use a custom Supabase domain, add it to `connect-src`.
