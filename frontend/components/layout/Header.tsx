"use client";

import { Mail, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Header() {
  const { logout } = useAuth();

  const storedData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("auth-data") || "{}")
      : {};

  const userRole = storedData?.role || [];
  const userName = storedData?.userName;

  // ✅ ROLE-BASED PROFILE ROUTE
  const profileRoute = userRole.includes("admin")
    ? "/pages/dashboard/super-admin/profile"
    : userRole.includes("business")
      ? "/pages/dashboard/business-admin/profile"
    : userRole.includes("staff")
        ? "/pages/dashboard/business-admin/staff-profile"
        : "";

  const roleLabel = userRole.includes("admin")
    ? "Super Admin"
    : userRole.includes("business")
      ? "Business Admin"
      : "Staff";

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white shadow-sm px-3 sm:px-4 lg:px-6 py-2">
      {/* LEFT */}
      <div className="min-w-0 flex-1">
        <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 truncate">
          Flowdesk - <span className="ml-1">{roleLabel}</span>
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
        {/* PROFILE LINK */}
        <Link
          href={profileRoute}
          className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition"
        >
          <User className="w-4 h-4 text-gray-600" />
          <span className="hidden xl:block text-sm text-gray-700">
            {userName || roleLabel}
          </span>
        </Link>

        {/* MAIL */}
        <button className="p-1.5 lg:p-2 bg-gray-100 hover:bg-red-600 hover:text-white text-red-600 rounded-full transition">
          <a href="/pages/dashboard/business-admin/mail">
          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
          </a>
        </button>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="p-1.5 lg:p-2 bg-gray-100 hover:bg-black hover:text-white text-gray-700 rounded-full transition"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
        </button>
      </div>
    </header>
  );
}