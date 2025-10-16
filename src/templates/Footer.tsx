"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// ✅ Import images from utils/images
import logo from "@/utils/images/logoWithotBg.png";
import qrCode from "@/utils/images/onelinkto_ydtysu.svg";
import appStore from "@/utils/images/appstore.png";
import googlePlay from "@/utils/images/googleplay.png";
import iso1 from "@/utils/images/Group 48096312 (1).svg";
import iso2 from "@/utils/images/Group 48096313 (1).svg";
import iso3 from "@/utils/images/Group 48096378 (1).svg";
import footerBg from "@/utils/images/fotter.svg";
import roadBg from "@/utils/images/road.svg";
import truckGif from "@/utils/images/BrowserPreview_tmp.gif";
import airplane from "@/utils/images/flight 1.svg";

const Footer = () => {
  const socialLinks = {
    instagram: "https://www.instagram.com/omlogisticssupplychainofficial/",
    facebook: "https://www.facebook.com/OmLogisticsOfficial",
    linkedin: "https://www.linkedin.com/company/om-logistics-ltd/",
    twitter: "https://twitter.com/OmLogisticsLtd",
    youtube: "https://www.youtube.com/@omlogisticssupplychain",
  };

  const appDownloadLink = "https://apps.apple.com/in/app/om-customer-app/id6720720142";
  const appDownloadLinkPlayStore = "https://play.google.com/store/apps/details?id=com.omlogistics.tracker";

  const aboutUsLinks = [
    { text: "Our Growth Story", href: "/about-us/our-growth-story" },
    { text: "Core Team", href: "/about-us/core-team" },
    { text: "Vision, Mission and Our Values", href: "/about-us/vision-mission-values" },
    { text: "Retail Express", href: "/retail-express" },
    { text: "ESG", href: "/esg" },
    { text: "Contact Us", href: "/contact" },
  ];

  const servicesLinks = [
    { text: "3PL Services", href: "/our-services/3pl-services" },
    { text: "Express - Full Truck Load", href: "/our-services/express/full-truck-load" },
    { text: "Express - Part Truck Load", href: "/our-services/express/part-truck-load" },
    { text: "Speed Trucking", href: "/our-services/speed-trucking" },
    { text: "Air Services", href: "/our-services/air-services" },
    { text: "Rail Services", href: "/our-services/rail-services" },
    { text: "Warehousing Services", href: "/our-services/warehousing-services" },
  ];

  const industriesLinks = [
    { text: "Automotive & Engineering", href: "/industries/automotive-engineering" },
    { text: "Retail & Fashion", href: "/industries/retail-fashion" },
    { text: "IT & Customer Electronics", href: "/industries/it-consumer-electronics" },
    { text: "Books & Publishing", href: "/industries/books-publishing" },
    { text: "FMCG", href: "/industries/fmcg" },
    { text: "Projects", href: "/industries/projects" },
    { text: "Healthcare & Pharmaceuticals", href: "/industries/healthcare-pharmaceuticals" },
  ];

  const joinUsLinks = [
    { text: "Om Institute", href: "/join-us/om-institute" },
    { text: "Franchise", href: "/join-us/franchise" },
    { text: "Career", href: "/join-us/careers" },
    { text: "Retail Partner", href: "/join-us/retail-partner" },
  ];

  const mediaLinks = [
    { text: "Awards & Achievements", href: "/media-room/awards-achievements" },
    { text: "Corporate Brochure", href: "/media-room/corporate-brochure" },
    { text: "Events & Activities", href: "/media-room/events-activities" },
    { text: "Media Releases", href: "/media-room/media-releases" },
    { text: "Blogs", href: "/media-room/blogs" },
  ];

  return (
    <footer className="w-full relative bg-[#0D5BAA] text-white overflow-hidden py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 text-center md:text-left">
          {/* Logo & Info */}
          <div className="flex flex-col items-center md:items-start space-y-4 md:space-y-6">
            <Link href="/" className="w-48 md:w-64 h-16 md:h-20 relative ml-8 md:ml-0">
              <Image
                src={logo}
                alt="Om Logistics Supply Chain Pvt. Ltd."
                fill
                className="object-contain object-left"
              />
            </Link>
            <div className="text-white text-base font-bold font-roboto leading-tight">
              Om Logistics Supply Chain Pvt. Ltd.
            </div>
            <p className="opacity-80 text-sm font-medium font-roboto max-w-xs">
              130, Transport Centre, Punjabi Bagh, New Delhi -110035
            </p>

            <div className="flex flex-col items-center md:items-start space-y-4 w-full">
              <div className="flex justify-center items-center gap-3 md:gap-4">
                <Image src={iso1} alt="ISO 1" width={48} height={48} className="rounded-full hover:opacity-80 transition-all" />
                <Image src={iso2} alt="ISO 2" width={48} height={48} className="rounded-full hover:opacity-80 transition-all" />
                <Image src={iso3} alt="ISO 3" width={44} height={44} className="rounded-full hover:opacity-80 transition-all" />
              </div>

              <h3 className="text-base font-bold font-roboto">Follow us on</h3>
              <div className="flex justify-center items-center gap-3 md:gap-4">
                <Link href={socialLinks.facebook} target="_blank" className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                  <FaFacebook className="text-white text-lg" />
                </Link>
                <Link href={socialLinks.instagram} target="_blank" className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                  <FaInstagram className="text-white text-lg" />
                </Link>
                <Link href={socialLinks.twitter} target="_blank" className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                  <FaXTwitter className="text-white text-lg" />
                </Link>
                <Link href={socialLinks.linkedin} target="_blank" className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                  <FaLinkedin className="text-white text-lg" />
                </Link>
                <Link href={socialLinks.youtube} target="_blank" className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                  <FaYoutube className="text-white text-lg" />
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          <div className="space-y-2 md:space-y-4">
            <h3 className="text-base font-bold font-roboto opacity-90">About Us</h3>
            <ul className="space-y-2 opacity-80">
              {aboutUsLinks.map(item => (
                <li key={item.text}>
                  <Link href={item.href} className="hover:underline text-sm font-medium font-roboto">{item.text}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 md:space-y-4">
            <h3 className="text-base font-bold font-roboto">Our Services</h3>
            <ul className="space-y-2 opacity-80">
              {servicesLinks.map(item => (
                <li key={item.text}>
                  <Link href={item.href} className="hover:underline text-sm font-medium font-roboto">{item.text}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 md:space-y-4">
            <h3 className="text-base font-bold font-roboto">Industry We Serve</h3>
            <ul className="space-y-2 opacity-80">
              {industriesLinks.map(item => (
                <li key={item.text}>
                  <Link href={item.href} className="hover:underline text-sm font-medium font-roboto">{item.text}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 flex flex-col items-center md:items-start">
            <div className="w-full">
              <h3 className="text-base font-bold font-roboto">Join Us</h3>
              <ul className="space-y-2 mt-4 opacity-80">
                {joinUsLinks.map(item => (
                  <li key={item.text}>
                    <Link href={item.href} className="hover:underline text-sm font-medium font-roboto">{item.text}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 md:pt-4 w-full flex flex-col items-center md:items-start">
              <h3 className="text-base font-bold font-roboto">Download our app now!</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 mt-2">
                <Image src={qrCode} alt="QR Code for App Download" width={80} height={80} className="h-16 w-16 md:h-20 md:w-20" />
                <div className="flex flex-col gap-2">
                  <Link href={appDownloadLink} target="_blank" rel="noopener noreferrer">
                    <Image src={appStore} alt="Download on App Store" width={120} height={40} className="w-28 md:w-32" />
                  </Link>
                  <Link href={appDownloadLinkPlayStore} target="_blank" rel="noopener noreferrer">
                    <Image src={googlePlay} alt="Get it on Google Play" width={120} height={40} className="w-28 md:w-32" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white border-opacity-10 my-6 md:my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          <div className="flex flex-row gap-4 sm:gap-6 md:gap-10">
            <Link href="/terms-and-conditions" className="opacity-60 hover:underline text-sm font-normal font-roboto">Terms and Conditions</Link>
            <Link href="/privacy-policy" className="opacity-60 hover:underline text-sm font-normal font-roboto">Privacy Policy</Link>
          </div>
          <p className="opacity-60 text-sm font-normal font-roboto text-center md:text-left">
            Om Logistics Supply Chain 2025 – All Rights Reserved
          </p>
        </div>
      </div>

      {/* Animated Footer */}
      <div className="relative w-full h-[220px] overflow-hidden bg-[#0D5BAA]">
        <motion.div
          className="absolute bottom-0 flex mb-6 w-[200%] h-auto"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        >
          <Image src={footerBg} alt="Background 1" width={1600} height={220} className="object-cover w-full" />
          <Image src={footerBg} alt="Background 1" width={1600} height={220} className="object-cover w-full" />
        </motion.div>

        <motion.div
          className="absolute bottom-0 flex w-[300%] h-auto z-10"
          animate={{ x: ["0%", "-66.67%"] }}
          transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
        >
          <Image src={roadBg} alt="Background 2" width={1600} height={220} className="object-cover w-full" />
          <Image src={roadBg} alt="Background 2" width={1600} height={220} className="object-cover w-full" />
          <Image src={roadBg} alt="Background 2" width={1600} height={220} className="object-cover w-full" />
        </motion.div>

        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20">
          <Image src={truckGif} alt="Truck" width={250} height={150} className="object-contain" />
        </div>

        <motion.div
          className="absolute top-5 left-3/4 sm:left-2/3 md:left-1/2 lg:left-[67rem] z-30"
          animate={{ x: ["-10%", "20%", "0%"] }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        >
          <Image src={airplane} alt="Airplane" width={100} height={50} className="object-contain" />
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
