"use client";

import { rbacApi } from "@/libs/api/rbac.api";
import { useQuery } from "@tanstack/react-query";

export function useRbacPermissions() {
  return useQuery({
    queryKey: ["rbac", "permissions"],
    queryFn: rbacApi.getAllRbacPermissions,
  });
}

