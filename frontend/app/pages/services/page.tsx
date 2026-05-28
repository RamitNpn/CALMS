"use client";

import Link from "next/link";
import {
  Users,
  CreditCard,
  BarChart3,
  Clock,
  Briefcase,
  Package,
  ArrowRight,
  ShieldCheck,
  FileText,
  CalendarCheck,
  Bell,
  Wallet,
  TrendingUp,
  MoveLeft,
} from "lucide-react";
import Nav from "@/components/landing-page/Nav";
import Footer from "@/components/landing-page/Footer";

export default function Features() {
  const features = [
    {
      icon: Users,
      title: "Staff Management",
      desc: "Manage your entire workforce from one centralized platform with smart HR and employee management tools.",
      highlights: [
        "Employee profile & document management",
        "Salary, payroll & allowance tracking",
        "Leave request & approval workflows",
        "Role-based staff access permissions",
        "Department & team organization",
        "Performance monitoring & staff insights",
      ],
    },
    {
      icon: Clock,
      title: "Attendance Tracking",
      desc: "Monitor employee attendance in real time with automated tracking and smart attendance systems.",
      highlights: [
        "QR code & manual attendance check-ins",
        "Real-time attendance dashboard",
        "Late entry & overtime tracking",
        "Shift scheduling & work-hour monitoring",
        "Attendance history & monthly reports",
        "Absence alerts & attendance analytics",
      ],
    },
    {
      icon: Briefcase,
      title: "Client Management",
      desc: "Build stronger client relationships and manage business interactions efficiently from a single dashboard.",
      highlights: [
        "Client profile & contact management",
        "Meeting, follow-up & interaction tracking",
        "Billing relationship management",
        "Client project & service monitoring",
        "Communication history tracking",
        "Client activity reports & insights",
      ],
    },
    {
      icon: Package,
      title: "Asset Management",
      desc: "Track, organize and maintain all company assets with powerful monitoring and maintenance tools.",
      highlights: [
        "Asset registration & categorization",
        "Maintenance scheduling & reminders",
        "Asset depreciation monitoring",
        "Asset assignment to employees",
        "Damage & repair tracking",
        "Asset lifecycle & usage reports",
      ],
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      desc: "Gain valuable business insights through interactive dashboards and advanced reporting systems.",
      highlights: [
        "Real-time business dashboards",
        "Custom report generation",
        "Financial & operational analytics",
        "Staff productivity insights",
        "Attendance & payroll statistics",
        "Exportable PDF & Excel reports",
      ],
    },
    {
      icon: CreditCard,
      title: "Billing & Invoicing",
      desc: "Simplify financial operations with automated invoicing, payment tracking and billing management.",
      highlights: [
        "Professional invoice generation",
        "Automated billing cycle management",
        "Payment tracking & reminders",
        "Expense & transaction records",
        "Tax & discount management",
        "Financial summaries & billing reports",
      ],
    },
  ];

  const extraFeatures = [
    {
      icon: ShieldCheck,
      title: "Secure Access Control",
      desc: "Protect sensitive business data with secure authentication and role-based permissions.",
    },
    {
      icon: FileText,
      title: "Digital Record Keeping",
      desc: "Store documents, contracts and important records securely in one place.",
    },
    {
      icon: CalendarCheck,
      title: "Task & Schedule Management",
      desc: "Plan meetings, employee schedules and business activities with ease.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      desc: "Receive instant alerts for attendance, invoices, maintenance and approvals.",
    },
    {
      icon: Wallet,
      title: "Expense Tracking",
      desc: "Track operational expenses and monitor company spending efficiently.",
    },
    {
      icon: TrendingUp,
      title: "Business Growth Insights",
      desc: "Identify trends, optimize workflows and make smarter business decisions.",
    },
  ];

  return (
    <>
      <Nav />
      <section
        id="services"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-20 py-16"
      >
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
            Services
          </p>

          <h2 className="text-3xl font-bold leading-tight text-black lg:text-5xl">
            Complete Business Management Solution
          </h2>

          <p className="mt-6 text-md leading-relaxed text-gray-600">
            Powerful tools designed to automate operations, improve
            productivity, manage teams efficiently and help businesses grow
            faster with smarter workflows.
          </p>
          <Link
            href="/"
            className="group mt-10 inline-flex items-center rounded bg-emerald-600 px-2 py-[6px] text-white transition-all duration-200 hover:bg-emerald-700"
          >
            <MoveLeft className="w-4 h-4 mx-2" /> Return back
          </Link>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-black/5 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm leading-6 text-muted-foreground mb-5">
                  {feature.desc}
                </p>

                <ul className="space-y-3 mb-6">
                  {feature.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-gray-700"
                    >
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Extra Features */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-black">
              Additional Business Tools
            </h3>

            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              More powerful features to streamline operations, improve
              efficiency and support long-term business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {extraFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  <h4 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h4>

                  <p className="text-sm text-gray-600 leading-6">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
