"use client";

import moment from "moment";

import TablePagination from "@/components/shared/Pagination";
import { TUser } from "@/libs/types/user.types";
import Button from "@/components/ui/button";
import { Printer } from "lucide-react";
import Select from "@/components/ui/select";

type Props = {
  isLoading: boolean;
  error: string | null;
  details: TUser[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  search: string;
  setSearch: (value: string) => void;

  dateFilter: string;
  setDateFilter: (value: string) => void;
};

function AttendancePerUserRecord({
  details,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
  search,
  setSearch,

  dateFilter,
  setDateFilter,
}: Props) {
  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div>
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
              setDateFilter(e.target.value);
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
        <div>
          <Button
            // onClick={downloadRecords}
            className="flex items-center justify-end gap-2 bg-green-500 text-white text-[12px] px-4 py-2 hover:bg-green-600 transition cursor-pointer"
          >
            <Printer size={18} />
            Export
          </Button>
        </div>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 text-sm">
            <th className="py-2 px-2 text-left">SN</th>
            <th className="py-2 px-2 text-left">User Name</th>
            <th className="py-2 px-2 text-left">User Email</th>
            <th className="py-2 px-2 text-left">User Type</th>
            <th className="py-2 px-2 text-left">Status</th>
            <th className="py-2 px-2 text-left">Check In</th>
            <th className="py-2 px-2 text-left">Check Out</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm">
          {details.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-6 text-center text-gray-500">
                No Attendance records found
              </td>
            </tr>
          ) : (
            details.map((att: any, index: number) => (
              <tr
                key={att._id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-2 px-2">{(page - 1) * 10 + index + 1}</td>
                <td className="py-2 px-2">{att.userName}</td>
                <td className="py-2 px-2">{att.userEmail}</td>
                <td className="py-2 px-2 capitalize">{att.role}</td>
                <td className="py-2 px-2">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                    {att.status}
                  </span>
                </td>
                <td className="py-2 px-2">
                  {att.checkIn ? moment(att.checkIn).format("lll") : "-"}
                </td>
                <td className="py-2 px-2">
                  {att.checkOut ? moment(att.checkOut).format("lll") : "-"}
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
    </div>
  );
}

export default AttendancePerUserRecord;
