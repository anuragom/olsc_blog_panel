"use client";

// important if using app dir or client hooks

import BlogEditor from "@/templates/BlogEditor";
import Footer from "@/templates/Footer";
import Navbar from "@/templates/Navbar";
import { useRouter } from "next/router";

type WebsiteType = 'omlogistics' | 'sanjvik';

export default function BlogEditorPage() {
  const router = useRouter();
    const { website } = router.query;

    const currentWebsite = Array.isArray(website) 
    ? website[0]
    : website;  

  if (!currentWebsite) {
      return (
          <div className="mt-20 text-center text-red-600">Error: Website parameter is missing or invalid.</div>
      );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mt-24 w-full flex-1 p-0">
        <BlogEditor website={currentWebsite as WebsiteType} />
      </main>
      <Footer />
    </div>
  );
}
