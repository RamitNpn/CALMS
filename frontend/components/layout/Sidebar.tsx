"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo, useEffect } from "react";

import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BarChart,
  ChevronLeft,
  ChevronRight,
  CardSim,
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
    roles: ["business", "staff"],
  },

  {
    id: "profile",
    serviceKey: "business_management",
    href: "/pages/dashboard/business-admin/business",
    icon: Building2,
    roles: ["business", "staff"],
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
    id: "token-management",
    name: "Token Management",
    href: "/pages/dashboard/business-admin/token",
    icon: CardSim,
    exact: true,
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
  userName?: string;
};

export default function Sidebar({ userRole, userName }: Props) {
  const pathname = usePathname();

  const { data: serviceData } = useAllService();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allowedServices = useMemo(() => {
    return (
      serviceData?.map((s: { service_key: string }) => s.service_key) || []
    );
  }, [serviceData]);

  const serviceNameMap = useMemo(() => {
    return (
      serviceData?.reduce(
        (
          acc: {
            [key: string]: string;
          },
          s: {
            service_key: string;
            custom_name: string;
            default_name: string;
          },
        ) => {
          acc[s.service_key] = s.custom_name || s.default_name;

          return acc;
        },
        {},
      ) || {}
    );
  }, [serviceData]);

  /**
   * FILTER MENU
   */
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const hasRoleAccess = item.roles.some((r) => userRole.includes(r));

      if (!hasRoleAccess) return false;

      if (userRole.includes("admin")) return true;

      if (item.id === "business-dashboard") return true;

      if (item.serviceKey) {
        return allowedServices.includes(item.serviceKey);
      }

      return true;
    });
  }, [allowedServices, userRole]);

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 relative
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* HEADER */}
      <div className={`p-[9px] lg:p-[14px] font-bold text-indigo-600 border-b border-gray-200 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed ? <span>FlowDesk</span> : <span>FD</span>}
      </div>

      {/* MENU */}
      <div className="p-3 space-y-2 text-[14px]">
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
                }`}
            >
              <Icon
                className={`${collapsed ? "w-4 h-4" : "w-4 h-4"} shrink-0`}
              />

              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </div>

      {/* TOGGLE BUTTON */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 flex items-center
    ${collapsed ? "flex-col justify-center gap-2" : "justify-end"}
  `}
      >
        {/* Username initials only when collapsed */}
        {collapsed && (
          <a
            href="/pages/dashboard/profile"
            className="text-sm font-medium text-gray-600"
          >
            {userName
              ? userName
                  .trim()
                  .split(/\s+/)
                  .map((word: string) => word[0]?.toUpperCase())
                  .join("")
              : userRole.includes("admin")
                ? "SA"
                : userRole.includes("business_admin")
                  ? "BA"
                  : "S"}
          </a>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center bg-gray-900 text-white p-2 rounded-full shadow transition hover:bg-gray-700 cursor-pointer"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>
    </aside>
  );
}
