'use client'; // important if using app dir or client hooks

import BlogEditor from '@/templates/BlogEditor';
import Footer from '@/templates/Footer';
import Navbar from '@/templates/Navbar';

export default function BlogEditorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full p-6 mt-24">
        <BlogEditor />
      </main>
      <Footer />
    </div>
  );
}

