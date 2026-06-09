"use client";

import clsx from "clsx";
import React from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string;
}

interface TabNavigationProps {
  activeTab: string;
  tabs: Tab[];
  onTabChange: (tabId: string) => void;
}

export default function TabNavigation({
  activeTab,
  tabs,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="flex gap-2 border-b border-gray-200 mb-3 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          disabled={tab.disabled}
          onClick={() => onTabChange(tab.id)}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap",
            activeTab === tab.id
              ? "border-blue-400 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900",
            tab.disabled && "opacity-60 cursor-not-allowed",
          )}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
          {tab.badge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
