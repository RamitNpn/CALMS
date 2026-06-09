"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function InquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["business", "staff"]}
      allowedPermissions={["inquiries_management:view"]}
    >
      {children}
    </ProtectedRoute>
  );
}
