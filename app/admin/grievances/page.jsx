import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getAdminSession } from "../../lib/adminAuth";
import AdminGrievanceActions from "../../components/AdminGrievanceActions";
import { REPORT_TYPES } from "../../lib/reporting";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
function getReportTypeLabel(value) { return REPORT_TYPES.find((type) => type.value === value)?.label || value; }
function getStatusClass(status) {
  if (status === "NEW") return "bg-red-600 text-white";
  if (status === "UNDER_REVIEW") return "bg-blue-700 text-white";
  if (status === "INFO_REQUESTED") return "bg-yellow-400 text-slate-950";
  if (status === "ACTION_TAKEN") return "bg-purple-700 text-white";
  if (status === "RESOLVED") return "bg-green-700 text-white";
  if (status === "CLOSED") return "bg-slate-800 text-white";
  return "bg-slate-200 text-slate-900";
}
function getPriorityClass(priority) {
  if (priority === "URGENT") return "bg-red-700 text-white";
  if (priority === "HIGH") return "bg-orange-500 text-white";
  return "bg-slate-200 text-slate-900";
}

export default async function AdminGrievancesPage({ searchParams }) {
  const session = await getAdminSession();
  if (!session) {
    return <main className="min-h-screen bg-slate-100 px-4 py-10"><section className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 text-center shadow-sm"><h1 className="text-3xl font-black text-slate-950">Admin Login Required</h1><p className="mt-3 text-slate-600">Please login to view grievance tickets.</p><Link href="/admin" className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-black uppercase text-white">Go to Admin</Link></section></main>;
  }
  const resolvedSearchParams = await searchParams;
  const statusFilter = String(resolvedSearchParams?.status || "").toUpperCase();
  const where = statusFilter ? { status: statusFilter } : {};
  const tickets = await prisma.reportTicket.findMany({
    where,
    include: {
      ad: { select: { id: true, title: true, slug: true, status: true } },
      actionLogs: { orderBy: { createdAt: "desc" }, take: 5 }
    },
    orderBy: [{ createdAt: "desc" }],
    take: 100
  });
  const counts = await prisma.reportTicket.groupBy({ by: ["status"], _count: { status: true } });
  const countMap = counts.reduce((result, item) => ({ ...result, [item.status]: item._count.status }), {});
  const statusLinks = ["ALL", "NEW", "UNDER_REVIEW", "INFO_REQUESTED", "ACTION_TAKEN", "REJECTED", "RESOLVED", "CLOSED"];
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-black uppercase tracking-wide text-red-600">Admin Grievance Desk</p><h1 className="mt-2 text-3xl font-black uppercase text-slate-950 md:text-4xl">Reports, Grievances & Takedown Requests</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Review public reports, fake listing complaints, prohibited content reports, IP complaints, privacy concerns and payment/refund grievances.</p></div><div className="flex flex-wrap gap-3"><Link href="/admin" className="rounded-xl border bg-white px-5 py-3 text-sm font-black uppercase text-slate-700 hover:bg-slate-50">Back to Admin</Link><Link href="/admin/compliance" className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-black uppercase text-white hover:bg-blue-800">Compliance Records</Link></div></div>
        <div className="mt-6 flex flex-wrap gap-2">{statusLinks.map((status) => { const href = status === "ALL" ? "/admin/grievances" : `/admin/grievances?status=${status}`; const isActive = (status === "ALL" && !statusFilter) || statusFilter === status; return <Link key={status} href={href} className={`rounded-full px-4 py-2 text-xs font-black uppercase ${isActive ? "bg-slate-950 text-white" : "border bg-white text-slate-700"}`}>{status} {status !== "ALL" ? `(${countMap[status] || 0})` : ""}</Link>; })}</div>
        <div className="mt-8 space-y-5">
          {tickets.length === 0 ? <div className="rounded-3xl border bg-white p-8 text-center shadow-sm"><h2 className="text-2xl font-black text-slate-950">No grievance tickets found</h2><p className="mt-2 text-slate-600">New reports submitted from /report will appear here.</p></div> : tickets.map((ticket) => (
            <article key={ticket.id} className="rounded-3xl border bg-white p-5 shadow-sm"><div className="grid gap-5 lg:grid-cols-[1fr_380px]"><div>
              <div className="flex flex-wrap gap-2"><span className="rounded bg-slate-950 px-3 py-1 text-xs font-black uppercase text-white">{ticket.referenceNumber}</span><span className={`rounded px-3 py-1 text-xs font-black uppercase ${getStatusClass(ticket.status)}`}>{ticket.status}</span><span className={`rounded px-3 py-1 text-xs font-black uppercase ${getPriorityClass(ticket.priority)}`}>{ticket.priority}</span></div>
              <h2 className="mt-4 text-2xl font-black text-slate-950">{ticket.reason}</h2><p className="mt-2 text-sm font-bold uppercase text-blue-700">{getReportTypeLabel(ticket.reportType)}</p><p className="mt-4 whitespace-pre-line rounded-2xl border bg-slate-50 p-4 text-sm leading-6 text-slate-700">{ticket.description}</p>
              {ticket.ad && <div className="mt-4 rounded-2xl border bg-blue-50 p-4 text-sm leading-6 text-blue-900"><p className="font-black uppercase">Linked Classified</p><Link href={`/ads/${ticket.ad.slug}`} target="_blank" className="mt-1 inline-flex font-bold underline">#{ticket.ad.id} {ticket.ad.title}</Link><p className="mt-1 text-xs font-bold uppercase">Current ad status: {ticket.ad.status}</p></div>}
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2"><div className="rounded-2xl border p-4"><p className="font-black uppercase text-slate-950">Reporter</p><p className="mt-2">{ticket.reporterName || "-"}</p><p>{ticket.reporterMobile || "-"}</p><p>{ticket.reporterEmail || "-"}</p></div><div className="rounded-2xl border p-4"><p className="font-black uppercase text-slate-950">Timeline</p><p className="mt-2">Created: {formatDate(ticket.createdAt)}</p><p>Reviewed: {formatDate(ticket.reviewedAt)}</p><p>Resolved: {formatDate(ticket.resolvedAt)}</p><p>Closed: {formatDate(ticket.closedAt)}</p></div></div>
              {(ticket.pageUrl || ticket.evidenceUrl) && <div className="mt-4 rounded-2xl border p-4 text-sm"><p className="font-black uppercase text-slate-950">Links</p>{ticket.pageUrl && <a href={ticket.pageUrl} target="_blank" rel="noreferrer" className="mt-2 block break-all font-bold text-blue-700 underline">Page URL: {ticket.pageUrl}</a>}{ticket.evidenceUrl && <a href={ticket.evidenceUrl} target="_blank" rel="noreferrer" className="mt-2 block break-all font-bold text-blue-700 underline">Evidence: {ticket.evidenceUrl}</a>}</div>}
              {ticket.actionLogs.length > 0 && <div className="mt-4 rounded-2xl border p-4 text-sm"><p className="font-black uppercase text-slate-950">Recent Action Logs</p><div className="mt-3 space-y-3">{ticket.actionLogs.map((log) => <div key={log.id} className="border-t pt-3 first:border-t-0 first:pt-0"><p className="font-bold text-slate-900">{log.action} <span className="text-xs text-slate-500">{formatDate(log.createdAt)}</span></p><p className="text-slate-600">{log.note || "-"}</p>{(log.fromStatus || log.toStatus) && <p className="text-xs font-bold uppercase text-slate-500">{log.fromStatus || "-"} → {log.toStatus || "-"}</p>}</div>)}</div></div>}
            </div><AdminGrievanceActions ticket={ticket} /></div></article>
          ))}
        </div>
      </section>
    </main>
  );
}
