"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllRbacPermissions, getAllRbacRoles } from "@/libs/api/rbac.api";

export function useRbacRoles() {
  return useQuery({
    queryKey: ["rbac", "roles"],
    queryFn: getAllRbacRoles,
  });
}

export function useRbacPermissions() {
  return useQuery({
    queryKey: ["rbac", "permissions"],
    queryFn: getAllRbacPermissions,
  });
}
