"use client";

import { Bell, Mail, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const pendingCount = 3;

  const { logout } = useAuth();

  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");

  const userRole = storedData?.role || [];
  const userName = storedData?.userName;

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white shadow-sm px-3 sm:px-4 lg:px-6 py-2">
      {/* LEFT */}
      <div className="min-w-0 flex-1">
        <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 truncate">
          Flowdesk -
          <span className="ml-1">
            {userRole.includes("admin")
              ? "Super Admin"
              : userRole.includes("business")
                ? "Business Admin"
                : "Staff"}
          </span>
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-sm md:text-base flex-shrink-0">
        {/* ROLE LABEL */}
        <span className="hidden xl:block text-sm text-gray-600">
          {userName
            ? userName
            : userRole.includes("admin")
              ? "Super Admin"
              : userRole.includes("business")
                ? "Business Admin"
                : "Staff"}
        </span>

        {/* Notifications */}
        <button className="relative p-1.5 lg:p-2 bg-gray-100 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-full transition">
          <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />

          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] lg:text-[10px] px-1 py-0.5 rounded-full leading-none">
              {pendingCount}
            </span>
          )}
        </button>

        {/* Mail */}
        <button className="p-1.5 lg:p-2 bg-gray-100 hover:bg-red-600 hover:text-white text-red-600 rounded-full transition">
          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-1.5 lg:p-2 bg-gray-100 hover:bg-black hover:text-white text-gray-700 rounded-full transition"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
        </button>
      </div>
    </header>
  );
}
