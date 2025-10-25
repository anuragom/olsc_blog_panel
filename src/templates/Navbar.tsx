"use client";

import Image from "next/image";
import type { FC } from "react";
import {
  FaBars,
  FaChevronDown,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// ✅ Import images directly from src/utils/images
import callIcon from "@/utils/images/call.png";
import emailIcon from "@/utils/images/email.png";
import logo from "@/utils/images/supply chain logo.png";

import { useAuth } from "../utils/AuthContext";

const Navbar: FC = () => {
  const { logout } = useAuth();
  // Static UI only, no functionality or routing
  const navItems = [
    { name: "About Us" },
    { name: "Our Services" },
    { name: "Industries We Serve" },
    { name: "Retail Express" },
    { name: "ESG" },
    { name: "Media Room" },
    { name: "Join Us" },
  ];

  return (
    <div className="mb-12 w-full select-none font-sans">
      {/* Top Bar */}
      <div className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b-2 border-white bg-[#0D5BAA] px-4 py-2 text-sm text-white shadow-md md:px-10">
        <div className="ml-4 flex items-center gap-4 md:ml-16">
          <div className="flex cursor-not-allowed items-center gap-2 opacity-90">
            <Image src={callIcon} alt="Phone" width={16} height={16} />
            <span className="font-roboto text-sm font-normal text-white md:text-base">
              +91 7669-005-500
            </span>
          </div>
          <div className="flex cursor-not-allowed items-center gap-2 opacity-90">
            <Image src={emailIcon} alt="Email" width={16} height={16} />
            <span className="font-roboto text-sm font-normal text-white md:text-base">
              omgroup@olsc.in
            </span>
          </div>
        </div>
        <div className="mr-4 hidden gap-3 md:mr-16 md:flex">
          <span className="cursor-not-allowed hover:text-gray-300">
            <FaFacebookF />
          </span>
          <span className="cursor-not-allowed hover:text-gray-300">
            <FaWhatsapp />
          </span>
          <span className="cursor-not-allowed hover:text-gray-300">
            <FaLinkedin />
          </span>
          <span className="cursor-not-allowed hover:text-gray-300">
            <FaXTwitter />
          </span>
          <span className="cursor-not-allowed hover:text-gray-300">
            <FaInstagram />
          </span>
          <span className="cursor-not-allowed hover:text-gray-300">
            <FaYoutube />
          </span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="fixed left-0 top-[41px] z-40 flex w-full items-center justify-between bg-white px-6 py-5 shadow-md md:px-12">
        <div className="shrink-0">
          <div className="cursor-not-allowed">
            <Image
              src={logo}
              alt="Logo"
              width={200}
              height={90}
              className="h-auto w-[180px] md:w-[200px]"
            />
          </div>
        </div>

        {/* Nav Items */}
        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="flex items-center gap-8 xl:gap-10">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="group relative cursor-not-allowed opacity-90"
              >
                <button
                  className="font-roboto flex items-center gap-1 whitespace-nowrap text-base font-normal text-[#001f39] xl:text-lg"
                  disabled
                >
                  {item.name}
                  {(item.name === "About Us" ||
                    item.name === "Our Services" ||
                    item.name === "Industries We Serve" ||
                    item.name === "Media Room" ||
                    item.name === "Join Us") && (
                    <FaChevronDown className="text-xs" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Login */}
        <div className="ml-4 hidden shrink-0 items-center gap-3 lg:flex">
          <button
            className="font-roboto cursor-not-allowed whitespace-nowrap rounded border border-[#e11f26] px-4 py-3 text-base font-medium text-[#e11f26] opacity-90 transition-colors hover:bg-[#e11f26] hover:text-white xl:px-5 xl:text-lg"
            disabled
          >
            Contact Us
          </button>
          <button
            onClick={logout}
            className="font-roboto whitespace-nowrap rounded border border-[#e11f26] px-4 py-3 text-base font-medium text-[#e11f26] opacity-90 transition-colors hover:bg-[#e11f26] hover:text-white xl:px-5 xl:text-lg"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button (static) */}
        <button
          className="cursor-not-allowed p-2 text-[#001f39] opacity-60 lg:hidden"
          disabled
        >
          <FaBars size={28} />
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
