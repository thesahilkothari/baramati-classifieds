"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = ["NEW", "UNDER_REVIEW", "INFO_REQUESTED", "ACTION_TAKEN", "REJECTED", "RESOLVED", "CLOSED"];
const priorities = ["NORMAL", "HIGH", "URGENT"];

export default function AdminGrievanceActions({ ticket }) {
  const router = useRouter();
  const [status, setStatus] = useState(ticket.status || "NEW");
  const [priority, setPriority] = useState(ticket.priority || "NORMAL");
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo || "");
  const [resolutionNotes, setResolutionNotes] = useState(ticket.resolutionNotes || "");
  const [actionNote, setActionNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function updateTicket() {
    setError(""); setMessage(""); setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/grievances/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, priority, assignedTo, resolutionNotes, actionNote })
      });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "Unable to update grievance ticket."); return; }
      setMessage("Ticket updated."); setActionNote(""); router.refresh();
    } catch (updateError) {
      console.error("Update grievance failed:", updateError);
      setError("Something went wrong. Please try again.");
    } finally { setIsUpdating(false); }
  }

  return (
    <div className="rounded-2xl border bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div><label className="text-xs font-black uppercase text-slate-600">Status</label><select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm">{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
        <div><label className="text-xs font-black uppercase text-slate-600">Priority</label><select value={priority} onChange={(event) => setPriority(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm">{priorities.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
      </div>
      <div className="mt-3"><label className="text-xs font-black uppercase text-slate-600">Assigned To</label><input value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" placeholder="Example: Shekhar V. K." /></div>
      <div className="mt-3"><label className="text-xs font-black uppercase text-slate-600">Resolution Notes</label><textarea value={resolutionNotes} onChange={(event) => setResolutionNotes(event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border px-3 py-2 text-sm" placeholder="Internal resolution/action summary" /></div>
      <div className="mt-3"><label className="text-xs font-black uppercase text-slate-600">Action Log Note</label><textarea value={actionNote} onChange={(event) => setActionNote(event.target.value)} className="mt-1 min-h-20 w-full rounded-xl border px-3 py-2 text-sm" placeholder="What action was taken now?" /></div>
      {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
      {message && <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm font-bold text-green-700">{message}</p>}
      <button type="button" onClick={updateTicket} disabled={isUpdating} className="mt-4 w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-60">{isUpdating ? "Updating..." : "Update Ticket"}</button>
    </div>
  );
}
