"use client";

import BusinessProfilePage from "@/components/business-admin/business/BusinessProfile";
import { useState } from "react";

export default function ClientPage() {

  const [businessId] = useState<string>(() => {
    const storedData = JSON.parse(
      localStorage.getItem("auth-data") || "{}"
    );
    return storedData?.business_id;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Business Profile Records
          </h2>
          <p className="text-sm text-gray-500">
            Manage business/staff/clients profile  in the system
          </p>
        </div>
      </div>

      {/* TABLE */}
      <BusinessProfilePage businessId={businessId} />
    </div>
  );
}
