import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { getAdminSession } from "../../lib/adminAuth";
import AdminAdActions from "../../components/AdminAdActions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Ads | My Classifieds Admin"
};

function formatPrice(price) {
  if (!price) return "Price on request";

  const amount = Number(price);

  if (Number.isNaN(amount)) return "Price on request";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function statusBadge(status) {
  const classes = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACTIVE: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    SOLD: "bg-slate-200 text-slate-800",
    EXPIRED: "bg-slate-100 text-slate-700"
  };

  return classes[status] || "bg-slate-100 text-slate-700";
}

export default async function AdminAdsPage({ searchParams }) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin");
  }

  const params = await searchParams;
  const status = params?.status || "PENDING";

  const where =
    status === "ALL"
      ? {}
      : {
          status
        };

  const ads = await prisma.ad.findMany({
    where,
    include: {
      category: true,
      city: true,
      user: true
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  const counts = await prisma.ad.groupBy({
    by: ["status"],
    _count: {
      status: true
    }
  });

  const countMap = counts.reduce((acc, item) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {});

  return (
    <main className="bg-slate-50 px-4 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
              Admin Panel
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
              Manage Classified Ads
            </h1>
          </div>

          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="rounded-xl border px-5 py-3 font-bold text-slate-700 hover:bg-white"
            >
              Logout
            </button>
          </form>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {["PENDING", "ACTIVE", "REJECTED", "SOLD", "ALL"].map((item) => (
            <Link
              key={item}
              href={`/admin/ads?status=${item}`}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                status === item
                  ? "bg-blue-700 text-white"
                  : "border bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item} {item !== "ALL" ? `(${countMap[item] || 0})` : ""}
            </Link>
          ))}
        </div>

        <div className="mt-8 space-y-5">
          {ads.length === 0 ? (
            <div className="rounded-3xl border bg-white p-10 text-center text-slate-600">
              No ads found for this status.
            </div>
          ) : (
            ads.map((ad) => (
              <article
                key={ad.id}
                className="rounded-3xl border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge(
                          ad.status
                        )}`}
                      >
                        {ad.status}
                      </span>

                      {ad.isFeatured && (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                          Featured
                        </span>
                      )}

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {ad.category?.nameEn}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {ad.city?.name}
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-bold text-slate-900">
                      {ad.title}
                    </h2>

                    <p className="mt-2 text-xl font-extrabold text-blue-700">
                      {formatPrice(ad.price)}
                    </p>

                    <p className="mt-3 max-w-4xl whitespace-pre-line text-slate-700">
                      {ad.description}
                    </p>

                    <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                      <p>
                        <span className="font-bold text-slate-900">
                          Seller:
                        </span>{" "}
                        {ad.user?.name || "Not provided"}
                      </p>
                      <p>
                        <span className="font-bold text-slate-900">
                          Mobile:
                        </span>{" "}
                        {ad.mobile}
                      </p>
                      <p>
                        <span className="font-bold text-slate-900">
                          WhatsApp:
                        </span>{" "}
                        {ad.whatsapp || ad.mobile}
                      </p>
                      <p>
                        <span className="font-bold text-slate-900">
                          Address:
                        </span>{" "}
                        {ad.address || "Not provided"}
                      </p>
                    </div>

                    <AdminAdActions
                      adId={ad.id}
                      currentStatus={ad.status}
                    />
                  </div>

                  {ad.status === "ACTIVE" && (
                    <Link
                      href={`/ads/${ad.slug}`}
                      target="_blank"
                      className="rounded-xl border px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      View Public Ad
                    </Link>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
