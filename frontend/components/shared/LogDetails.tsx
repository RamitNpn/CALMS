"use client";

import React, { useState, useMemo } from "react";
import { Activity, Trash2, Download } from "lucide-react";
import { useActivityLogs } from "@/hooks/shared/useLogs";
import { TLogEntry } from "@/libs/types/log.types";

type ActivityLogFilters = {
  module?: string;
  action?: string;
  userId?: string;
};
interface LogDetailsProps {
  module: string;
  recordId?: string;
  recordName?: string;
  userId: string;
  onClearLogs?: () => void;
}

export default function LogDetails({
  module,
  recordId,
  recordName,
  userId,
  onClearLogs,
}: LogDetailsProps) {
  const [filterAction, setFilterAction] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filters = useMemo(() => {
    const f: ActivityLogFilters = {
      module,
      userId,
    };

    if (filterAction !== "ALL") {
      f.action = filterAction;
    }

    return f;
  }, [module, userId, filterAction]);

  const { data:logData, isLoading } = useActivityLogs(page, 10, filters);

  const logs = logData?.data || [];

  const filteredLogs = useMemo(() => {
    return logs.filter((log: TLogEntry) => {
      const matchesSearch =
        log.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [logs, searchQuery]);

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800";
      case "UPDATE":
        return "bg-blue-100 text-blue-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "LOGIN":
        return "bg-purple-100 text-purple-800";
      case "LOGOUT":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return "➕";
      case "UPDATE":
        return "✏️";
      case "DELETE":
        return "🗑️";
      case "LOGIN":
        return "🔓";
      case "LOGOUT":
        return "🔒";
      default:
        return "📝";
    }
  };

  const downloadLogs = () => {
    const csv = [
      ["ID", "Created At", "Action", "User", "Record", "Description"].join(","),
      ...filteredLogs.map((log: TLogEntry) =>
        [
          log._id,
          log.timestamp.toLocaleString(),
          log.action,
          log.title,
          log.role,
          log.description,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${module}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
          <p className="text-gray-600">Loading activity logs for {module}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {module} Activity Logs
          </h3>
          <p className="text-sm text-gray-600">
            Track all changes and activities for {module}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadLogs}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
          >
            <Download size={16} />
            Export
          </button>
          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
            >
              <Trash2 size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder={`Search ${module} logs by user, record, or action...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="ALL">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="LOGIN">Login</option>
          <option value="LOGOUT">Logout</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">No logs found for {module}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">
                    Time By
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log: TLogEntry) => (
                  <tr
                    key={log._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}
                      >
                        <span>{getActionIcon(log.action)}</span>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {log.title}
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium capitalize">
                      {log.role}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {log.description}
                      {log.changes && log.changes.length > 0 && (
                        <div className="mt-2 text-xs text-gray-600 space-y-1">
                          {log.changes.map((change, idx) => (
                            <div
                              key={idx}
                              className="ml-4 border-l-2 border-blue-300 pl-2"
                            >
                              <strong>{change.field}:</strong> {change.oldValue}{" "}
                              → {change.newValue}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredLogs.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredLogs.length} of {logs.length} logs for {module}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
