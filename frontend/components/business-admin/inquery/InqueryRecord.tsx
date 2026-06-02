"use client";

import { Trash2, Eye, PlusIcon } from "lucide-react";
import moment from "moment";
import { useState } from "react";

import TablePagination from "@/components/shared/Pagination";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import { TDrivingInquiry } from "@/libs/types/inquery.types";
import { useDeleteInquiry } from "@/hooks/business-admin/inquery/removeInquiry";
import { ViewInquiryRecord } from "./ViewInquery";
import { useMutation } from "@tanstack/react-query";
import { clientApi } from "@/libs/api/client.api";

interface InquiryRecordProps {
  inquiries: TDrivingInquiry[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function InquiryRecord({
  inquiries,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}: InquiryRecordProps) {
  const [viewId, setViewId] = useState<string | null>(null);

  const [itemToRemove, setItemToRemove] = useState<TDrivingInquiry | null>(
    null,
  );

  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");
  const businessId = storedData?.business_id || "";

  const toast = useToast.getState();
  const { mutate: deleteInquiry } = useDeleteInquiry();

  const { mutate: createClient, isPending: creatingClient } = useMutation({
    mutationFn: clientApi.createClient,
    onSuccess: () => {
      toast.show({
        message: "Client added successfully",
        type: "success",
      });
    },

    onError: (err: any) => {
      toast.show({
        message: err?.response?.data?.error || "Failed to create client",
        type: "error",
      });
    },
  });

  const confirmRemove = () => {
    if (!itemToRemove) return;
    deleteInquiry(itemToRemove._id, {
      onSuccess: () => {
        toast.show({
          message: "Inquiry deleted successfully",
          type: "success",
        });

        setItemToRemove(null);
      },
    });
  };

  const handleCreateClient = (inquiry: TDrivingInquiry) => {
    if (!inquiry.email) {
      toast.show({
        message: "Inquiry email required to create client",
        type: "error",
      });

      return;
    }

    const formData = new FormData();
    formData.append("business_id", businessId);
    formData.append("userName", inquiry.fullName);
    formData.append("userEmail", inquiry.email);
    formData.append("userPhone", inquiry.phone);
    formData.append("role", "client");
    if (inquiry.gender) {
      formData.append("gender", inquiry.gender);
    }

    createClient(formData as any);
  };

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="w-full h-[71vh] overflow-y-scroll mt-4">
      <table className="w-full table-auto">
        <thead className="text-[13px]">
          <tr className="bg-gray-200 text-gray-800 text-sm leading-normal">
            <th className="py-2 px-2 text-left">SN</th>
            <th className="py-2 px-2 text-left">Client Name</th>
            <th className="py-2 px-2 text-left">Email</th>
            <th className="py-2 px-2 text-left">Phone</th>
            <th className="py-2 px-2 text-left">License</th>
            <th className="py-2 px-2 text-left">Inquiry Type</th>
            <th className="py-2 px-2 text-left">Created At</th>
            <th className="py-2 px-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-[13px]">
          {inquiries.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-6 px-6 text-center text-gray-500">
                No inquiries found
              </td>
            </tr>
          ) : (
            inquiries.map((inquiry, index) => (
              <tr
                key={inquiry._id}
                className="border-b border-gray-200 hover:bg-white transition rounded hover:translate-x-1"
              >
                <td className="py-2 px-2 text-left">
                  {(page - 1) * 10 + index + 1}
                </td>
                <td className="py-2 px-2 text-left font-medium">
                  {inquiry.fullName}
                </td>
                <td className="py-2 px-2 text-left">{inquiry.email || "-"}</td>
                <td className="py-2 px-2 text-left">{inquiry.phone}</td>
                <td className="py-2 px-2 text-left capitalize">
                  {inquiry.licenseType}
                </td>
                <td className="py-2 px-2 text-left capitalize">
                  {inquiry.inquiryType.replaceAll("_", " ")}
                </td>
                <td className="py-2 px-2 text-left">
                  {moment(inquiry.createdAt).format("lll")}
                </td>
                <td className="py-2 px-2 text-left">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewId(inquiry._id)}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Eye size={16} className="text-yellow-600" />
                    </button>

                    <button
                      onClick={() => handleCreateClient(inquiry)}
                      disabled={creatingClient}
                      className="p-2 border border-gray-200 rounded hover:bg-green-100 text-green-600 transition cursor-pointer disabled:opacity-50"
                    >
                      <PlusIcon size={16} />
                    </button>

                    <button
                      onClick={() => setItemToRemove(inquiry)}
                      className="p-2 border border-gray-200 rounded hover:bg-red-100 text-red-600 transition cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="mt-4">
          <TablePagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {viewId && (
        <ViewInquiryRecord
          inquiryId={viewId}
          open={!!viewId}
          onClose={() => setViewId(null)}
        />
      )}

      <ConfirmDialog
        open={itemToRemove !== null}
        title="Remove Inquiry"
        message="Are you sure you want to remove this inquiry?"
        onConfirm={confirmRemove}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
