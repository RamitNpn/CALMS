"use client";

import clsx from "clsx";
import React from "react";

type TabItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

type DetailTabNavigationProps = {
  activeTab: string;
  tabs: TabItem[];
  onTabChange: (tabId: string) => void;
};

export default function DetailTabNavigation({
  activeTab,
  tabs,
  onTabChange,
}: DetailTabNavigationProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-1 shadow-sm">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition whitespace-nowrap",
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-white hover:text-gray-900",
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}