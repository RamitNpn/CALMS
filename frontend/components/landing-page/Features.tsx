"use client";

import {
  Users,
  CreditCard,
  BarChart3,
  Clock,
  Briefcase,
  Package,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Users,
      title: "Staff Management",
      desc: "Manage employees, track salaries, and handle leave requests with ease",
    },
    {
      icon: Clock,
      title: "Attendance Tracking",
      desc: "QR code check-ins, manual entries, and comprehensive attendance reports",
    },
    {
      icon: Briefcase,
      title: "Client Management",
      desc: "Organize clients, track interactions, and manage billing relationships",
    },
    {
      icon: Package,
      title: "Asset Management",
      desc: "Track assets, schedule maintenance, and manage asset depreciation",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      desc: "Real-time dashboards with comprehensive insights and custom reports",
    },
    {
      icon: CreditCard,
      title: "Billing & Invoicing",
      desc: "Create invoices, track payments, and manage billing cycles automatically",
    },
  ];

  return (
    <section
      id="services"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mt-8"
    >
      <div className="mx-auto max-w-3xl text-center mb-8">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
          Services
        </p>

        <h2 className="text-4xl font-bold leading-tight text-black lg:text-6xl">
          Everything You Need in One Platform
        </h2>

        <p className="mt-6 text-lg leading-relaxed text-gray-600">
          Powerful tools and modules designed to simplify operations, automate
          workflows and help your business scale faster.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="group rounded-[12px] border border-black/5 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
