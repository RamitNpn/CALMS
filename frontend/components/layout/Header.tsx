"use client";

import { Bell, Mail, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const pendingCount = 3;

  // This only runs on the client side
  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");
  const userRole = storedData?.role || [];

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex justify-between items-center px-4 py-1 border-b border-gray-200 bg-white shadow-sm">
      {/* Left: Brand */}
      <h1 className="text-lg font-semibold text-gray-800 px-6">
        Flowdesk -{" "}
        {userRole.includes("admin")
          ? "Super Admin"
          : userRole.includes("business_admin")
            ? "Business Admin"
            : "Staff"}
      </h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 md:gap-4 text-sm md:text-base pr-6 py-2">
        <span className="hidden lg:block text-sm text-gray-600 ml-2">
          {userRole.includes("admin")
            ? "Super Admin"
            : userRole.includes("business_admin")
              ? "Business Admin"
              : "Staff"}
        </span>

        {/* Notifications */}
        <button className="relative p-2 bg-gray-100 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-full transition">
          <Bell className="w-4 h-4 md:w-5 md:h-5" />

          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">
              {pendingCount}
            </span>
          )}
        </button>

        {/* Mail */}
        <button className="p-2 bg-gray-100 hover:bg-red-600 hover:text-white text-red-600 rounded-full transition">
          <Mail className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 bg-gray-100 hover:bg-black hover:text-white text-gray-700 rounded-full transition"
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </header>
  );
}
