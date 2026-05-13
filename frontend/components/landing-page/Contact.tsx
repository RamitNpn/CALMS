"use client";

import {
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-28"
    >

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-8">
        {/* LEFT CONTENT */}
        <div
          className="flex flex-col justify-center"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
            Contact Us
          </p>

          <h2 className="text-4xl font-bold leading-tight text-black sm:text-5xl lg:text-6xl">
            Let’s Build Something Amazing Together
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Have questions about FlowDesk or need a customized business
            solution? Our team is here to help you simplify operations and grow
            faster with modern technology.
          </p>

          {/* CONTACT INFO */}
          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <Mail className="h-5 w-5 text-red-500" />
              </div>

              <div>
                <p className="font-semibold text-black">Email</p>
                <p className="text-gray-600">support@flowdesk.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <Phone className="h-5 w-5 text-green-500" />
              </div>

              <div>
                <p className="font-semibold text-black">Phone</p>
                <p className="text-gray-600">+977 9800000000</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>

              <div>
                <p className="font-semibold text-black">Location</p>
                <p className="text-gray-600">
                  Kathmandu, Nepal
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div
          className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-2xl lg:p-10"
        >
          <form className="space-y-6">
            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-black">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded border border-gray-200 px-5 py-2 text-black outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-400"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-black">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded border border-gray-200 px-5 py-2 text-black outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-400"
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-black">
                Message
              </label>

              <textarea
                rows={5}
                placeholder="Write your message..."
                className="w-full rounded border border-gray-200 px-5 py-2 resize-none overflow-y-auto text-black outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-400"
              />
            </div>

            {/* BUTTON */}
            <button className="group inline-flex w-full items-center justify-center rounded bg-blue-600 py-3 cursor-pointer font-semibold text-white transition-all duration-200 hover:bg-blue-700">
              Send Message

              <Send className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}