"use client";

import React, { useState } from "react";
import { Settings, Plus, X } from "lucide-react";

interface CustomizeOption {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}

interface CustomizeSectionProps {
  module: string;
  onSave?: (options: CustomizeOption[]) => void;
}

const defaultOptions: Record<string, CustomizeOption[]> = {
  Assets: [
    {
      id: "show-status",
      name: "Show Status Field",
      enabled: true,
      description: "Display asset status in list view",
    },
    {
      id: "show-custom-fields",
      name: "Show Custom Fields",
      enabled: true,
      description: "Display custom fields in list view",
    },
    {
      id: "bulk-actions",
      name: "Bulk Actions",
      enabled: true,
      description: "Enable bulk operations",
    },
    {
      id: "export-data",
      name: "Export Data",
      enabled: true,
      description: "Allow exporting records to CSV/Excel",
    },
  ],
  Attendance: [
    {
      id: "show-check-times",
      name: "Show Check Times",
      enabled: true,
      description: "Display check-in and check-out times",
    },
    {
      id: "show-duration",
      name: "Show Duration",
      enabled: true,
      description: "Show work duration in hours",
    },
    {
      id: "bulk-mark",
      name: "Bulk Mark Attendance",
      enabled: true,
      description: "Mark attendance for multiple users",
    },
    {
      id: "export-report",
      name: "Export Report",
      enabled: true,
      description: "Generate and download attendance reports",
    },
  ],
  Billing: [
    {
      id: "show-amount",
      name: "Show Amount",
      enabled: true,
      description: "Display billing amounts",
    },
    {
      id: "show-status",
      name: "Show Status",
      enabled: true,
      description: "Display payment status",
    },
    {
      id: "auto-invoice",
      name: "Auto Invoice Generation",
      enabled: false,
      description: "Automatically generate invoices",
    },
    {
      id: "payment-tracking",
      name: "Payment Tracking",
      enabled: true,
      description: "Track payment history",
    },
  ],
  Clients: [
    {
      id: "show-contact",
      name: "Show Contact Info",
      enabled: true,
      description: "Display client contact details",
    },
    {
      id: "show-status",
      name: "Show Status",
      enabled: true,
      description: "Display client status",
    },
    {
      id: "assign-staff",
      name: "Assign Staff",
      enabled: true,
      description: "Assign staff members to clients",
    },
    {
      id: "communication",
      name: "Communication Log",
      enabled: false,
      description: "Track client communication history",
    },
  ],
  Staff: [
    {
      id: "show-department",
      name: "Show Department",
      enabled: true,
      description: "Display staff department",
    },
    {
      id: "show-role",
      name: "Show Role",
      enabled: true,
      description: "Display staff role",
    },
    {
      id: "performance-metrics",
      name: "Performance Metrics",
      enabled: false,
      description: "Show performance ratings",
    },
    {
      id: "schedule-management",
      name: "Schedule Management",
      enabled: true,
      description: "Manage staff schedules",
    },
  ],
};

export default function CustomizeSection({
  module,
  onSave,
}: CustomizeSectionProps) {
  const [options, setOptions] = useState<CustomizeOption[]>(
    defaultOptions[module] || []
  );
  const [newOption, setNewOption] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);

  const toggleOption = (id: string) => {
    setOptions(
      options.map((opt) =>
        opt.id === id ? { ...opt, enabled: !opt.enabled } : opt
      )
    );
  };

  const handleSave = () => {
    onSave?.(options);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const addNewOption = () => {
    if (newOption.trim()) {
      const newOpt: CustomizeOption = {
        id: `custom-${Date.now()}`,
        name: newOption,
        enabled: true,
        description: "Custom option",
      };
      setOptions([...options, newOpt]);
      setNewOption("");
    }
  };

  const removeOption = (id: string) => {
    setOptions(options.filter((opt) => opt.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Settings size={20} />
            Customize {module} View
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure which fields and features are displayed for {module}
          </p>
        </div>
      </div>

      {/* Success Message */}
      {savedMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          ✓ Settings saved successfully
        </div>
      )}

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <div
            key={option.id}
            className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={option.enabled}
                  onChange={() => toggleOption(option.id)}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
                <div>
                  <p className="font-medium text-gray-900">{option.name}</p>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </div>
              </label>
            </div>
            {option.id.startsWith("custom-") && (
              <button
                onClick={() => removeOption(option.id)}
                className="ml-2 p-1 hover:bg-red-100 text-red-600 rounded transition"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add New Option */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-medium text-gray-900 mb-3">Add Custom Field</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter new field name..."
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") addNewOption();
            }}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addNewOption}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          Save Preferences
        </button>
        <button
          onClick={() =>
            setOptions(defaultOptions[module] || [])
          }
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}
