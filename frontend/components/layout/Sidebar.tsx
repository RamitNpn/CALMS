"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BarChart,
} from "lucide-react";

const menu = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: "/pages/dashboard/business-admin",
    icon: LayoutDashboard,
    exact: true,
  },

  {
    id: "super-business",
    name: "Business Management",
    href: "/pages/dashboard/super-admin/business",
    icon: Building2,
    exact: true,
  },

  {
    id: "super-payment",
    name: "Payment Management",
    href: "/pages/dashboard/super-admin/payments",
    icon: CreditCard,
    exact: true,
  },

  {
    id: "profile",
    name: "Profile Management",
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

type Props = {
  allowedServices: string[];
  userRole: string[];
};

export default function Sidebar({
  allowedServices,
  userRole,
}: Props) {
  const pathname = usePathname();

  const filteredMenu = userRole.includes("admin")
    ? menu.filter((item) =>
        ["dashboard", "super-business", "super-payment"].includes(
          item.id,
        ),
      )
    : menu.filter(
        (item) =>
          item.serviceKey &&
          allowedServices.includes(item.serviceKey),
      );

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 hidden md:block shadow-sm">
      <div className="p-5 text-xl font-bold text-indigo-600 border-b border-gray-200">
        Business Portal
      </div>

      <div className="p-3 space-y-2 text-sm font-medium">
        {filteredMenu.map((item) => {
          const Icon = item.icon;

          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-gray-800 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}