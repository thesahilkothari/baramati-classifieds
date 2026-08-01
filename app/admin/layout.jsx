import { getAdminSession } from "../lib/adminAuth";
import AdminNav from "../components/AdminNav";
import AdminIdleLogout from "../components/AdminIdleLogout";

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();

  return (
    <>
      {session && <AdminNav />}
      {session && <AdminIdleLogout />}
      {children}
    </>
  );
}
