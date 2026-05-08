"use client";

import { useEffect, useState } from "react";

import BusinessSidebar from "@/components/business-admin/BusinessSidebar";
import Header from "@/components/layout/Header";

export default function BusinessAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowedServices, setAllowedServices] = useState<string[]>([]);

  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem("auth-data") || "{}"
    );

    setAllowedServices(storedData?.services || []);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-white">
      <BusinessSidebar allowedServices={allowedServices} />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}