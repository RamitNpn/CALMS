"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["business", "staff"]}
      allowedPermissions={["staff_management:view"]}
    >
      {children}
    </ProtectedRoute>
  );
}
