"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function Nav() {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsTop(currentScrollY < 10);
      if (currentScrollY < lastScrollY) {
        setShowNav(true);
      }
      else if (currentScrollY > lastScrollY) {
        setShowNav(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        showNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${isTop ? "bg-transparent" : "bg-white/40 backdrop-blur-xl shadow-sm"}`}
    >
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 lg:h-16 lg:mx-10">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex text-2xl font-bold text-blue-600 text-opacity-80 transition-all duration-200 hover:text-opacity-100"
            >
              FlowDesk
            </Link>
          </div>

          {/* <button
            type="button"
            className="inline-flex p-2 text-black transition-all duration-200 rounded-md hidden focus:bg-gray-100 hover:bg-gray-100"
          >
            <svg
              className="block w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8h16M4 16h16"
              ></path>
            </svg>

            <svg
              className="hidden w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button> */}

          {/* <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-10">
            <a
              href="#"
              title=""
              className="text-base text-black transition-all duration-200 hover:text-opacity-80"
            >
              {" "}
              Features{" "}
            </a>

            <a
              href="#"
              title=""
              className="text-base text-black transition-all duration-200 hover:text-opacity-80"
            >
              {" "}
              Solutions{" "}
            </a>

            <a
              href="#"
              title=""
              className="text-base text-black transition-all duration-200 hover:text-opacity-80"
            >
              {" "}
              Resources{" "}
            </a>

            <a
              href="#"
              title=""
              className="text-base text-black transition-all duration-200 hover:text-opacity-80"
            >
              {" "}
              Pricing{" "}
            </a>
          </div> */}

          <a
            href="/pages/login-page"
            title=""
            className="lg:inline-flex items-center justify-center px-3 py-[6px] text-base transition-all duration-200 hover:bg-blue-700 hover:text-white font-semibold text-white bg-blue-600 rounded"
            role="button"
          >
            {" "}
            Sign In{" "}
          </a>
        </div>
      </div>
    </header>
  );
}

export default Nav;
