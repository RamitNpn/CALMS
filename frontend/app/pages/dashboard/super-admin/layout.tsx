import Header from "@/components/super-admin/Header";
import Sidebar from "@/components/super-admin/Sidebar";


export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}