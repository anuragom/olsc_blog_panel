import Head from "next/head";
import React, { useEffect, useMemo, useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { GrInspect } from "react-icons/gr";
import axiosInstance from "@/utils/axiosInstance";
import type { Block } from "../types";
import Image from "next/image";

interface BlogPreviewProps {
  blogId?: string;
  title: string;
  summary: string;
  tags: string;
  categories: string;
  estimatedReadTime: string;
  author: string;
  createdAt: string;
  coverPreview: string | null;
  blocks: Block[];
  slug: string;
  metaTitle: string;
  setMetaTitle?: (_v: string) => void;
  metaDescription: string;
  setMetaDescription?: (_v: string) => void;
  website?: string;
}

interface RecentBlog {
  _id: string;
  title: string;
  coverImage: string;
  author: { fullName: string };
  createdAt: string;
  slug: string;
}

function FAQItem({ faq }: { faq: { question: string; answer: string } }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-lg border bg-gray-50 mb-2">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-3 font-semibold text-left">
        {faq.question}
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="px-3 pb-3 text-gray-700">{faq.answer}</p>}
    </div>
  );
}

export default function BlogPreview({
  blogId, title, categories, author, createdAt, coverPreview, estimatedReadTime, blocks, metaTitle, metaDescription, website,
}: BlogPreviewProps) {
  // const [activeSection] = useState<string>("");
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://blogspaneluat.omlogistics.co.in/api";

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  };

  const sectionIndex = useMemo(() =>
    blocks.filter((b) => b.type === "heading").map((b) => ({ id: b.id, text: b.data.text || "", level: b.data.level || 1 })),
    [blocks]
  );

  function enhanceLinks(html: string) {
    if (!html) return "";
    const container = typeof document !== "undefined" ? document.createElement("div") : null;
    if (!container) return html;
    container.innerHTML = html;
    container.querySelectorAll("a").forEach((link) => {
      link.classList.add("text-blue-600", "hover:underline");
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
    return container.innerHTML;
  }

  useEffect(() => {
    const progressBar = document.getElementById("scroll-progress");
    const handleScroll = () => {
      const docHeight = document.body.scrollHeight - window.innerHeight;
      if (progressBar) progressBar.style.width = `${(window.scrollY / docHeight) * 100}%`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!website) return;
    axiosInstance.get(`${baseUrl}/blogs?page=1&limit=4&sortBy=createdAt&sortOrder=desc&website=${website}`)
      .then(res => setRecentBlogs(res.data.data))
      .catch(err => console.error(err));
  }, [baseUrl, website]);

  function getYouTubeEmbedUrl(url?: string): string {
    if (!url) return "";
    try {
      const parsedUrl = new URL(url);
      const videoId = parsedUrl.hostname.includes("youtu.be") ? parsedUrl.pathname.split("/").pop() : parsedUrl.searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    } catch { return url; }
  }

  let imageIndex = 0;

  return (
    <div className="w-full">
      <Head>
        <title>{metaTitle || title}</title>
        <meta name="description" content={metaDescription} />
      </Head>

      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-gray-200">
        <div id="scroll-progress" className="h-1 w-0 bg-red-600 transition-[width] duration-150 ease-out"></div>
      </div>

      <div className="relative flex w-full flex-col xl:flex-row bg-white font-sans text-gray-800">
        {sectionIndex.length > 0 && (
          <aside className="sticky hidden xl:block w-[280px] shrink-0 p-4 border-r border-gray-100 h-screen top-0 overflow-y-auto bg-gray-50/50">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#074B83] mb-4 mt-2">Table Of Contents</h3>
            <ul className="space-y-2 text-sm">
              {sectionIndex.map((sec) => (
                <li key={sec.id} className="hover:text-red-500 cursor-pointer transition-colors" style={{ marginLeft: `${(sec.level - 1) * 12}px` }}>
                  • {sec.text}
                </li>
              ))}
            </ul>
          </aside>
        )}

        <main className="mx-auto w-full max-w-6xl flex-1 px-3 sm:px-0 lg:px-8 space-y-4 py-10">
          {title && (
            <h1 className="mb-2 text-5xl font-bold leading-snug tracking-tight text-[#074B83] md:text-6xl">
              {title}
            </h1>
          )}

          {author && (
            <div className="mb-6 flex items-center justify-between text-sm tracking-wide text-gray-700">
              <p>
                By <span className="font-medium text-[#EE222F]">{author}</span>
              </p>
              {estimatedReadTime && (
                <div className="flex flex-row items-center">
                  <GrInspect className="mr-3 text-2xl text-[#074B83]" />
                  <p className="flex items-center gap-1">
                    {estimatedReadTime} min read
                  </p>
                </div>
              )}
            </div>
          )}

          {categories && (
            <div className="mb-6 flex items-center justify-between text-sm tracking-wide text-gray-700">
              <p>
                Categories :{" "}
                <span className="font-medium text-[#EE222F]">{categories}</span>
              </p>
              {createdAt && (
                <div className="flex flex-row items-center">
                  <CiCalendarDate className="mr-3 text-2xl text-[#074B83]" />
                  <p className="flex items-center gap-1">{formatDate(createdAt)}</p>
                </div>
              )}
            </div>
          )}
          {coverPreview && (
            <div className="relative mb-8 w-full h-[450px] overflow-hidden rounded-3xl shadow-md">
              <Image
                src={`${baseUrl}/blogs/${blogId}/cover`}
                alt="Cover"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <div className="space-y-8 rounded-3xl bg-white p-4 sm:p-0 md:p-2 lg:p-4 shadow-lg">
            {blocks.map((block) => (
              <div key={block.id} id={block.id} className="scroll-mt-28">
                {block.type === "heading" && (
                  <>
                    {block.data.level === 1 ? (
                      <h1 className="mb-4 mt-8 border-b-2 border-[#EE222F]/40 pb-2 text-4xl font-bold">
                        {block.data.text}
                      </h1>
                    ) : block.data.level === 2 ? (
                      <h2 className="mb-3 mt-6 text-3xl font-bold">
                        {block.data.text}
                      </h2>
                    ) : block.data.level === 3 ? (
                      <h3 className="mb-3 mt-6 text-2xl font-bold">
                        {block.data.text}
                      </h3>
                    ) : (
                      <h4 className="mb-2 mt-4 text-xl font-bold">
                        {block.data.text}
                      </h4>
                    )}
                  </>
                )}

                {block.type === "table" && (
                  <table className="my-4 w-full table-auto border-collapse">
                    <tbody>
                      {block.data.rows?.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.cells.map((cell, cIdx) => (
                            <td key={cIdx} className="border p-2">
                              {cell.text}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {block.type === "faq" && (
                  <div className="my-4 space-y-2">
                    <h2 id="faqs" className="mb-4 mt-8 text-2xl font-bold text-red-500">
                      FAQ's
                    </h2>

                    {block.data.faqs?.map((faq, idx) => (
                      <FAQItem key={idx} faq={faq} />
                    ))}
                  </div>
                )}


                {block.type === "paragraph" && (
                  <div
                    className="prose prose-sm sm:prose-base max-w-full break-words text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: enhanceLinks(block.data.text ?? ""),
                    }}
                  />
                )}

                {/* Quote */}
                {block.type === "quote" && (
                  <blockquote className="rounded-r border-l-4 border-[#EE222F]/60 bg-[#EE222F]/5 p-3 pl-4 italic text-gray-700">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: enhanceLinks(block.data.text ?? ""),
                      }}
                    />
                  </blockquote>
                )}

                {block.type === "code" && (
                  <pre className="overflow-x-auto rounded-xl bg-[#074B83] p-4 font-mono text-sm text-gray-100">
                    {block.data.text}
                  </pre>
                )}

                {block.type === "list" &&
                  (block.data.style === "unordered" ? (
                    <ul className="ml-6 list-disc space-y-1">
                      {block.data.items?.map((i: string, idx: number) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  ) : (
                    <ol className="ml-6 list-decimal space-y-1">
                      {block.data.items?.map((i: string, idx: number) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ol>
                  ))}

                {block.type === "image" && (() => {
                  const currentIndex = imageIndex++;
                  return (
                    <div className="relative h-[400px] w-full my-6">
                      <Image
                        src={`${baseUrl}/blogs/${blogId}/image/${currentIndex}`}
                        alt={block.data.caption ?? `Image ${currentIndex + 1}`}
                        fill
                        className="rounded-2xl object-cover shadow transition-transform duration-300 hover:scale-[1.02]"
                        unoptimized
                      />
                      {block.data.caption && (
                        <figcaption className="mt-2 text-center text-sm italic text-gray-500">
                          {block.data.caption}
                        </figcaption>
                      )}
                    </div>
                  );
                })()}

                {block.type === "video" && (
                  <div className="my-6">
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        className="h-[400px] w-full rounded-2xl shadow"
                        src={getYouTubeEmbedUrl(block?.data?.url)}
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </main>

        <aside className="sticky hidden xl:block w-[320px] shrink-0 p-6 border-l border-gray-100 h-screen top-0 overflow-y-auto bg-gray-50/50">
          <h3 className="text-lg font-bold text-red-600 mb-6">Recent Posts</h3>
          <div className="space-y-6">
            {recentBlogs.map((blog) => (
              <div key={blog._id} className="group cursor-pointer border-b pb-4 last:border-0" onClick={() => window.location.href = `/blog/${blog.slug}`}>
                <div className="relative h-40 w-full mb-2 rounded-xl overflow-hidden">
                  <Image src={`${baseUrl}/blogs/${blog._id}/cover`} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized alt="" />
                </div>
                <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">{blog.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{formatDate(blog.createdAt)}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}