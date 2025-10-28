// src/templates/BlogPreview.tsx
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
  publishedOn: string;
  coverPreview: string | null;
  blocks: Block[];
  slug: string;
  metaTitle: string;
  setMetaTitle: (_v: string) => void;
  metaDescription: string;
  setMetaDescription: (_v: string) => void;
}

interface RecentBlog {
  _id: string;
  title: string;
  coverImage: string;
  author: {
    fullName: string;
    userName: string;
    profilePic: string;
    employeeId: string;
  };
  createdAt: string;
  slug: string;
}

export default function BlogPreview({
  blogId,
  title,
  summary,
  // tags,
  categories,
  author,
  publishedOn,
  coverPreview,
  estimatedReadTime,
  blocks,
  slug,
  metaTitle,
  // setMetaTitle,
  metaDescription,
  // setMetaDescription
}: BlogPreviewProps) {
  const [activeSection] = useState<string>("");
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
  // Generate section index

  const sectionIndex = useMemo(
    () =>
      blocks
        .filter((b) => b.type === "heading")
        .map((b) => ({
          id: b.id,
          text: b.data.text || "",
          level: b.data.level || 1,
        })),
    [blocks],
  );

  function enhanceLinks(html: string) {
    if (!html) return "";
    const container = document.createElement("div");
    container.innerHTML = html;

    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      link.classList.add(
        "text-blue-600",
        "hover:text-blue-800",
        "hover:underline",
        "transition-colors",
      );
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    return container.innerHTML;
  }

  React.useEffect(() => {
    if (typeof window === "undefined") return; // SSR safety

    const progressBar = document.getElementById("scroll-progress");
    if (!progressBar) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      progressBar.style.width = `${scrollPercent}%`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set initial value

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const res = await axiosInstance.get(
          "http://localhost:5000/api/blogs?page=1&limit=4&sortBy=createdAt&sortOrder=desc",
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        setRecentBlogs(res.data.data);
      } catch (err) {
        console.error("Error fetching recent blogs:", err);
      }
    };

    fetchRecentBlogs();
  }, []);
  let imageIndex = 0;
  console.log("coverPreview---------------------->>>", `http://localhost:5000/api/blogs/${blogId}/cover`)

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>{metaTitle || title}</title>
        <meta name="description" content={metaDescription || summary} />
        <link rel="canonical" href={`https://yourdomain.com/blog/${slug}`} />

        {/* Open Graph */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle || title} />
        <meta property="og:description" content={metaDescription || summary} />
        <meta
          property="og:url"
          content={`https://yourdomain.com/blog/${slug}`}
        />
        <meta property="og:site_name" content="Your Site Name" />
        <meta
          property="article:modified_time"
          content={new Date().toISOString()}
        />
        {coverPreview && <meta property="og:image" content={coverPreview} />}

        {/* Favicon */}
        <link
          rel="icon"
          href="https://yourdomain.com/assets/image/icon/favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="icon"
          href="https://yourdomain.com/assets/image/icon/favicon192X192.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="https://yourdomain.com/assets/image/icon/favicon180X180.png"
          sizes="192x192"
        />

        {/* External CSS */}
        <link
          rel="stylesheet"
          href="https://transafeservices.com/assets/vendor/fontawesome/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://transafeservices.com/assets/vendor/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://transafeservices.com/assets/vendor/owl.carousel.min.css"
        />
        <link
          rel="stylesheet"
          href="https://transafeservices.com/assets/vendor/owl.theme.default.min.css"
        />
        <link
          href="https://unpkg.com/aos@2.3.1/dist/aos.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://transafeservices.com/assets/css/main.css?v=0.0.2"
        />
      </Head>

      <div className="fixed left-0 top-[13.5rem] z-40 h-1 w-full bg-gray-200">
        <div
          id="scroll-progress"
          className="h-1 w-0 bg-red-600 transition-[width] duration-150 ease-out"
        ></div>
      </div>
      <div className="relative flex min-h-screen flex-row bg-gradient-to-b from-[#F9FAFB] to-[#F3F4F6] font-sans text-gray-800">
        {/* Table of Contents */}
        {sectionIndex.length > 0 && (
          <aside
            className="sticky hidden w-1/5 px-4 lg:block"
            style={{
              top: "200px",
              alignSelf: "flex-start",
              height: "calc(100vh - 150px)",
              overflowY: "auto",
            }}
          >
            <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
              <h3 className="sticky top-0 z-10 mb-3 bg-white/90 py-1 text-sm font-semibold uppercase tracking-widest text-[#074B83] backdrop-blur-md">
                Table Of Contents
              </h3>

              <ul className="space-y-2 text-gray-700">
                {sectionIndex.map((sec) => (
                  <li
                    key={sec.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition-all ${activeSection === sec.id ? "" : "hover:text-[#074B83]"
                      }`}
                    style={{ marginLeft: `${(sec.level - 1) * 12}px` }}
                  >
                    <span className="size-2 shrink-0 rounded-full"></span>
                    <span>{sec.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scrollbar Styling */}
            <style jsx>{`
              aside::-webkit-scrollbar {
                width: 8px;
              }
              aside::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
              }
              aside::-webkit-scrollbar-thumb {
                background-color: #074b83;
                border-radius: 10px;
              }
              aside::-webkit-scrollbar-thumb:hover {
                background-color: #074b83;
              }
            `}</style>
          </aside>
        )}

        {/* Main content area */}
        <main className="mx-auto max-w-5xl flex-1 space-y-4 overflow-y-auto px-8 py-10">
          {/* Title */}
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
              {publishedOn && (
                <div className="flex flex-row items-center">
                  <CiCalendarDate className="mr-3 text-2xl text-[#074B83]" />
                  <p className="flex items-center gap-1">{publishedOn}</p>
                </div>
              )}
            </div>
          )}

          {/* Cover Image */}
          {coverPreview && (
            <div className="relative mb-8 w-full h-[450px] overflow-hidden rounded-3xl shadow-md">
              <Image
                // src={coverPreview}
                src={`http://localhost:5000/api/blogs/${blogId}/cover`}
                alt="Cover"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Summary */}
          {summary && (
            <div className="rounded-3xl border border-gray-100 bg-white/80 p-6 text-center shadow backdrop-blur-md">
              <p className="text-lg italic leading-relaxed text-gray-700">
                “{summary}”
              </p>
            </div>
          )}

          {/* Tags */}
          {/* {tags && (
            <div className="flex flex-wrap justify-center gap-2">
              {tags
                .split(",")
                .map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-[#074B83]/5 border border-[#074B83]/20 text-[#074B83] px-3 py-1 rounded-full text-sm hover:bg-[#074B83]/10 transition"
                  >
                    #{tag.trim()}
                  </span>
                ))}
            </div>
          )} */}
          <div className="space-y-8 rounded-3xl bg-white p-10 shadow-lg">
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
                    <h2
                      id="faqs"
                      className="mb-4 mt-8 text-2xl font-bold text-red-500"
                    >
                      FAQ's
                    </h2>
                    {block.data.faqs?.map((faq, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border bg-gray-50 p-3"
                      >
                        <p className="font-semibold">{faq.question}</p>
                        <p className="mt-1 text-gray-700">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

                {block.type === "paragraph" && (
                  <div
                    className="leading-relaxed text-gray-800"
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

                {/* {block.type === "image" && (
      <div className="relative h-[400px] w-full my-6">
        <Image
          src={`http://localhost:5000/api/blogs/${blogId}/image/${blockIndex}`}
          alt={block.data.caption ?? `Image ${blockIndex + 1}`}
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
    )} */}

                {block.type === "image" && (() => {
                  const currentIndex = imageIndex++; // independent counter
                  return (
                    <div className="relative h-[400px] w-full my-6">
                      <Image
                        src={`http://localhost:5000/api/blogs/${blogId}/image/${currentIndex}`}
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
                    {block.data.url ? (
                      block.data.url.includes("youtube.com") ||
                        block.data.url.includes("youtu.be") ? (
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe
                            src={
                              block.data.url.includes("embed")
                                ? block.data.url
                                : block.data.url.replace("watch?v=", "embed/")
                            }
                            title="YouTube video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="h-[400px] w-full rounded-2xl shadow"
                          />
                        </div>
                      ) : (
                        <video
                          src={block.data.url}
                          controls
                          className="max-h-96 w-full rounded-2xl shadow"
                        />
                      )
                    ) : (
                      <p className="italic text-gray-400">
                        No video URL provided
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar: Recent Blogs */}
        <aside
          className="sticky top-[6rem] hidden h-[calc(100vh-6rem)] w-1/4 overflow-y-auto border-l border-gray-100 bg-white/70 p-8 shadow-inner backdrop-blur-lg xl:block"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#074B83 #f1f1f1",
          }}
        >
          <style jsx>
            {`
              aside::-webkit-scrollbar {
                width: 8px;
              }
              aside::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
              }
              aside::-webkit-scrollbar-thumb {
                background-color: #074b83;
                border-radius: 10px;
              }
              aside::-webkit-scrollbar-thumb:hover {
                background-color: #074b83;
              }
            `}
          </style>

          <h3 className="mb-4 text-lg font-semibold text-[#EE222F]">
            Recent Blogs
          </h3>
          <div className="space-y-4">
            {recentBlogs.map((blog) => (
              <div
                key={blog._id}
                className="group cursor-pointer rounded-xl border border-gray-100 bg-white shadow-lg transition-transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                onClick={() => (window.location.href = `/blog/${blog?.slug}`)}
              >
                {/* Image */}
                <div className="relative h-32 w-full">
                  <Image
                    // src={blog.coverImage ?? "/placeholder.png"}
                    src={`http://localhost:5000/api/blogs/${blog._id}/cover`}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-blue-700 font-semibold text-sm mb-1">
                    {/* You can optionally show category if available */}
                    {blog?.author?.fullName || "Author"}
                  </p>
                  <h4 className="text-gray-800 font-semibold line-clamp-2 mb-1 text-base">
                    {blog.title}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {new Date(blog.createdAt).toLocaleDateString()} • by {blog.author?.fullName}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </aside>
      </div>
    </>
  );
}
