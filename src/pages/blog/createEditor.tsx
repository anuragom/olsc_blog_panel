"use client";

import BlogEditor from "@/templates/BlogEditor";
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
    <div className="flex flex-col bg-gray-50">
      <main className="mt-2 w-full flex-1 p-0">
        <BlogEditor website={currentWebsite as WebsiteType} />
      </main>
    </div>
  );
}
