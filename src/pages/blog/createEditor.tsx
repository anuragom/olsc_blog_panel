"use client";

// important if using app dir or client hooks

import BlogEditor from "@/templates/BlogEditor";
import Footer from "@/templates/Footer";
import Navbar from "@/templates/Navbar";

export default function BlogEditorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mt-24 w-full flex-1 p-6">
        <BlogEditor />
      </main>
      <Footer />
    </div>
  );
}
