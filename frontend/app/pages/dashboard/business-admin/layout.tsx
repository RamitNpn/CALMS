"use client";

import { useState, useEffect } from "react";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function BusinessAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowedServices, setAllowedServices] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This only runs on the client side
    const storedData = JSON.parse(
      localStorage.getItem("auth-data") || "{}"
    );
    setAllowedServices(storedData?.services || []);
    setUserRole(storedData?.role || []);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <ProtectedRoute allowedRoles={["business", "staff", "client"]}>
      <div className="flex min-h-screen bg-gray-white">
        <Sidebar allowedServices={allowedServices} userRole={userRole} />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}