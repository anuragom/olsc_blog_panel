import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import BlogEditor from "@/templates/BlogEditor";
import Footer from "@/templates/Footer";
import Navbar from "@/templates/Navbar";
import type { Block } from "@/types";
import axiosInstance from "@/utils/axiosInstance";

export default function EditBlogPage() {
  const router = useRouter();
  const { slug,website } = router.query;

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<{
    _id: string;
    title: string;
    summary: string;
    tags: string;
    categories: string;
    author: string;
    createdAt: string;
    estimatedReadTime: string;
    coverPreview: string | null;
    blocks: Block[];
    slug: string;
    metaTitle: string;
    metaDescription: string;
    website: string;
    coverImageAlt: string;
  } | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://olscpanel.omlogistics.co.in/api";
  const currentWebsite = Array.isArray(website) ? website[0] : website; 
  

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    axiosInstance
      .get(`${baseUrl}/blogs/slug/${slug}`)
      .then((res) => {
        const blog = res.data;
        const normalizedBlocks = (blog.blocks || []).map((b: any) => ({
          id: b.id ?? uuidv4(),
          ...b,
        }));

        setInitialData({
          _id: blog._id,
          title: blog.title,
          summary: blog.summary || "",
          tags: blog.tags.join(", "),
          categories: blog.categories.join(", "),
          author: blog.author.fullName || "",
          createdAt: blog.createdAt?.toString() || "",
          estimatedReadTime: blog.estimatedReadTime?.toString() || "",
          coverPreview: blog.coverImage || null,
          blocks: normalizedBlocks,
          slug: blog.slug,
          metaTitle: blog.metaTitle,
          metaDescription: blog.metaDescription,
          website: blog.website || currentWebsite,
          coverImageAlt: blog?.coverImage?.alt || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch blog:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading || !initialData)
    return <p className="mt-20 text-center">Loading blog...</p>;

  if (!currentWebsite) 
     return <p className="mt-20 text-center text-red-600">Error: Website context missing for editing.</p>;

  return (
    <>
      <Navbar />
      <div className="mt-36 w-full flex-1 p-0">
        <BlogEditor
          blogId={initialData._id}
          initialTitle={initialData.title}
          initialSummary={initialData.summary}
          initialTags={initialData.tags}
          initialCategories={initialData.categories}
          initialAuthor={initialData.author}
          initialCreatedAt={initialData.createdAt}
          initialEstimatedReadTime={initialData.estimatedReadTime}
          initialCoverPreview={initialData.coverPreview}
          initialBlocks={initialData.blocks}
          initialSlug={Array.isArray(slug) ? slug[0] : slug}
          initialMetaTitle={initialData.metaTitle}
          initialMetaDescription={initialData.metaDescription}
          website={currentWebsite }
          initialCoverImageAlt={initialData?.coverImageAlt || ""}
        />
      </div>
      <Footer />
    </>
  );
}
