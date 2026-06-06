"use client";

import { Trash2, Eye, PlusIcon, Printer } from "lucide-react";
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
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";

interface InquiryRecordProps {
  inquiries: TDrivingInquiry[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  search: string;
  setSearch: (value: string) => void;

  dateFilter: string;
  setInquiryType: (value: string) => void;
}

export default function InquiryRecord({
  inquiries,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,

  search,
  setSearch,

  dateFilter,
  setInquiryType,
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

  const downloadRecords = () => {
    if (!inquiries?.length) return;

    const headers = [
      "SN",
      "Inquiry ID",
      "Full Name",
      "Email",
      "Phone",
      "Age",
      "Gender",
      "State",
      "District",
      "Street",
      "Occupation",
      "Inquiry Type",
      "License Type",
      "Preferred Vehicle",
      "Package Type",
      "Preferred Schedule",
      "Training Shift",
      "Experience Level",
      "Referred By",
      "Emergency Contact",
      "Message",
      "Document",
      "Agree Terms",
      "Created At",
      "Updated At",
    ];

    const rows = inquiries.map((inquiry, index) => [
      index + 1,
      inquiry._id,
      inquiry.fullName,
      inquiry.email || "",
      inquiry.phone,
      inquiry.age || "",
      inquiry.gender || "",
      inquiry.state || "",
      inquiry.district || "",
      inquiry.street || "",
      inquiry.occupation || "",
      inquiry.inquiryType || "",
      inquiry.licenseType || "",
      inquiry.preferredVehicle || "",
      inquiry.packageType || "",
      inquiry.preferredSchedule || "",
      inquiry.trainingShift || "",
      inquiry.experienceLevel || "",
      inquiry.referredBy || "",
      inquiry.emergencyContact || "",
      inquiry.message || "",
      inquiry.documents || "",
      inquiry.agreeTerms ? "Yes" : "No",
      moment(inquiry.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      moment(inquiry.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `inquiry-records-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="w-full h-[71vh] overflow-y-scroll mt-4">
      <div className="flex items-center justify-between mr-2">
        <div className="mb-4 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onPageChange(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-80 outline-none text-[13px] focus:border-blue-600 bg-white shadow"
          />

          <Select
            value={dateFilter}
            onChange={(e) => {
              setInquiryType(e.target.value);
              onPageChange(1);
            }}
            options={[
              {
                label: "All Inquiry",
                value: "all",
              },
              {
                label: "Today",
                value: "current_day",
              },
              {
                label: "This Week",
                value: "current_week",
              },
              {
                label: "This Month",
                value: "current_month",
              },
              {
                label: "This Year",
                value: "current_year",
              },
            ]}
          />
        </div>
        <Button
          onClick={downloadRecords}
          className="flex items-center justify-end gap-2 bg-green-500 text-white text-[12px] px-4 py-2 hover:bg-green-600 transition cursor-pointer"
        >
          <Printer size={18} />
          Export
        </Button>
      </div>
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
