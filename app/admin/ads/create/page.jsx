import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { getAdminSession } from "../../../lib/adminAuth";
import { getAllowedTier2Cities } from "../../../lib/locations";
import AdminCreateAdForm from "../../../components/AdminCreateAdForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create Ad | My Classifieds Admin"
};

export default async function AdminCreateAdPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin");
  }

  const [categories, cities] = await Promise.all([
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
    getAllowedTier2Cities(prisma)
  ]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-blue-700">Admin Ad Creation</p>
              <h1 className="mt-2 text-3xl font-black uppercase text-slate-950 md:text-5xl">
                Create and Publish an Ad
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Create an advertisement directly from the admin dashboard and decide its status, plan, featured placement and expiry period.
              </p>
            </div>

            <Link href="/admin/ads?status=ALL" className="rounded-xl border px-5 py-3 text-sm font-black uppercase text-slate-700 hover:bg-slate-50">
              Back to Ads
            </Link>
          </div>
        </div>

        <AdminCreateAdForm categories={categories} cities={cities} />
      </section>
    </main>
  );
}
