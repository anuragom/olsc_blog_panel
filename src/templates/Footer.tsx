"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import appStore from "@/utils/images/appstore.png";
import truckGif from "@/utils/images/BrowserPreview_tmp.gif";
import airplane from "@/utils/images/flight 1.svg";
import footerBg from "@/utils/images/fotter.svg";
import googlePlay from "@/utils/images/googleplay.png";
import iso1 from "@/utils/images/Group 48096312 (1).svg";
import iso2 from "@/utils/images/Group 48096313 (1).svg";
import iso3 from "@/utils/images/Group 48096378 (1).svg";
// ✅ Import images from utils/images
import logo from "@/utils/images/logoWithotBg.png";
import qrCode from "@/utils/images/onelinkto_ydtysu.svg";
import roadBg from "@/utils/images/road.svg";

const Footer = () => {
  const socialLinks = {
    instagram: "https://www.instagram.com/omlogisticssupplychainofficial/",
    facebook: "https://www.facebook.com/OmLogisticsOfficial",
    linkedin: "https://www.linkedin.com/company/om-logistics-ltd/",
    twitter: "https://twitter.com/OmLogisticsLtd",
    youtube: "https://www.youtube.com/@omlogisticssupplychain",
  };

  const appDownloadLink =
    "https://apps.apple.com/in/app/om-customer-app/id6720720142";
  const appDownloadLinkPlayStore =
    "https://play.google.com/store/apps/details?id=com.omlogistics.tracker";

  const aboutUsLinks = [
    { text: "Our Growth Story", href: "/about-us/our-growth-story" },
    { text: "Core Team", href: "/about-us/core-team" },
    {
      text: "Vision, Mission and Our Values",
      href: "/about-us/vision-mission-values",
    },
    { text: "Retail Express", href: "/retail-express" },
    { text: "ESG", href: "/esg" },
    { text: "Contact Us", href: "/contact" },
  ];

  const servicesLinks = [
    { text: "3PL Services", href: "/our-services/3pl-services" },
    {
      text: "Express - Full Truck Load",
      href: "/our-services/express/full-truck-load",
    },
    {
      text: "Express - Part Truck Load",
      href: "/our-services/express/part-truck-load",
    },
    { text: "Speed Trucking", href: "/our-services/speed-trucking" },
    { text: "Air Services", href: "/our-services/air-services" },
    { text: "Rail Services", href: "/our-services/rail-services" },
    {
      text: "Warehousing Services",
      href: "/our-services/warehousing-services",
    },
  ];

  const industriesLinks = [
    {
      text: "Automotive & Engineering",
      href: "/industries/automotive-engineering",
    },
    { text: "Retail & Fashion", href: "/industries/retail-fashion" },
    {
      text: "IT & Customer Electronics",
      href: "/industries/it-consumer-electronics",
    },
    { text: "Books & Publishing", href: "/industries/books-publishing" },
    { text: "FMCG", href: "/industries/fmcg" },
    { text: "Projects", href: "/industries/projects" },
    {
      text: "Healthcare & Pharmaceuticals",
      href: "/industries/healthcare-pharmaceuticals",
    },
  ];

  const joinUsLinks = [
    { text: "Om Institute", href: "/join-us/om-institute" },
    { text: "Franchise", href: "/join-us/franchise" },
    { text: "Career", href: "/join-us/careers" },
    { text: "Retail Partner", href: "/join-us/retail-partner" },
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-[#0D5BAA] py-24 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-5 md:gap-8 md:text-left">
          {/* Logo & Info */}
          <div className="flex flex-col items-center space-y-4 md:items-start md:space-y-6">
            <Link
              href="/"
              className="relative ml-8 h-16 w-48 md:ml-0 md:h-20 md:w-64"
            >
              <Image
                src={logo}
                alt="Om Logistics Supply Chain Pvt. Ltd."
                fill
                className="object-contain object-left"
              />
            </Link>
            <div className="font-roboto text-base font-bold leading-tight text-white">
              Om Logistics Supply Chain Pvt. Ltd.
            </div>
            <p className="font-roboto max-w-xs text-sm font-medium opacity-80">
              130, Transport Centre, Punjabi Bagh, New Delhi -110035
            </p>

            <div className="flex w-full flex-col items-center space-y-4 md:items-start">
              <div className="flex items-center justify-center gap-3 md:gap-4">
                <Image
                  src={iso1}
                  alt="ISO 1"
                  width={48}
                  height={48}
                  className="rounded-full transition-all hover:opacity-80"
                />
                <Image
                  src={iso2}
                  alt="ISO 2"
                  width={48}
                  height={48}
                  className="rounded-full transition-all hover:opacity-80"
                />
                <Image
                  src={iso3}
                  alt="ISO 3"
                  width={44}
                  height={44}
                  className="rounded-full transition-all hover:opacity-80"
                />
              </div>

              <h3 className="font-roboto text-base font-bold">Follow us on</h3>
              <div className="flex items-center justify-center gap-3 md:gap-4">
                <Link
                  href={socialLinks.facebook}
                  target="_blank"
                  className="flex size-8 items-center justify-center rounded-full bg-white bg-opacity-20 transition-all hover:bg-opacity-30"
                >
                  <FaFacebook className="text-lg text-white" />
                </Link>
                <Link
                  href={socialLinks.instagram}
                  target="_blank"
                  className="flex size-8 items-center justify-center rounded-full bg-white bg-opacity-20 transition-all hover:bg-opacity-30"
                >
                  <FaInstagram className="text-lg text-white" />
                </Link>
                <Link
                  href={socialLinks.twitter}
                  target="_blank"
                  className="flex size-8 items-center justify-center rounded-full bg-white bg-opacity-20 transition-all hover:bg-opacity-30"
                >
                  <FaXTwitter className="text-lg text-white" />
                </Link>
                <Link
                  href={socialLinks.linkedin}
                  target="_blank"
                  className="flex size-8 items-center justify-center rounded-full bg-white bg-opacity-20 transition-all hover:bg-opacity-30"
                >
                  <FaLinkedin className="text-lg text-white" />
                </Link>
                <Link
                  href={socialLinks.youtube}
                  target="_blank"
                  className="flex size-8 items-center justify-center rounded-full bg-white bg-opacity-20 transition-all hover:bg-opacity-30"
                >
                  <FaYoutube className="text-lg text-white" />
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          <div className="space-y-2 md:space-y-4">
            <h3 className="font-roboto text-base font-bold opacity-90">
              About Us
            </h3>
            <ul className="space-y-2 opacity-80">
              {aboutUsLinks.map((item) => (
                <li key={item.text}>
                  <Link
                    href={item.href}
                    className="font-roboto text-sm font-medium hover:underline"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 md:space-y-4">
            <h3 className="font-roboto text-base font-bold">Our Services</h3>
            <ul className="space-y-2 opacity-80">
              {servicesLinks.map((item) => (
                <li key={item.text}>
                  <Link
                    href={item.href}
                    className="font-roboto text-sm font-medium hover:underline"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 md:space-y-4">
            <h3 className="font-roboto text-base font-bold">
              Industry We Serve
            </h3>
            <ul className="space-y-2 opacity-80">
              {industriesLinks.map((item) => (
                <li key={item.text}>
                  <Link
                    href={item.href}
                    className="font-roboto text-sm font-medium hover:underline"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center space-y-4 md:items-start">
            <div className="w-full">
              <h3 className="font-roboto text-base font-bold">Join Us</h3>
              <ul className="mt-4 space-y-2 opacity-80">
                {joinUsLinks.map((item) => (
                  <li key={item.text}>
                    <Link
                      href={item.href}
                      className="font-roboto text-sm font-medium hover:underline"
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex w-full flex-col items-center pt-2 md:items-start md:pt-4">
              <h3 className="font-roboto text-base font-bold">
                Download our app now!
              </h3>
              <div className="mt-2 flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-start">
                <Image
                  src={qrCode}
                  alt="QR Code for App Download"
                  width={80}
                  height={80}
                  className="size-16 md:size-20"
                />
                <div className="flex flex-col gap-2">
                  <Link
                    href={appDownloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={appStore}
                      alt="Download on App Store"
                      width={120}
                      height={40}
                      className="w-28 md:w-32"
                    />
                  </Link>
                  <Link
                    href={appDownloadLinkPlayStore}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={googlePlay}
                      alt="Get it on Google Play"
                      width={120}
                      height={40}
                      className="w-28 md:w-32"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-white border-opacity-10 md:my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0">
          <div className="flex flex-row gap-4 sm:gap-6 md:gap-10">
            <Link
              href="/terms-and-conditions"
              className="font-roboto text-sm font-normal opacity-60 hover:underline"
            >
              Terms and Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="font-roboto text-sm font-normal opacity-60 hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="font-roboto text-center text-sm font-normal opacity-60 md:text-left">
            Om Logistics Supply Chain 2025 – All Rights Reserved
          </p>
        </div>
      </div>

      {/* Animated Footer */}
      <div className="relative h-[220px] w-full overflow-hidden bg-[#0D5BAA]">
        <motion.div
          className="absolute bottom-0 mb-6 flex h-auto w-[200%]"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        >
          <Image
            src={footerBg}
            alt="Background 1"
            width={1600}
            height={220}
            className="w-full object-cover"
          />
          <Image
            src={footerBg}
            alt="Background 1"
            width={1600}
            height={220}
            className="w-full object-cover"
          />
        </motion.div>

        <motion.div
          className="absolute bottom-0 z-10 flex h-auto w-[300%]"
          animate={{ x: ["0%", "-66.67%"] }}
          transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
        >
          <Image
            src={roadBg}
            alt="Background 2"
            width={1600}
            height={220}
            className="w-full object-cover"
          />
          <Image
            src={roadBg}
            alt="Background 2"
            width={1600}
            height={220}
            className="w-full object-cover"
          />
          <Image
            src={roadBg}
            alt="Background 2"
            width={1600}
            height={220}
            className="w-full object-cover"
          />
        </motion.div>

        <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
          <Image
            src={truckGif}
            alt="Truck"
            width={250}
            height={150}
            className="object-contain"
          />
        </div>

        <motion.div
          className="absolute left-3/4 top-5 z-30 sm:left-2/3 md:left-1/2 lg:left-[67rem]"
          animate={{ x: ["-10%", "20%", "0%"] }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        >
          <Image
            src={airplane}
            alt="Airplane"
            width={100}
            height={50}
            className="object-contain"
          />
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
