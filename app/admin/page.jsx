import { redirect } from "next/navigation";
import AdminLoginForm from "../components/AdminLoginForm";
import { getAdminSession } from "../lib/adminAuth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Login | My Classifieds"
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin/ads");
  }

  return (
    <main className="bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
          Admin
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
          My Classifieds Admin Login
        </h1>

        <p className="mt-3 text-sm text-slate-600">
          Login to approve, reject and manage classified ads.
        </p>

        <AdminLoginForm />
      </section>
    </main>
  );
}
