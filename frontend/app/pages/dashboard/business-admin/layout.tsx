"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";

type AuthData = {
  role: string[];
};

export default function BusinessAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authData] = useState<AuthData>(() => {
    if (typeof window === "undefined") {
      return {
        role: [],
      };
    }

    const storedData = JSON.parse(
      localStorage.getItem("auth-data") || "{}"
    );

    return {
      role: storedData?.role || [],
    };
  });

  return (
    <ProtectedRoute allowedRoles={["business"]}>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar
          userRole={authData.role}
        />

        <div className="flex-1 flex flex-col ">
          <Header />

          <main className="p-6 h-[89vh] overflow-y-scroll">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}