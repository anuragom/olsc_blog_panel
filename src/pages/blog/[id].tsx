//first exact 
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { GrInspect } from "react-icons/gr";
import { CiCalendarDate } from "react-icons/ci";
import Navbar from "@/templates/Navbar";
import Footer from "@/templates/Footer";

interface TableRow {
    cells: { text: string }[];
}

interface FAQItem {
    question: string;
    answer: string;
}

interface Block {
    id: string;
    type: string;
    data: {
        text?: string;
        level?: number;
        items?: string[];
        style?: "ordered" | "unordered";
        rows?: TableRow[];
        faqs?: FAQItem[];
        url?: string;
        preview?: string;
        caption?: string;
    };
}

interface Blog {
    _id: string;
    title: string;
    summary: string;
    tags: string[];
    categories: string[];
    estimatedReadTime: number;
    blocks: Block[];
    coverImage: string;
    author: string;
    createdAt: string;
}

interface RecentBlog {
    _id: string;
    title: string;
    coverImage: string;
    author: string;
    createdAt: string;
}

// Helper to slugify IDs
const slugify = (text: string | undefined) =>
    (text || "unknown")        // fallback if undefined
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

export default function BlogPage() {
    const router = useRouter();
    const { id } = router.query;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(() => {
        if (!id) return;
        axios
            .get(`http://localhost:5000/api/blogs/${id}`)
            .then((res) => setBlog(res.data))
            .catch((err) => console.error(err));
    }, [id]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/blogs?page=1&limit=4&sortBy=title&sortOrder=asc")
            .then((res) => setRecentBlogs(res.data.data))
            .catch((err) => console.error(err));
    }, []);

    //   const sectionIndex = useMemo(
    //     () =>
    //       blog?.blocks
    //         .filter((b) => b.type === "heading")
    //         .map((b) => ({
    //           id: slugify(b.data.text || b.id),
    //           text: b.data.text || "",
    //           level: b.data.level || 1,
    //         })) || [],
    //     [blog]
    //   );

    const sectionIndex = useMemo(() => {
        if (!blog?.blocks) return [];

        const seenIds = new Map<string, number>();

        return blog.blocks
            .filter((b) => b.type === "heading")
            .map((b, index) => {
                // 🧹 Clean text: remove HTML tags and trim spaces
                const rawText = b.data.text || "";
                const cleanText = rawText.replace(/<[^>]+>/g, "").trim() || `heading-${index}`;

                const baseId = slugify(cleanText);
                const count = (seenIds.get(baseId) || 0) + 1;
                seenIds.set(baseId, count);

                // ✅ Unique id for duplicate headings
                const uniqueId = count > 1 ? `${baseId}-${count}` : baseId;

                return {
                    id: uniqueId,
                    text: cleanText,
                    level: b.data.level || 1,
                };
            });
    }, [blog]);


    const enhanceLinks = (html: string) => {
        if (!html) return "";
        const container = document.createElement("div");
        container.innerHTML = html;
        container.querySelectorAll("a").forEach((link) => {
            link.classList.add("text-blue-600", "hover:text-blue-800", "hover:underline", "transition-colors");
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
        });
        return container.innerHTML;
    };

    // Scroll progress bar
    useEffect(() => {
        const progressBar = document.getElementById("scroll-progress");
        if (!progressBar) return;
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // IntersectionObserver for active section
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-120px 0px -60% 0px", threshold: 0 } // adjust for sticky header
        );

        sectionIndex.forEach((sec) => {
            const el = document.getElementById(sec.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sectionIndex]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const yOffset = 120;
        const y = el.getBoundingClientRect().top + window.scrollY - yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    if (!blog) return <p className="text-center mt-20">Loading...</p>;

    return (
        <>
            <Navbar />

            <div className="fixed top-[10rem] left-0 w-full h-1 bg-gray-200 z-40">
                <div id="scroll-progress" className="h-1 bg-red-600 w-0 transition-[width] duration-150 ease-out"></div>
            </div>

            <div className="relative mt-44 flex flex-row min-h-screen font-sans bg-gradient-to-b from-[#F9FAFB] to-[#F3F4F6] text-gray-800">
                {/* TOC */}
                {sectionIndex.length > 0 && (
                    <aside className="hidden lg:block w-1/5 px-4 sticky top-[8rem] h-[calc(100vh-8rem)] overflow-y-auto">
                        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm p-4">
                            <h3 className="text-[#074B83] font-semibold mb-3 uppercase tracking-widest text-sm sticky top-0 bg-white/90 backdrop-blur-md py-1 z-10">
                                Contents
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                {sectionIndex.map((sec) => (
                                    <li
                                        key={sec.id}
                                        className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md transition-all ${activeSection === sec.id
                                            ? "bg-[#EE222F]/10 text-[#EE222F] font-medium"
                                            : "hover:text-[#074B83]"
                                            }`}
                                        style={{ marginLeft: `${(sec.level - 1) * 12}px` }}
                                        onClick={() => scrollToSection(sec.id)}
                                    >
                                        <span
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{
                                                backgroundColor:
                                                    activeSection === sec.id ? "#EE222F" : "#074B83",
                                                transition: "background-color 0.2s ease",
                                            }}
                                        ></span>
                                        <span>{sec.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto px-8 py-10 max-w-5xl mx-auto space-y-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-[#074B83] tracking-tight leading-snug mb-2">{blog.title}</h1>
                    <div className="flex justify-between items-center text-gray-700 text-sm tracking-wide mb-6">
                        <p>
                            By <span className="font-medium text-[#EE222F]">{blog.author}</span>
                        </p>
                        <div className="flex flex-row items-center">
                            <GrInspect className="text-[#074B83] mr-3 text-2xl" />
                            <p className="flex items-center gap-1">{blog.estimatedReadTime} min read</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-gray-700 text-sm tracking-wide mb-6">
                        <p>Categories: <span className="font-medium text-[#EE222F]">{blog.categories.join(", ")}</span></p>
                        <div className="flex flex-row items-center">
                            <CiCalendarDate className="text-[#074B83] mr-3 text-2xl" />
                            <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {blog.coverImage && (
                        <div className="relative w-full rounded-3xl overflow-hidden shadow-md mb-8">
                            <img src={blog.coverImage} alt="Cover" className="w-full h-[450px] object-cover" />
                        </div>
                    )}

                    {blog.summary && (
                        <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-6 shadow text-center">
                            <p className="text-lg text-gray-700 italic leading-relaxed">“{blog.summary}”</p>
                        </div>
                    )}

                    {blog.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {blog.tags.map((tag, idx) => (
                                <span key={idx} className="bg-[#074B83]/5 border border-[#074B83]/20 text-[#074B83] px-3 py-1 rounded-full text-sm hover:bg-[#074B83]/10 transition">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="bg-white rounded-3xl shadow-lg p-10 space-y-8">
                        {blog.blocks.map((block) => {
                            const blockId = slugify(block.data.text || block.id);
                            return (
                                <div key={block.id} id={blockId} className="scroll-mt-[120px]">
                                    {block.type === "heading" && (
                                        <>
                                            {block.data.level === 1 ? (
                                                <h1 className="text-3xl font-bold mt-8 mb-4 border-b-2 border-[#EE222F]/40 pb-2">{block.data.text}</h1>
                                            ) : block.data.level === 2 ? (
                                                <h2 className="text-2xl font-semibold mt-6 mb-3 text-[#074B83]">{block.data.text}</h2>
                                            ) : (
                                                <h3 className="text-xl font-medium mt-4 mb-2 text-gray-800">{block.data.text}</h3>
                                            )}
                                        </>
                                    )}
                                    {block.type === "paragraph" && (
                                        <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: enhanceLinks(block.data.text || "") }} />
                                    )}
                                    {block.type === "list" && (
                                        <ul className={`pl-6 space-y-2 ${block.data.style === "ordered" ? "list-decimal" : "list-disc"}`}>
                                            {block.data.items?.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {block.type === "table" && (
                                        <div className="overflow-x-auto">
                                            <table className="border-collapse border border-gray-200 w-full text-left">
                                                <tbody>
                                                    {block.data.rows?.map((row, i) => (
                                                        <tr key={i}>
                                                            {row.cells.map((cell, j) => (
                                                                <td key={j} className="border border-gray-200 px-4 py-2">{cell.text}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {block.type === "image" && block.data.url && (
                                        <div className="my-6 w-full rounded-2xl overflow-hidden shadow-md">
                                            <img src={block.data.url} alt={block.data.caption || "Image"} className="w-full object-cover rounded-2xl" />
                                            {block.data.caption && <p className="text-center text-sm text-gray-500 mt-2">{block.data.caption}</p>}
                                        </div>
                                    )}
                                    {block.type === "faq" && block.data.faqs && (
                                        <div className="space-y-4 mt-6">
                                            {block.data.faqs.map((faq, idx) => (
                                                <div key={idx} className="border border-gray-200 rounded-xl p-4">
                                                    <h4 className="font-semibold text-gray-800">{faq.question}</h4>
                                                    <p className="text-gray-700 mt-2">{faq.answer}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </main>

                {/* Recent Blogs */}
                <aside
                    className="hidden xl:block w-1/4 p-8 border-l border-gray-100 bg-white/70 backdrop-blur-lg shadow-inner sticky top-[6rem] h-[calc(100vh-6rem)] overflow-y-auto"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#074B83 #f1f1f1",
                    }}
                >
                    <style jsx>{`
            aside::-webkit-scrollbar {
              width: 8px;
            }
            aside::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
            }
            aside::-webkit-scrollbar-thumb {
              background-color: #074B83;
              border-radius: 10px;
            }
            aside::-webkit-scrollbar-thumb:hover {
              background-color: #074B83;
            }
          `}</style>
                    <div className="flex flex-row items-center justify-between mb-4">
                        <h3 className="text-[#EE222F] font-semibold text-lg">
                            Recent Blogs
                        </h3>

                        <button
                            onClick={() => (window.location.href = `/`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md"
                        >
                            ✏️ Edit Blog
                        </button>
                    </div>



                    <div className="space-y-4">
                        {recentBlogs.map((blog) => (
                            <div
                                key={blog._id}
                                className="bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer group transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                onClick={() => (window.location.href = `/blog/${blog._id}`)}
                            >
                                <div className="h-32 bg-gray-100 rounded-xl mb-3 overflow-hidden">
                                    <img
                                        src={blog.coverImage}
                                        alt={blog.coverImage}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h4 className="font-semibold text-gray-800 group-hover:text-[#074B83] transition">
                                    {blog.title}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {new Date(blog.createdAt).toLocaleDateString()} • by{" "}
                                    {blog.author}
                                </p>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
            <Footer />
        </>
    );
}
