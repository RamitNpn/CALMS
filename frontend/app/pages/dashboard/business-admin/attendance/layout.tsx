"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["business", "staff"]}
      allowedPermissions={["attendance_management:view"]}
    >
      {children}
    </ProtectedRoute>
  );
}
