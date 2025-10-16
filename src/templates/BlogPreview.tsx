// src/templates/BlogPreview.tsx
import React, { useMemo, useState, useEffect } from "react";
import { Block } from "../types";
import { GrInspect } from "react-icons/gr";
import { CiCalendarDate } from "react-icons/ci";
import axios from "axios";

interface BlogPreviewProps {
  title: string;
  summary: string;
  tags: string;
  categories: string;
  estimatedReadTime: string;
  author: string;
  publishedOn: string;
  coverPreview: string | null;
  blocks: Block[];
}

interface RecentBlog {
  _id: string;
  title: string;
  coverImage: string;
  author: string;
  createdAt: string;
}

export default function BlogPreview({
  title,
  summary,
  tags,
  categories,
  author,
  publishedOn,
  coverPreview,
  estimatedReadTime,
  blocks,
}: BlogPreviewProps) {
  const [activeSection, setActiveSection] = useState<string>("");
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
    [blocks]
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
        "transition-colors"
      );
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    return container.innerHTML;
  }

  React.useEffect(() => {
    if (typeof window === "undefined") return; // SSR safety

    if (!sectionIndex || sectionIndex.length === 0) return;

    // Get heading elements
    const headingEls = sectionIndex
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingEls.length === 0) return;

    // Scroll handler fallback (nearest to reference point)
    const referenceY = 100; // px from top
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        let nearestId = "";
        let minDistance = Infinity;

        headingEls.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const diff = Math.abs(rect.top - referenceY);
          if (diff < minDistance) {
            minDistance = diff;
            nearestId = el.id;
          }
        });

        if (nearestId) setActiveSection(nearestId);
        ticking = false;
      });
    };

    // IntersectionObserver for better performance and accuracy
    const observer = new IntersectionObserver(
      (entries) => {
        const visible: IntersectionObserverEntry[] = entries.filter(
          (entry) => entry.isIntersecting
        );

        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const topVisible = visible[0];
          if (topVisible?.target instanceof HTMLElement) {
            setActiveSection(topVisible.target.id);
          }
        }
      },
      {
        root: null,
        rootMargin: "-40% 0px -55% 0px", // adjust as needed for sticky headers
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    headingEls.forEach((el) => observer.observe(el));

    // Attach scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    // run once to set initial active section
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      headingEls.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [sectionIndex]);

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
        const res = await axios.get("http://localhost:5000/api/blogs?page=1&limit=4&sortBy=title&sortOrder=asc", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setRecentBlogs(res.data.data);
      } catch (err) {
        console.error("Error fetching recent blogs:", err);
      }
    };

    fetchRecentBlogs();
  }, []);



  return (
    <>
      <div className="fixed top-[10rem] left-0 w-full h-1 bg-gray-200 z-40">
        <div
          id="scroll-progress"
          className="h-1 bg-red-600 w-0 transition-[width] duration-150 ease-out"
        ></div>
      </div>
      <div className="relative flex flex-row min-h-screen font-sans bg-gradient-to-b from-[#F9FAFB] to-[#F3F4F6] text-gray-800">
        {/* Table of Contents */}
        {sectionIndex.length > 0 && (
          <aside
            className="hidden lg:block w-1/5 px-4 sticky"
            style={{
              top: "200px", // Adjust this if your navbar height changes
              alignSelf: "flex-start",
              height: "calc(100vh - 150px)",
              overflowY: "auto",
            }}
          >
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
                    onClick={() =>
                      document
                        .getElementById(sec.id)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    {/* 🔹 Bullet circle */}
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          activeSection === sec.id ? "#EE222F" : "#074B83",
                        transition: "background-color 0.2s ease",
                      }}
                    ></span>

                    {/* Section text */}
                    <span>{sec.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}



        {/* Main content area */}
        <main className="flex-1 overflow-y-auto px-8 py-10 max-w-5xl mx-auto space-y-4">
          {/* Title */}
          {title && (
            <h1 className="text-5xl md:text-6xl font-bold text-[#074B83] tracking-tight leading-snug mb-2">
              {title}
            </h1>
          )}

          {author && (
            <div className="flex justify-between items-center text-gray-700 text-sm tracking-wide mb-6">
              <p>
                By <span className="font-medium text-[#EE222F]">{author}</span>
              </p>
              {estimatedReadTime && (
                <div className="flex flex-row items-center">
                  <GrInspect className="text-[#074B83] mr-3 text-2xl" />
                  <p className="flex items-center gap-1">
                    {estimatedReadTime} min read
                  </p>
                </div>
              )}
            </div>
          )}

          {categories && (
            <div className="flex justify-between items-center text-gray-700 text-sm tracking-wide mb-6">
              <p>
                Categories : <span className="font-medium text-[#EE222F]">{categories}</span>
              </p>
              {publishedOn && (
                <div className="flex flex-row items-center">
                  <CiCalendarDate className="text-[#074B83] mr-3 text-2xl" />
                  <p className="flex items-center gap-1">
                    {publishedOn}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cover Image */}
          {coverPreview && (
            <div className="relative w-full rounded-3xl overflow-hidden shadow-md mb-8">
              <img
                src={coverPreview}
                alt="Cover"
                className="w-full h-[450px] object-cover"
              />
            </div>
          )}

          {/* Summary */}
          {summary && (
            <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-6 shadow text-center">
              <p className="text-lg text-gray-700 italic leading-relaxed">
                “{summary}”
              </p>
            </div>
          )}

          {/* Tags */}
          {tags && (
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
          )}
          <div className="bg-white rounded-3xl shadow-lg p-10 space-y-8">
            {blocks.map((block) => (
              <div key={block.id} id={block.id} className="scroll-mt-28">
                {block.type === "heading" && (
                  <>
                    {block.data.level === 1 ? (
                      <h1 className="text-3xl font-bold mt-8 mb-4 border-b-2 border-[#EE222F]/40 pb-2">
                        {block.data.text}
                      </h1>
                    ) : block.data.level === 2 ? (
                      <h2 className="text-2xl font-semibold mt-6 mb-3 text-[#074B83]">
                        {block.data.text}
                      </h2>
                    ) : (
                      <h3 className="text-xl font-medium mt-4 mb-2 text-gray-700">
                        {block.data.text}
                      </h3>
                    )}
                  </>
                )}

                {block.type === "table" && (
                  <table className="table-auto border-collapse w-full my-4">
                    <tbody>
                      {block.data.rows?.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.cells.map((cell, cIdx) => (
                            <td key={cIdx} className="border p-2">{cell.text}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {block.type === "faq" && (
                  <div className="my-4 space-y-2">
                    {block.data.faqs?.map((faq, idx) => (
                      <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                        <p className="font-semibold">{faq.question}</p>
                        <p className="text-gray-700 mt-1">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

                {block.type === "paragraph" && (
                  <div
                    className="text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: enhanceLinks(block.data.text ?? ""),
                    }}
                  />
                )}

                {/* Quote */}
                {block.type === "quote" && (
                  <blockquote className="border-l-4 border-[#EE222F]/60 pl-4 italic text-gray-700 bg-[#EE222F]/5 p-3 rounded-r">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: enhanceLinks(block.data.text ?? ""),
                      }}
                    />
                  </blockquote>
                )}

                {block.type === "code" && (
                  <pre className="bg-[#074B83] text-gray-100 p-4 rounded-xl font-mono text-sm overflow-x-auto">
                    {block.data.text}
                  </pre>
                )}

                {block.type === "list" &&
                  (block.data.style === "unordered" ? (
                    <ul className="list-disc ml-6 space-y-1">
                      {block.data.items?.map((i: string, idx: number) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  ) : (
                    <ol className="list-decimal ml-6 space-y-1">
                      {block.data.items?.map((i: string, idx: number) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ol>
                  ))}

                {block.type === "image" && (
                  <figure className="my-6">
                    <img
                      src={block.data.preview ?? block.data.url}
                      alt={block.data.caption ?? ""}
                      className="w-full rounded-2xl object-cover shadow hover:scale-[1.02] transition-transform duration-300"
                    />
                    {block.data.caption && (
                      <figcaption className="text-sm text-gray-500 mt-2 text-center italic">
                        {block.data.caption}
                      </figcaption>
                    )}
                  </figure>
                )}

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
                            className="w-full h-[400px] rounded-2xl shadow"
                          />
                        </div>
                      ) : (
                        <video
                          src={block.data.url}
                          controls
                          className="w-full max-h-96 rounded-2xl shadow"
                        />
                      )
                    ) : (
                      <p className="text-gray-400 italic">No video URL provided</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar: Recent Blogs */}
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

          <h3 className="text-[#EE222F] font-semibold mb-4 text-lg">
            Recent Blogs
          </h3>
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
    </>
  );
}