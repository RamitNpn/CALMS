"use client";

import {
  Building2,
  Users,
  CreditCard,
  Ticket,
  CalendarDays,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export default function Service() {
  const services = [
    {
      title: "Multi-Tenant Management",
      description:
        "Manage multiple businesses, branches, and organizations from one centralized platform.",
      icon: Building2,
    },
    {
      title: "Staff & Client Portals",
      description:
        "Dedicated dashboards for admins, staff members, and clients with role-based access.",
      icon: Users,
    },
    {
      title: "Billing & Subscription",
      description:
        "Integrated billing, invoicing, subscription handling, and payment gateway support.",
      icon: CreditCard,
    },
    {
      title: "Queue & Token System",
      description:
        "Real-time token management and queue monitoring powered by Socket.io.",
      icon: Ticket,
    },
    {
      title: "Scheduling & Attendance",
      description:
        "Smart scheduling, appointment booking, attendance tracking, and workflow automation.",
      icon: CalendarDays,
    },
    {
      title: "Analytics Dashboard",
      description:
        "Detailed analytics, reports, exports, and real-time business insights.",
      icon: BarChart3,
    },
  ];

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28"
    >

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* HEADING */}
        <div
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
            Services
          </p>

          <h2 className="text-4xl font-bold leading-tight text-black lg:text-6xl">
            Everything You Need in One Platform
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Powerful tools and modules designed to simplify operations,
            automate workflows, and help your business scale faster.
          </p>
        </div>

        {/* SERVICES GRID */}
        <div className="mt-20 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group rounded-[2rem] border border-black/5 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                {/* ICON */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 transition-all duration-300 group-hover:scale-110">
                  <Icon className="h-8 w-8 text-black" />
                </div>

                {/* TITLE */}
                <h3 className="mt-7 text-2xl font-bold text-black">
                  {service.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-4 leading-relaxed text-gray-600">
                  {service.description}
                </p>

                {/* BUTTON */}
                <button className="mt-8 inline-flex items-center font-semibold text-black transition-all duration-200 hover:text-indigo-600">
                  Learn More

                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}