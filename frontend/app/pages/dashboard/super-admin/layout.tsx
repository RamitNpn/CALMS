"use client";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/super-admin/Header";
import { useState, useEffect } from "react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowedServices, setAllowedServices] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This only runs on the client side
    const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");
    setAllowedServices(storedData?.services || []);
    setUserRole(storedData?.role || []);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-white">
      <Sidebar allowedServices={allowedServices} userRole={userRole} />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
