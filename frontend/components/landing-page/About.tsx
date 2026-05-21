"use client";

import Image from "next/image";
import {
  ShieldCheck,
  Layers3,
  Building2,
  ArrowRight,
} from "lucide-react";

function About() {
  const features = [
    {
      title: "Scalable Architecture",
      text: "Designed with modular and multi-tenant architecture for modern SaaS platforms.",
      icon: Layers3,
    },
    {
      title: "Secure & Reliable",
      text: "Protected APIs, secure authentication, and cloud-ready infrastructure.",
      icon: ShieldCheck,
    },
    {
      title: "Industry Flexible",
      text: "Perfect for clinics, coaching centers, gyms, agencies, and growing businesses.",
      icon: Building2,
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <div
          >
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
              About FlowDesk
            </p>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Built for Modern Businesses & Growing Teams
            </h2>

            <p className="mt-6 text-md leading-relaxed text-gray-600">
              FlowDesk is a powerful multi-tenant SaaS platform created to help
              businesses automate operations, manage teams, track payments and
              streamline workflows, all from one modern dashboard.
            </p>

            <p className="mt-4 text-md leading-relaxed text-gray-600">
              Whether you run a clinic, coaching center, gym, consultancy or
              enterprise, FlowDesk adapts to your workflow with scalable and
              secure architecture.
            </p>

            <a href="/pages/register-page" className="group mt-10 inline-flex items-center rounded outline-none bg-blue-600 px-4 py-[6px] font-semibold text-white transition-all duration-200 hover:bg-blue-700">
              Explore Platform

              <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>

          {/* RIGHT IMAGE */}
          <div
            className="relative"
          >
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-yellow-200 blur-3xl" />

            <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-indigo-200 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-2xl">
              <Image
                src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/1/hero-img.png"
                alt="About FlowDesk"
                width={700}
                height={700}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* FEATURE CARDS */}
        <div className="mt-24 grid gap-6 md:grid-cols-3">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-black/5 bg-white p-8 shadow-lg transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-300">
                  <Icon className="h-7 w-7 text-black" />
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-black">
                  {item.title}
                </h3>

                <p className="mt-4 leading-relaxed text-gray-600">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default About;