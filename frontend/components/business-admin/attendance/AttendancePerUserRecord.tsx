"use client";

import moment from "moment";

import TablePagination from "@/components/shared/Pagination";
import { TUser } from "@/libs/types/user.types";

type Props = {
  isLoading: boolean;
  error: string | null;
  details: TUser[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function AttendancePerUserRecord({
  details,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}: Props) {
  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div>
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
