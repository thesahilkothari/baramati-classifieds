import { getAdminSession } from "../lib/adminAuth";
import AdminNav from "../components/AdminNav";

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();

  return (
    <>
      {session && <AdminNav />}
      {children}
    </>
  );
}
