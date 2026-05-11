"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";

type AuthData = {
  services: string[];
  role: string[];
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authData] = useState<AuthData>(() => {
    if (typeof window === "undefined") {
      return {
        services: [],
        role: [],
      };
    }

    const storedData = JSON.parse(
      localStorage.getItem("auth-data") || "{}"
    );

    return {
      services: storedData?.services || [],
      role: storedData?.role || [],
    };
  });

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-gray-white">
        <Sidebar
          allowedServices={authData.services}
          userRole={authData.role}
        />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}