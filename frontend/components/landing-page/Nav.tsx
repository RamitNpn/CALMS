"use client";

import Link from "next/link";
import Image from "next/image";
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
      } else if (currentScrollY > lastScrollY) {
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
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/DrivingLogo.png"
                alt="Public Driving Management System"
                width={48}
                height={48}
                priority
                className="object-contain h-auto w-auto"
              />

              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-bold text-blue-700 text-lg">PDMS</span>
                <span className="text-xs text-gray-600">
                  Public Driving Management System
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pages/inquery"
              className="lg:inline-flex items-center justify-center px-3 py-[6px] text-base transition-all duration-200 hover:bg-gray-700 hover:text-white text-white bg-gray-600 rounded"
            >
              Inquiries ?
            </Link>
            <a
              href="/pages/login-page"
              className="lg:inline-flex items-center justify-center px-3 py-[6px] text-base transition-all duration-200 hover:bg-blue-700 hover:text-white text-white bg-blue-600 rounded"
              role="button"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Nav;
