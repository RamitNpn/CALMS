"use client";

import { Trash2, Eye, Pencil, Plus, Printer } from "lucide-react";
import moment from "moment";
import { TBusiness } from "@/libs/types/business.types";
import TablePagination from "@/components/shared/Pagination";
import { EditBusinessForm } from "./EditBusinessRecord";
import { useState } from "react";
import { ViewBusinessRecord } from "./ViewBusinessRecord";
import { useDeleteBusiness } from "@/hooks/super-admin/business-records/removeBusiness";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import { BusinessForm } from "./BusinessForm";
import { useAllBusinesses } from "@/hooks/super-admin/business-records/getAllBusinesses";

interface BusinessTableProps {
  businesses: TBusiness[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  visibleColumns?: string[];

  search: string;
  setSearch: (value: string) => void;

  dateFilter: string;
  setInquiryType: (value: string) => void;
}

export default function BusinessTable({
  businesses,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
  search,
  setSearch,

  dateFilter,
  setInquiryType,
  visibleColumns = [
    "show-business-name",
    "show-operator-name",
    "show-operator-email",
    "show-created-at",
  ],
}: BusinessTableProps) {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const { mutate: deleteBusiness } = useDeleteBusiness();
  const { data: businessData } = useAllBusinesses({});
  const [itemToRemove, setItemToRemove] = useState<TBusiness | null>(null);

  const confirmRemove = () => {
    if (!itemToRemove) return;

    deleteBusiness(itemToRemove._id, {
      onSuccess: () => {
        setItemToRemove(null);
      },
    });
  };

  const downloadRecords = () => {
    if (!businessData?.data?.length) return;

    const headers = [
      "SN",
      "Business ID",
      "Business Name",
      "Operator Name",
      "Operator Email",
      "Business Type",
      "Branch Name",
      "Package",
      "Status",
      "Started From",
      "Created At",
      "Updated At",
    ];

    const rows = businessData?.data.map((business: TBusiness, index: number) => [
      index + 1,
      business._id,
      business.businessName,
      business.operatorName,
      business.operatorEmail || "",
      business.businessType || "",
      business.branch || "",
      business.package || "",
      business.status || "",
      moment(business.payment_initiation).format("YYYY-MM-DD HH:mm:ss"),
      moment(business.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      moment(business.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: (string | number)[]) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `business-records-${
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
    <div className="h-[71vh] overflow-y-scroll">
      <div className="flex items-center justify-between mr-2">
        <div className="mb-4 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, email or package..."
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
                label: "All Records",
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
        <div className="flex justify-end gap-2 mb-2">
          <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white text-[12px] px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
          >
            <Plus size={18} />
            Add Business
          </Button>
          <Button
            onClick={downloadRecords}
            className="flex items-center justify-end gap-2 bg-green-500 text-white text-[12px] px-4 py-2 hover:bg-green-600 transition cursor-pointer"
          >
            <Printer size={18} />
            Export
          </Button>
        </div>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 text-sm leading-normal">
            <th className="py-3 px-2 text-left">SN</th>
            {visibleColumns.includes("show-business-name") && (
              <th className="py-3 px-2 text-left">Business Name</th>
            )}
            {visibleColumns.includes("show-operator-name") && (
              <th className="py-3 px-2 text-left">Operator Name</th>
            )}
            {visibleColumns.includes("show-operator-email") && (
              <th className="py-3 px-2 text-left">Email</th>
            )}
            {visibleColumns.includes("show-package") && (
              <th className="py-3 px-2 text-left">Package</th>
            )}
            {visibleColumns.includes("show-payment-status") && (
              <th className="py-3 px-2 text-left">Payment Status</th>
            )}
            {visibleColumns.includes("show-status") && (
              <th className="py-3 px-2 text-left">Status</th>
            )}
            {visibleColumns.includes("show-branch") && (
              <th className="py-3 px-2 text-left">Branch</th>
            )}
            {visibleColumns.includes("show-created-at") && (
              <th className="py-3 px-2 text-left">Created At</th>
            )}
            <th className="py-3 px-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm">
          {businesses.length === 0 ? (
            <tr>
              <td
                colSpan={2 + visibleColumns.length + 1}
                className="py-6 px-6 text-center text-gray-500"
              >
                No businesses found
              </td>
            </tr>
          ) : (
            businesses.map((business, index) => (
              <tr
                key={business._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="py-3 px-2 text-left">
                  {(page - 1) * 10 + index + 1}
                </td>

                {visibleColumns.includes("show-business-name") && (
                  <td className="py-3 px-2 text-left font-medium">
                    {business.businessName}
                  </td>
                )}

                {visibleColumns.includes("show-operator-name") && (
                  <td className="py-3 px-2 text-left">
                    {business.operatorName}
                  </td>
                )}

                {visibleColumns.includes("show-operator-email") && (
                  <td className="py-3 px-2 text-left">
                    {business.operatorEmail}
                  </td>
                )}

                {visibleColumns.includes("show-package") && (
                  <td className="py-3 px-2 text-left capitalize">
                    {business.package}
                  </td>
                )}

                {visibleColumns.includes("show-payment-status") && (
                  <td className="py-3 px-2 text-left">
                    {business.payment_status ? "Paid" : "Pending"}
                  </td>
                )}

                {visibleColumns.includes("show-status") && (
                  <td className="py-3 px-2 text-left">
                    {business.status ? "Active" : "Inactive"}
                  </td>
                )}

                {visibleColumns.includes("show-branch") && (
                  <td className="py-3 px-2 text-left">
                    {business.branch?.name ?? "-"}
                  </td>
                )}

                {visibleColumns.includes("show-created-at") && (
                  <td className="py-3 px-2 text-left">
                    {moment(business.createdAt).format("lll")}
                  </td>
                )}

                <td className="py-3 px-2 text-left">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setViewId(business._id);
                      }}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Eye size={16} className="text-yellow-600" />
                    </button>

                    <button
                      onClick={() => setEditId(business._id)}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Pencil size={16} className="text-green-600" />
                    </button>

                    <button
                      onClick={() => setItemToRemove(business)}
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

      {open && <BusinessForm onClose={() => setOpen(false)} />}

      {editId && (
        <EditBusinessForm businessId={editId} onClose={() => setEditId(null)} />
      )}

      {viewId && (
        <ViewBusinessRecord
          businessId={viewId}
          onClose={() => setViewId(null)}
        />
      )}
      <ConfirmDialog
        open={itemToRemove !== null}
        title="Remove Business"
        message="Are you sure you want to remove this business?"
        onConfirm={confirmRemove}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
