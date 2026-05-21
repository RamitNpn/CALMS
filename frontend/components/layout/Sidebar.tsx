"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";

import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BarChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useAllService } from "@/hooks/business-admin/service/getAllServiceDatas";

const menu = [
  // ADMIN
  {
    id: "super-dashboard",
    name: "Dashboard",
    href: "/pages/dashboard/super-admin",
    icon: LayoutDashboard,
    exact: true,
    roles: ["admin"],
  },
  {
    id: "super-business",
    name: "Business Management",
    href: "/pages/dashboard/super-admin/business",
    icon: Building2,
    exact: false,
    roles: ["admin"],
  },
  {
    id: "super-payment",
    name: "Payment Management",
    href: "/pages/dashboard/super-admin/payments",
    icon: CreditCard,
    exact: false,
    roles: ["admin"],
  },

  // BUSINESS
  {
    id: "business-dashboard",
    name: "Dashboard",
    href: "/pages/dashboard/business-admin",
    icon: LayoutDashboard,
    exact: true,
    roles: ["business"],
  },

  {
    id: "profile",
    serviceKey: "business_management",
    href: "/pages/dashboard/business-admin/business",
    icon: Building2,
    roles: ["business"],
  },

  {
    id: "asset",
    serviceKey: "asset_management",
    href: "/pages/dashboard/business-admin/assets",
    icon: BarChart,
    roles: ["business"],
  },

  {
    id: "client",
    serviceKey: "client_management",
    href: "/pages/dashboard/business-admin/clients",
    icon: Users,
    roles: ["business"],
  },

  {
    id: "staff",
    serviceKey: "staff_management",
    href: "/pages/dashboard/business-admin/staff",
    icon: Users,
    roles: ["business"],
  },

  {
    id: "attendance",
    serviceKey: "attendance_management",
    href: "/pages/dashboard/business-admin/attendance",
    icon: LayoutDashboard,
    roles: ["business"],
  },

  {
    id: "billing",
    serviceKey: "billing_management",
    href: "/pages/dashboard/business-admin/billing",
    icon: CreditCard,
    roles: ["business"],
  },
];

type Props = {
  userRole: string[];
};

export default function Sidebar({ userRole }: Props) {
  const pathname = usePathname();
  const { data: serviceData } = useAllService();

  const [collapsed, setCollapsed] = useState(false);

  /**
   * Convert backend services → map for quick lookup
   */
  const allowedServices = useMemo(() => {
    return (
      serviceData?.map((s: { service_key: string }) => s.service_key) || []
    );
  }, [serviceData]);

  const serviceNameMap = useMemo(() => {
    return (
      serviceData?.reduce(
        (
          acc: { [key: string]: string },
          s: { service_key: string; custom_name: string; default_name: string },
        ) => {
          acc[s.service_key] = s.custom_name || s.default_name;
          return acc;
        },
        {},
      ) || {}
    );
  }, [serviceData]);

  /**
   * FILTER MENU BASED ON ROLE + SERVICES
   */
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const hasRoleAccess = item.roles.some((r) => userRole.includes(r));

      if (!hasRoleAccess) return false;

      // Admin sees everything
      if (userRole.includes("admin")) return true;

      // Always show dashboard
      if (item.id === "business-dashboard") return true;

      // If service-based item
      if (item.serviceKey) {
        return allowedServices.includes(item.serviceKey);
      }

      return true;
    });
  }, [allowedServices, userRole]);

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 relative
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* HEADER */}
      <div className="p-[18px] font-bold text-indigo-600 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && <span>FlowDesk</span>}
      </div>

      {/* MENU */}
      <div className="p-3 space-y-2 text-sm font-medium">
        {filteredMenu.map((item) => {
          const Icon = item.icon;

          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          const label = serviceNameMap[item.serviceKey || ""] || item.name;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-gray-800 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <Icon className="w-5 h-5" />

              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 flex flex-col items-center justify-between">
        {/* COLLAPSE BUTTON */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-gray-900 text-white p-2 rounded-full shadow"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
