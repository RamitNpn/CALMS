"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button";
import ClientRecord from "@/components/business-admin/client/ClientRecord";
import { useAllClients } from "@/hooks/business-admin/client-management/getAllClientData";
import { ClientForm } from "@/components/business-admin/client/ClientForm";

export default function ClientPage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: clientData,
    isLoading,
    isError,
  } = useAllClients({ page, limit: 10 });

  const clients = clientData?.data ?? clientData ?? [];
  const pagination = clientData?.pagination;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Business Client Records</h2>
          <p className="text-sm text-gray-500">
            Manage all business clients in the system
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={18} />
          Create Business Clients
        </Button>
      </div>

      {/* TABLE */}
      <ClientRecord
        clients={clients}
        isLoading={isLoading}
        error={isError ? "Failed to load client records" : null}
        page={page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={setPage}
      />

      {/* MODAL */}
      {open && <ClientForm onClose={() => setOpen(false)} />}

    </div>
  );
}
