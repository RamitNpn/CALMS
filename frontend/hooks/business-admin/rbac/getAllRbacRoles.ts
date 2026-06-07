"use client";

import { rbacApi } from "@/libs/api/rbac.api";
import { useQuery } from "@tanstack/react-query";

export function useRbacRoles() {
  return useQuery({
    queryKey: ["rbac", "roles"],
    queryFn: rbacApi.getAllRbacRoles,
  });
}
