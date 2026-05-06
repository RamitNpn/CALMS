"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Building2,
  Users,
  UserSquare2,
  ClipboardList,
  FileText,
  Package,
  Calendar,
  Menu,
  X,
} from "lucide-react";

const navigationItems = [
  { href: "/pages/business", label: "Businesses", icon: Building2 },
  { href: "/pages/staff", label: "Staff", icon: Users },
  { href: "/pages/clients", label: "Clients/Students", icon: UserSquare2 },
  { href: "/pages/attendance", label: "Attendance", icon: ClipboardList },
  { href: "/pages/invoices", label: "Invoices", icon: FileText },
  { href: "/pages/assets", label: "Assets", icon: Package },
  { href: "/pages/schedules", label: "Schedules", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white border rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white p-6 overflow-y-auto",
          "transition-transform duration-300 md:translate-x-0 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="mb-8 mt-12 md:mt-0">
          <h1 className="text-2xl font-bold text-white">CALMS</h1>
          <p className="text-blue-200 text-sm">Management System</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.includes(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-white text-blue-900 font-medium"
                    : "text-blue-100 hover:bg-blue-700"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6 text-blue-200 text-xs">
          <p>v1.0.0</p>
          <p className="mt-1">© 2024 All rights reserved</p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
