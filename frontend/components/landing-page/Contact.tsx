"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          {/* LEFT CONTENT */}
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
              Contact Us
            </p>

            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Have Questions About Driving Training?
            </h2>

            <p className="mt-6 text-md leading-relaxed text-gray-600">
              Whether you are planning for a new admission, license trial
              preparation, or vehicle training, our team is ready to assist you.
              Submit an inquiry and we&apos;ll guide you through everything.
            </p>

            {/* CONTACT INFO */}
            <div className="mt-10 space-y-5 text-[14px]">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
                  <Mail className="h-5 w-5 text-red-500" />
                </div>

                <div>
                  <p className="font-semibold text-black">Email</p>

                  <p className="text-gray-600">support@drivinginstitute.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
                  <Phone className="h-5 w-5 text-green-500" />
                </div>

                <div>
                  <p className="font-semibold text-black">Phone</p>

                  <p className="text-gray-600">+977 9800000000</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
                  <MapPin className="h-5 w-5 text-blue-500" />
                </div>

                <div>
                  <p className="font-semibold text-black">Location</p>

                  <p className="text-gray-600">Kathmandu, Nepal</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded bg-white p-8 shadow-2xl lg:p-12">
            <div className="absolute top-0 right-0 h-52 w-52 rounded-full bg-red-400x blur-3xl" />

            <div className="relative z-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 backdrop-blur-sm">
                <MessageSquare className="h-8 w-8" />
              </div>

              <h3 className="text-3xl font-bold">Ready To Make An Inquiry?</h3>

              <p className="mt-5 leading-relaxed text-gray-800">
                Want information about courses, schedules, pricing, license
                categories, or admissions? Submit your inquiry and our team will
                contact you shortly.
              </p>

              <div className="mt-10 space-y-4">
                <div className="rounded-[12px] border border-white/15 bg-gray-200 p-3 backdrop-blur-sm">
                  ✓ New Admission Inquiry
                </div>

                <div className="rounded-[12px] border border-white/15 bg-gray-200 p-3 backdrop-blur-sm">
                  ✓ License Trial Preparation
                </div>

                <div className="rounded-[12px] border border-white/15 bg-gray-200 p-3 backdrop-blur-sm">
                  ✓ Vehicle Training & Packages
                </div>
              </div>

              <Link
                href="/pages/inquery"
                className="group mt-10 inline-flex items-center justify-center rounded bg-blue-600 px-3 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700"
              >
                Submit Inquiry
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
