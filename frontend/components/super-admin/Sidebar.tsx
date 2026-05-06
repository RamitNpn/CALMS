"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BarChart,
  Settings,
} from "lucide-react";

const menu = [
  { id: "dashboard", name: "Dashboard", href: "/pages/dashboard/super-admin", icon: LayoutDashboard },
  { id: "businesses", name: "Businesses", href: "/pages/dashboard/super-admin/business", icon: Building2 },
  { id: "clients", name: "Clients", href: "/pages/dashboard/super-admin/client", icon: Users },
  { id: "staffs", name: "Staffs", href: "/pages/dashboard/super-admin/staff", icon: Users },
  { id: "payments", name: "Payments", href: "/pages/dashboard/super-admin/payments", icon: CreditCard },
  { id: "analytics", name: "Analytics", href: "/pages/dashboard/super-admin/analytics", icon: BarChart },
  { id: "settings", name: "Settings", href: "/pages/dashboard/super-admin/settings", icon: Settings },
];

export default function Sidebar() {
  const [active, setActive] = useState("dashboard");

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 hidden md:block shadow-sm">
      {/* Header */}
      <div className="p-5 text-xl font-bold text-indigo-600 border-b border-gray-200">
        FlowDesk Admin
      </div>

      {/* Menu */}
      <div className="p-3 space-y-2 text-sm font-medium">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActive(item.id)}
              className={`flex items-center px-4 py-2 rounded-md border shadow-sm transition cursor-pointer
                ${
                  isActive
                    ? "bg-gray-600 text-white border-gray-600"
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