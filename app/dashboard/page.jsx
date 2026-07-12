import { redirect } from "next/navigation";
import { getCurrentUser } from "../lib/auth";
import { prisma } from "../lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const ads = await prisma.ad.findMany({
    where: {
      userId: user.id,
    },
    include: {
      category: true,
      city: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">My Dashboard</h1>
          <p className="mt-1 text-slate-500">{user.mobile}</p>
        </div>

        <Link
          href="/ads/post"
          className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white"
        >
          Post New Ad
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">City</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {ads.map((ad) => (
              <tr key={ad.id} className="border-t">
                <td className="p-4 font-semibold">{ad.title}</td>
                <td className="p-4">{ad.category.nameEn}</td>
                <td className="p-4">{ad.city.name}</td>
                <td className="p-4">{ad.status}</td>
              </tr>
            ))}

            {ads.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-slate-500">
                  No ads posted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
