import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center md:grid md:grid-cols-3 md:items-center md:text-left">
          {/* LEFT */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3">
              <Image
                src="/DrivingLogo.png"
                alt="Public Driving Management System"
                width={48}
                height={48}
                className="h-12 w-auto object-contain"
              />

              <div>
                <h3 className="text-base font-bold text-black sm:text-lg">
                  PDMS
                </h3>
                <p className="text-xs text-gray-500 sm:text-sm">
                  Public Driving Management System
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-600 sm:text-sm">
              © {new Date().getFullYear()} Public Driving Management System
            </p>

            <p className="text-xs text-gray-500">
              Powered by Cornor Tech Pvt. Ltd.
            </p>
          </div>

          {/* CENTER LINKS */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium">
            <a
              href="#"
              className="text-gray-600 transition-colors hover:text-blue-600"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-gray-600 transition-colors hover:text-blue-600"
            >
              Terms & Conditions
            </a>

            <a
              href="#"
              className="text-gray-600 transition-colors hover:text-blue-600"
            >
              Support
            </a>
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-center gap-3 md:justify-end">
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 transition-all hover:bg-blue-100"
            >
              🌐
            </a>

            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 transition-all hover:bg-blue-100"
            >
              📘
            </a>

            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 transition-all hover:bg-blue-100"
            >
              📸
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;