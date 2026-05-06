import BusinessSidebar from "@/components/business-admin/BusinessSidebar";
import Header from "@/components/layout/Header";


export default function BusinessAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-white">
      <BusinessSidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}