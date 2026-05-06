"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  useGetAllInvoices,
  useCreateInvoice,
  useUpdateInvoice,
  useDeleteInvoice,
} from "@/libs/api/invoice.api";
import { Button } from "@/components/shared/Button";
import { FormModal } from "@/components/shared/FormModal";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { Invoice, CreateInvoiceInput } from "@/libs/types/invoice.types";

export function InvoicePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const { data: invoices = [], isLoading, error } = useGetAllInvoices();
  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice(editingInvoice?._id || "");
  const deleteMutation = useDeleteInvoice();

  const handleOpenModal = (invoice?: Invoice) => {
    setEditingInvoice(invoice || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingInvoice(null);
  };

  const handleSubmit = (data: CreateInvoiceInput) => {
    if (editingInvoice) {
      updateMutation.mutate(data, {
        onSuccess: () => handleCloseModal(),
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => handleCloseModal(),
      });
    }
  };

  const handleDelete = (invoice: Invoice) => {
    if (
      confirm(
        `Are you sure you want to delete invoice for ${invoice.clientId}?`
      )
    ) {
      deleteMutation.mutate(invoice._id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage all invoices</p>
        </div>
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
          className="gap-2"
        >
          <Plus size={20} />
          Create Invoice
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg p-6 border">
        <InvoiceTable
          invoices={invoices}
          isLoading={isLoading}
          error={error?.message}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        title={editingInvoice ? "Edit Invoice" : "Create New Invoice"}
        onClose={handleCloseModal}
        size="xl"
      >
        <InvoiceForm
          initialData={editingInvoice}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      </FormModal>
    </div>
  );
}
