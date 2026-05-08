"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BarChart,
} from "lucide-react";

const dashboardItem = {
  id: "dashboard",
  name: "Dashboard",
  href: "/pages/dashboard/business-admin",
  icon: LayoutDashboard,
};

const menu = [
  {
    id: "business",
    name: "Business Management",
    href: "/pages/dashboard/business-admin/business",
    icon: Building2,
    serviceKey: "business_management",
  },
  {
    id: "asset",
    name: "Asset Management",
    href: "/pages/dashboard/business-admin/assets",
    icon: BarChart,
    serviceKey: "asset_management",
  },
  {
    id: "client",
    name: "Client Management",
    href: "/pages/dashboard/business-admin/clients",
    icon: Users,
    serviceKey: "client_management",
  },
  {
    id: "staff",
    name: "Staff Management",
    href: "/pages/dashboard/business-admin/staff",
    icon: Users,
    serviceKey: "staff_management",
  },
  {
    id: "attendance",
    name: "Attendance Management",
    href: "/pages/dashboard/business-admin/attendance",
    icon: LayoutDashboard,
    serviceKey: "attendance_management",
  },
  {
    id: "billing",
    name: "Billing & Payments",
    href: "/pages/dashboard/business-admin/billing",
    icon: CreditCard,
    serviceKey: "billing_management",
  },
];

export default function BusinessSidebar({ allowedServices }: { allowedServices: string[] }) {
  const [active, setActive] = useState("dashboard");

  const filteredMenu = [
    dashboardItem,
    ...menu.filter((item) => allowedServices.includes(item.serviceKey)),
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 hidden md:block shadow-sm">
      <div className="p-5 text-xl font-bold text-indigo-600 border-b border-gray-200">
        Business Portal
      </div>

      <div className="p-3 space-y-2 text-sm font-medium">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActive(item.id)}
              className={`flex items-center px-4 py-2 rounded-md border shadow-sm transition
                ${
                  isActive
                    ? "bg-gray-700 text-white border-gray-700"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
