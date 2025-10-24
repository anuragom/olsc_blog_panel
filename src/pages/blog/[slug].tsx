import BlogEditor from "@/templates/BlogEditor";
import { Block } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import Navbar from "@/templates/Navbar";
import Footer from "@/templates/Footer";
import axiosInstance from "@/utils/axiosInstance";

export default function EditBlogPage() {
    const router = useRouter();
    const { slug } = router.query;

    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState<{
        _id: string
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
        axiosInstance.get(`http://localhost:5000/api/blogs/slug/${slug}`)
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
                    publishedOn: blog.publishedOn || "",
                    estimatedReadTime: blog.estimatedReadTime?.toString() || "",
                    coverPreview: blog.coverImage || null,
                    blocks: normalizedBlocks,
                    slug: blog.slug,
                    metaTitle: blog.metaTitle,
                    metaDescription: blog.metaDescription
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch blog:", err);
                setLoading(false);
            });
    }, [slug]);

    if (loading || !initialData) return <p className="text-center mt-20">Loading blog...</p>;

    return (
        <>
            <Navbar />
            <div className="flex-1 w-full p-6 mt-36">
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
