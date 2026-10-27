# Changelog

## Major
- Data loading now pages past the 1,000-row API cap (older charges and payments were silently dropped on busy workspaces).
- Dates follow India time (Asia/Kolkata), matching the database. Before, "this month" was wrong shortly after midnight IST, and the app now reloads if left open past midnight.
- Rent can be generated for the current or next month (migration 006; older databases fall back to current month).
- UPI ID is shared across the workspace and tenants get a Pay button with a UPI deep link and QR (migration 006; falls back to device-only until run).
- Offline-capable service worker (runtime caching incl. the Supabase script, offline fallback page) and security headers incl. CSP.
- Get-started checklist on an empty workspace.

## Fixes
- Reverse payment was only offered on fully paid charges; it now shows for any charge with a payment, and reverses the newest one.
- Zero-deposit leases and studios (0 bedrooms) can now be entered.
- Lease end date no longer overflows for month-end starts.
- Tenant home no longer crashes without a linked tenant record and prefers the active lease.
- CSV export neutralises spreadsheet formulas; WhatsApp link uses noopener.
- Load failures show Retry instead of the sign-in screen; workspace creation has clear validation messages.

## Minor
- Esc closes dialogs; rows are keyboard-operable; visible focus outlines.
- Theme toggle (auto/light/dark) in Settings; refresh on tab focus and when back online.
- localStorage access is guarded; dead code removed; manifest and meta tags improved.
