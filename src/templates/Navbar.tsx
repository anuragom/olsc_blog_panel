"use client";

import Image from "next/image";
import Link from "next/link";
import { FC, useState, useEffect, useRef } from "react";
import { FaFacebookF, FaWhatsapp, FaLinkedin, FaInstagram, FaYoutube, FaBars, FaTimes, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// ✅ Import images directly from src/utils/images
import callIcon from "@/utils/images/call.png";
import emailIcon from "@/utils/images/email.png";
import logo from "@/utils/images/supply chain logo.png";

interface NavItem {
  name: string;
  path?: string;
  hasNested?: boolean;
  nestedItems?: Array<{ name: string; path: string }>;
}

interface NavItemWithDropdown extends NavItem {
  hasDropdown: true;
  dropdownItems: Array<NavItem>;
}

interface NavItemWithoutDropdown extends NavItem {
  hasDropdown: false;
  path: string;
}

type NavItemType = NavItemWithDropdown | NavItemWithoutDropdown;

const Navbar: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openNestedDropdown, setOpenNestedDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nestedDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const socialLinks = {
    instagram: "https://www.instagram.com/omlogisticssupplychainofficial/",
    facebook: "https://www.facebook.com/OmLogisticsOfficial",
    linkedin: "https://www.linkedin.com/company/om-logistics-ltd/",
    twitter: "https://twitter.com/OmLogisticsLtd",
    youtube: "https://www.youtube.com/@omlogisticssupplychain",
    whatsapp: "https://wa.me/917669005500?text=Thank%20you%20for%20connecting%20with%20OM%20Logistics%20Supply%20Chain%20Management"
  };

  const customerLoginLink = "https://client.omlogistics.co.in";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
        setOpenDropdown(null);
        setOpenNestedDropdown(null);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleDropdownOpen = (item: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(item);
  };

  const handleDropdownClose = (item: string) => {
    dropdownTimeoutRef.current = setTimeout(() => {
      if (openDropdown === item) {
        setOpenDropdown(null);
      }
    }, 500);
  };

  const handleNestedDropdownOpen = (item: string) => {
    if (nestedDropdownTimeoutRef.current) {
      clearTimeout(nestedDropdownTimeoutRef.current);
    }
    setOpenNestedDropdown(item);
  };

  const handleNestedDropdownClose = (item: string) => {
    nestedDropdownTimeoutRef.current = setTimeout(() => {
      if (openNestedDropdown === item) {
        setOpenNestedDropdown(null);
      }
    }, 200);
  };

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    if (nestedDropdownTimeoutRef.current) {
      clearTimeout(nestedDropdownTimeoutRef.current);
    }
  };

  const toggleMobileDropdown = (item: string) => {
    setOpenDropdown(prev => (prev === item ? null : item));
    setOpenNestedDropdown(null);
  };

  const toggleMobileNestedDropdown = (item: string) => {
    setOpenNestedDropdown(prev => (prev === item ? null : item));
  };

  const navItems: NavItemType[] = [
    {
      name: "About Us",
      hasDropdown: true,
      dropdownItems: [
        { name: "Our Growth Story", path: "/about-us/our-growth-story" },
        { name: "Core Team", path: "/about-us/core-team" },
        { name: "Vision, Mission & Our Values", path: "/about-us/vision-mission-values" }
      ]
    },
    {
      name: "Our Services",
      hasDropdown: true,
      dropdownItems: [
        { name: "3PL Services", path: "/our-services/3pl-services" },
        {
          name: "Express",
          hasNested: true,
          nestedItems: [
            { name: "Full Truck Load", path: "/our-services/express/full-truck-load" },
            { name: "Part Truck Load", path: "/our-services/express/part-truck-load" }
          ]
        },
        { name: "Speed Trucking", path: "/our-services/speed-trucking" },
        { name: "Air Services", path: "/our-services/air-services" },
        { name: "Rail Services", path: "/our-services/rail-services" },
        { name: "Warehousing Services", path: "/our-services/warehousing-services" },
      ]
    },
    {
      name: "Industries We Serve",
      hasDropdown: true,
      dropdownItems: [
        { name: "Automotive & Engineering", path: "/industries/automotive-engineering" },
        { name: "Retail & Fashion", path: "/industries/retail-fashion" },
        { name: "IT & Consumer Electronics", path: "/industries/it-consumer-electronics" },
        { name: "Healthcare & Pharmaceuticals", path: "/industries/healthcare-pharmaceuticals" },
        { name: "Books & Publishing", path: "/industries/books-publishing" },
        { name: "FMCG", path: "/industries/fmcg" },
        { name: "Projects", path: "/industries/projects" }
      ]
    },
    {
      name: "Retail Express",
      hasDropdown: false,
      path: "/retail-express"
    },
    {
      name: "ESG",
      hasDropdown: false,
      path: "/esg"
    },
    {
      name: "Media Room",
      hasDropdown: true,
      dropdownItems: [
        { name: "Awards & Achievements", path: "/media-room/awards-achievements" },
        { name: "Corporate Brochure", path: "/media-room/corporate-brochure" },
        { name: "Events & Activities", path: "/media-room/events-activities" },
        { name: "Media Release", path: "/media-room/media-release" },
        { name: "Blogs", path: "/media-room/blogs" },
      ]
    },
    {
      name: "Join Us",
      hasDropdown: true,
      dropdownItems: [
        { name: "Careers", path: "/join-us/careers" },
        { name: "Franchise", path: "/join-us/franchise" },
        { name: "Om Institute", path: "/join-us/om-institute" },
        { name: "Retail Partner", path: "/join-us/retail-partner" }
      ]
    }
  ];

  return (
    <div className="w-full mb-12 font-sans">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full bg-[#0D5BAA] flex items-center justify-between px-4 md:px-10 py-2 text-white text-sm z-50 shadow-md border-b-2 border-white">
        <div className="flex items-center gap-4 ml-4 md:ml-16">
          <a href="tel:+917669005500" className="flex items-center gap-2">
            <Image src={callIcon} alt="Phone" width={16} height={16} />
            <span className="text-white text-sm md:text-base font-normal font-roboto">
              +91 7669-005-500
            </span>
          </a>
          <a href="mailto:omgroup@olsc.in" className="flex items-center gap-2">
            <Image src={emailIcon} alt="Email" width={16} height={16} />
            <span className="text-white text-sm md:text-base font-normal font-roboto">
              omgroup@olsc.in
            </span>
          </a>
        </div>
        <div className="hidden md:flex mr-4 md:mr-16 gap-3">
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300"><FaFacebookF /></a>
          <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300"><FaWhatsapp /></a>
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300"><FaLinkedin /></a>
          <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300"><FaXTwitter /></a>
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300"><FaInstagram /></a>
          <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300"><FaYoutube /></a>
        </div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-[41px] left-0 w-full bg-white shadow-md py-5 px-6 md:px-12 flex items-center justify-between z-40">
        <div className="flex-shrink-0">
          <Link href="/">
            <Image src={logo} alt="Logo" width={200} height={90} className="w-[180px] md:w-[200px] h-auto" />
          </Link>
        </div>

        {/* Nav Items */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="flex items-center gap-8 xl:gap-10">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => handleDropdownOpen(item.name)}
                onMouseLeave={() => handleDropdownClose(item.name)}
              >
                {item.hasDropdown ? (
                  <>
                    <button
                      className="text-[#001f39] text-base xl:text-lg font-normal font-roboto cursor-pointer hover:text-[#074b83] flex items-center gap-1 whitespace-nowrap"
                    >
                      {item.name} <FaChevronDown className="text-xs" />
                    </button>
                    <div
                      className={`absolute bg-white shadow-md py-2 min-w-[220px] z-10 ${openDropdown === item.name ? "block" : "hidden"
                        }`}
                      onMouseEnter={handleDropdownEnter}
                    >
                      {item.dropdownItems.map((dropdownItem, idx) => (
                        <div key={idx} className="relative">
                          {dropdownItem.hasNested ? (
                            <div
                              className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 text-sm text-[#001f39] font-normal font-roboto"
                              onMouseEnter={() => handleNestedDropdownOpen(dropdownItem.name)}
                              onMouseLeave={() => handleNestedDropdownClose(dropdownItem.name)}
                            >
                              <span>{dropdownItem.name}</span>
                              <FaChevronRight className="text-xs" />
                              {openNestedDropdown === dropdownItem.name && (
                                <div
                                  className="absolute left-full top-[-8px] bg-white shadow-md py-2 min-w-[200px] z-20"
                                  onMouseEnter={() => handleNestedDropdownOpen(dropdownItem.name)}
                                  onMouseLeave={() => handleNestedDropdownClose(dropdownItem.name)}
                                >
                                  {dropdownItem.nestedItems?.map((nestedItem, nestedIdx) => (
                                    <Link
                                      key={nestedIdx}
                                      href={nestedItem.path}
                                      className="block px-4 py-2 hover:bg-gray-100 text-sm text-[#001f39] font-normal font-roboto"
                                    >
                                      {nestedItem.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Link
                              href={dropdownItem.path || "#"}
                              className="block px-4 py-2 hover:bg-gray-100 text-sm text-[#001f39] font-normal font-roboto"
                            >
                              {dropdownItem.name}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.path}
                    className="text-[#001f39] text-base xl:text-lg font-normal font-roboto cursor-pointer hover:text-[#074b83] flex items-center gap-1 whitespace-nowrap"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Login */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0 ml-4">
          <Link href="/contact">
            <button className="border border-[#e11f26] text-[#e11f26] text-base xl:text-lg font-medium font-roboto px-4 xl:px-5 py-3 rounded hover:bg-[#e11f26] hover:text-white transition-colors whitespace-nowrap">
              Contact Us
            </button>
          </Link>
          <Link href={customerLoginLink} target="_blank" rel="noopener noreferrer">
            <button className="bg-[#e11f26] text-white text-base xl:text-lg font-medium font-roboto px-4 xl:px-5 py-3 rounded hover:bg-[#063a66] transition-colors whitespace-nowrap">
              Customer Login
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-[#001f39] p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </nav>


      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-white shadow-md fixed top-[112px] left-0 right-0 z-30 max-h-[calc(100vh-112px)] overflow-y-auto"
        >
          <div className="flex flex-col gap-1 p-4">
            {navItems.map((item, index) => (
              <div key={index} className="border-b border-gray-100 last:border-b-0">
                {item.hasDropdown ? (
                  <div className="py-1">
                    <button
                      className="w-full flex justify-between items-center text-[#001f39] text-base font-medium font-roboto cursor-pointer hover:text-[#074b83] py-3 px-2"
                      onClick={() => toggleMobileDropdown(item.name)}
                    >
                      <span>{item.name}</span>
                      <FaChevronDown
                        className={`text-xs transition-transform duration-200 ${openDropdown === item.name ? "transform rotate-180" : ""
                          }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${openDropdown === item.name ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                      <div className="pl-4">
                        {item.dropdownItems.map((dropdownItem, idx) => (
                          <div key={idx} className="py-1">
                            {dropdownItem.hasNested ? (
                              <div>
                                <button
                                  className="w-full flex justify-between items-center text-[#001f39] text-sm font-medium font-roboto cursor-pointer hover:text-[#074b83] py-2 px-4"
                                  onClick={() => toggleMobileNestedDropdown(`${item.name}-${dropdownItem.name}`)}
                                >
                                  <span>{dropdownItem.name}</span>
                                  <FaChevronDown
                                    className={`text-xs transition-transform duration-200 ${openNestedDropdown === `${item.name}-${dropdownItem.name}` ? "transform rotate-180" : ""
                                      }`}
                                  />
                                </button>
                                <div
                                  className={`overflow-hidden transition-all transition-max-height duration-300 ease-in-out ${openNestedDropdown === `${item.name}-${dropdownItem.name}`
                                      ? "max-h-[650px] opacity-100"
                                      : "max-h-0 opacity-0"
                                    }`}
                                  style={{ transitionProperty: "max-height, opacity" }}
                                >
                                  <div className="pl-4">
                                    {dropdownItem.nestedItems?.map((nestedItem, nestedIdx) => (
                                      <Link
                                        key={nestedIdx}
                                        href={nestedItem.path}
                                        className="block py-2 px-4 text-[#001f39] text-sm font-normal font-roboto hover:bg-gray-100 rounded"
                                        onClick={() => {
                                          setMobileMenuOpen(false);
                                          setOpenDropdown(null);
                                          setOpenNestedDropdown(null);
                                        }}
                                      >
                                        {nestedItem.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <Link
                                href={dropdownItem.path || "#"}
                                className="block py-2 px-4 text-[#001f39] text-sm font-normal font-roboto hover:bg-gray-100 rounded"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setOpenDropdown(null);
                                  setOpenNestedDropdown(null);
                                }}
                              >
                                {dropdownItem.name}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className="block text-[#001f39] text-base font-medium font-roboto cursor-pointer hover:text-[#074b83] py-3 px-2 hover:bg-gray-100 rounded"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenDropdown(null);
                      setOpenNestedDropdown(null);
                    }}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 p-4 border-t border-gray-200">
            <Link href="/contact" onClick={() => {
              setMobileMenuOpen(false);
              setOpenDropdown(null);
              setOpenNestedDropdown(null);
            }}>
              <button className="w-full border border-[#e11f26] text-[#e11f26] text-base font-medium font-roboto px-4 py-3 rounded hover:bg-[#e11f26] hover:text-white transition-colors">
                Contact Us
              </button>
            </Link>
            <Link href={customerLoginLink} target="_blank" rel="noopener noreferrer" onClick={() => {
              setMobileMenuOpen(false);
              setOpenDropdown(null);
              setOpenNestedDropdown(null);
            }}>
              <button className="w-full bg-[#074b83] text-white text-base font-medium font-roboto px-4 py-3 rounded hover:bg-[#063a66] transition-colors">
                Customer Login
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
