# My Classifieds Phase 1C Grievance / Report / Takedown Patch

This phase adds a public report and grievance workflow.

## What this patch adds

- Public `/report` page
- `POST /api/reports`
- Admin `/admin/grievances` page
- `PATCH /api/admin/grievances/[id]`
- Report reference numbers like `MC-RPT-20260723-ABC123`
- Admin status updates and action logs
- "Report This Ad" button on ad detail page
- Footer link to report/grievance page
- Prisma models: `ReportTicket`, `ReportActionLog`

## Required commands after extracting

```bat
cd C:\baramati-classifieds
npx prisma db push
npx prisma generate
npm run build
git add .
git commit -m "Add grievance and report workflow"
git push -u origin main
```

## Test after deployment

1. Open `/report`.
2. Submit a test grievance.
3. Save the reference number.
4. Open `/admin/grievances`.
5. Update the ticket status to `UNDER_REVIEW`.
6. Open any ad page and check the "Report This Ad" button.
