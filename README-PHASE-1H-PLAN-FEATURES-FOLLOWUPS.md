# Phase 1H - Plan Features, Limits, Sold Status and Renewal Follow-ups

## What this patch adds

1. Payment plan inclusions below each plan on `/post-ad`.
2. Character limits by plan:
   - Free: heading 60 characters, description 450 characters.
   - Paid: heading 90 characters, description 900 characters.
   - Premium: heading 120 characters, description 1500 characters.
3. Approval timelines:
   - Free: 2-3 working days.
   - Paid/Premium: 1 working day.
4. Email field on post-ad form for renewal/sold-status follow-ups.
5. Server-side validation of plan character limits.
6. Sold status confirmation page:
   - `/sold-status`
7. Renewal/upgrade page:
   - `/renew`
8. Admin follow-up dashboard:
   - `/admin/followups`
9. Manual email and WhatsApp message links for follow-ups.

## Important

This patch does not automatically send WhatsApp or email in the background because no official email provider or WhatsApp Business API is connected yet. It creates an admin follow-up desk with ready-to-send Email and WhatsApp links.

For true automation later:
- Email: configure Resend/SendGrid/SMTP.
- WhatsApp: configure WhatsApp Business Cloud API or approved BSP.

## Commands

```bat
cd C:\baramati-classifieds
npx prisma db push
npx prisma generate
npm run build
git add .
git commit -m "Add plan features and renewal followups"
git push -u origin main
```

## Test

1. Open `/post-ad`.
2. Confirm plan inclusions are visible.
3. Confirm Free character limits are 60/450.
4. Confirm Paid character limits are 90/900.
5. Confirm Premium character limits are 120/1500.
6. Submit a free ad.
7. Submit paid/premium ad with UPI reference.
8. Open `/sold-status`.
9. Open `/renew`.
10. Open `/admin/followups`.
