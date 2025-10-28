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
  const { slug } = router.query;

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<{
    _id: string;
    title: string;
    summary: string;
    tags: string;
    categories: string;
    author: string;
    publishedOn: string;
    estimatedReadTime: string;
    coverPreview: string | null;
    blocks: Block[];
    slug: string;
    metaTitle: string;
    metaDescription: string;
  } | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    axiosInstance
      .get(`http://localhost:5000/api/blogs/slug/${slug}`)
      .then((res) => {
        const blog = res.data;
        console.log("blog=================",blog);
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
          publishedOn: blog.publishedOn || "",
          estimatedReadTime: blog.estimatedReadTime?.toString() || "",
          coverPreview: blog.coverImage || null,
          blocks: normalizedBlocks,
          slug: blog.slug,
          metaTitle: blog.metaTitle,
          metaDescription: blog.metaDescription,
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

  return (
    <>
      <Navbar />
      <div className="mt-36 w-full flex-1 p-6">
        <BlogEditor
          blogId={initialData._id}
          initialTitle={initialData.title}
          initialSummary={initialData.summary}
          initialTags={initialData.tags}
          initialCategories={initialData.categories}
          initialAuthor={initialData.author}
          initialPublishedOn={initialData.publishedOn}
          initialEstimatedReadTime={initialData.estimatedReadTime}
          initialCoverPreview={initialData.coverPreview}
          initialBlocks={initialData.blocks}
          initialSlug={Array.isArray(slug) ? slug[0] : slug}
          initialMetaTitle={initialData.metaTitle}
          initialMetaDescription={initialData.metaDescription}
        />
      </div>
      <Footer />
    </>
  );
}
