import React from "react";

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/5">

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-2 md:flex-row lg:px-8">
        {/* LEFT */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-black">FlowDesk</h3>

          <p className="mt-2 text-sm text-gray-600">
            © {new Date().getFullYear()} FlowDesk - Cornor Tech Pvt. Ltd.
          </p>
        </div>

        {/* CENTER LINKS */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
          <a
            href="#"
            className="text-gray-600 transition-all duration-200 hover:text-black"
          >
            Privacy Policy
          </a>

          <a
            href="#"
            className="text-gray-600 transition-all duration-200 hover:text-black"
          >
            Terms & Conditions
          </a>

          <a
            href="#"
            className="text-gray-600 transition-all duration-200 hover:text-black"
          >
            Support
          </a>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCF8F1] text-gray-700 transition-all duration-200 hover:bg-yellow-300 hover:text-black"
          >
            🌐
          </a>

          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCF8F1] text-gray-700 transition-all duration-200 hover:bg-yellow-300 hover:text-black"
          >
            📘
          </a>

          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCF8F1] text-gray-700 transition-all duration-200 hover:bg-yellow-300 hover:text-black"
          >
            📸
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
