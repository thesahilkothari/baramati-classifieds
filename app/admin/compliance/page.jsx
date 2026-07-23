import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getAdminSession } from "../../lib/adminAuth";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function getDeclarationValue(declarations, key) {
  if (!declarations || typeof declarations !== "object") {
    return "-";
  }

  if (declarations[key] === true) return "Yes";
  if (declarations[key] === false) return "No";

  return declarations[key] || "-";
}

export default async function AdminCompliancePage() {
  const session = await getAdminSession();

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10">
        <section className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">
            Admin Login Required
          </h1>

          <p className="mt-3 text-slate-600">
            Please login to view compliance records.
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-black uppercase text-white"
          >
            Go to Admin
          </Link>
        </section>
      </main>
    );
  }

  const policyAcceptances = await prisma.policyAcceptance.findMany({
    include: {
      ad: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          mobile: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 100
  });

  const consentRecords = await prisma.consentRecord.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: 100
  });

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">
              Admin Compliance
            </p>

            <h1 className="mt-2 text-3xl font-black uppercase text-slate-950 md:text-4xl">
              Policy Acceptance Records
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              This page shows the latest clickwrap declarations and consent
              records captured when users submit classified advertisements.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl border bg-white px-5 py-3 text-sm font-black uppercase text-slate-700 hover:bg-slate-50"
          >
            Back to Admin
          </Link>
        </div>

        <section className="mt-8 rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <h2 className="text-2xl font-black uppercase text-slate-950">
              Latest Policy Acceptances
            </h2>

            <span className="rounded bg-slate-950 px-3 py-1 text-xs font-black uppercase text-white">
              {policyAcceptances.length} Records
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="border border-slate-300 p-3">Date</th>
                  <th className="border border-slate-300 p-3">Ad</th>
                  <th className="border border-slate-300 p-3">User</th>
                  <th className="border border-slate-300 p-3">Mobile</th>
                  <th className="border border-slate-300 p-3">Version</th>
                  <th className="border border-slate-300 p-3">Advertiser</th>
                  <th className="border border-slate-300 p-3">Adult</th>
                  <th className="border border-slate-300 p-3">Authority</th>
                  <th className="border border-slate-300 p-3">Terms</th>
                  <th className="border border-slate-300 p-3">Privacy</th>
                  <th className="border border-slate-300 p-3">IP</th>
                </tr>
              </thead>

              <tbody>
                {policyAcceptances.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="border border-slate-300 p-6 text-center text-slate-600"
                    >
                      No policy acceptance records found yet.
                    </td>
                  </tr>
                ) : (
                  policyAcceptances.map((record) => (
                    <tr key={record.id} className="odd:bg-white even:bg-slate-50">
                      <td className="border border-slate-300 p-3 align-top">
                        {formatDate(record.createdAt)}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        {record.ad ? (
                          <Link
                            href={`/ads/${record.ad.slug}`}
                            className="font-bold text-blue-700 hover:underline"
                            target="_blank"
                          >
                            #{record.ad.id} {record.ad.title}
                          </Link>
                        ) : (
                          "-"
                        )}

                        {record.ad?.status && (
                          <p className="mt-1 text-xs font-bold uppercase text-slate-500">
                            {record.ad.status}
                          </p>
                        )}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        {record.name || record.user?.name || "-"}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        {record.mobile}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        {record.policyVersion}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        {getDeclarationValue(record.declarations, "advertiserType")}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        {getDeclarationValue(record.declarations, "isAdult")}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        {getDeclarationValue(record.declarations, "hasAuthority")}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        {record.acceptedTerms ? "Yes" : "No"}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        {record.acceptedPrivacy ? "Yes" : "No"}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        {record.ipAddress || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <h2 className="text-2xl font-black uppercase text-slate-950">
              Latest Consent Records
            </h2>

            <span className="rounded bg-blue-700 px-3 py-1 text-xs font-black uppercase text-white">
              {consentRecords.length} Records
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-blue-700 text-white">
                  <th className="border border-slate-300 p-3">Date</th>
                  <th className="border border-slate-300 p-3">Ad ID</th>
                  <th className="border border-slate-300 p-3">Mobile</th>
                  <th className="border border-slate-300 p-3">Consent Type</th>
                  <th className="border border-slate-300 p-3">Value</th>
                  <th className="border border-slate-300 p-3">Version</th>
                  <th className="border border-slate-300 p-3">Source</th>
                </tr>
              </thead>

              <tbody>
                {consentRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="border border-slate-300 p-6 text-center text-slate-600"
                    >
                      No consent records found yet.
                    </td>
                  </tr>
                ) : (
                  consentRecords.map((record) => (
                    <tr key={record.id} className="odd:bg-white even:bg-slate-50">
                      <td className="border border-slate-300 p-3">
                        {formatDate(record.createdAt)}
                      </td>
                      <td className="border border-slate-300 p-3">
                        {record.adId || "-"}
                      </td>
                      <td className="border border-slate-300 p-3">
                        {record.mobile || "-"}
                      </td>
                      <td className="border border-slate-300 p-3 font-semibold">
                        {record.consentType}
                      </td>
                      <td className="border border-slate-300 p-3">
                        {record.consentValue ? "Yes" : "No"}
                      </td>
                      <td className="border border-slate-300 p-3">
                        {record.policyVersion || "-"}
                      </td>
                      <td className="border border-slate-300 p-3">
                        {record.source}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
