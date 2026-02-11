"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import Image from "next/image";

import Footer from "@/templates/Footer";
import Navbar from "@/templates/Navbar";
import axiosInstance from "@/utils/axiosInstance";

const Base = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://olscpanel.omlogistics.co.in/api";

  const fetchBlogs = async (page = 1, searchQuery: string | null = null) => {
    setLoading(true);
    try {
      const url = searchQuery
        ? `${baseUrl}/blogs/search?q=${encodeURIComponent(
          searchQuery,
        )}&page=${page}&limit=6`
        : `${baseUrl}/blogs?page=${page}&limit=6&sortBy=createdAt&sortOrder=desc`;

      const headers: any = {};

      const res = await axiosInstance.get(url, { headers });
      setResults(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearch = () => {
    fetchBlogs(1, query.trim() || null);
  };

  const truncateWords = (text: string, limit: number = 50) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= limit) return text;
    return `${words.slice(0, limit).join(" ")}…`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDelete = async () => {
    if (!selectedBlogId) return;
    try {
      await axiosInstance.delete(
        `${baseUrl}/blogs/${selectedBlogId}`,
        // {
        //   headers: { "x-blog-key": "supersecret123" },
        // },
      );
      setResults((prev) => prev.filter((b) => b._id !== selectedBlogId));
      setShowModal(false);
    } catch (err) {
      console.error("❌ Delete Error:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm transition-all">
          <div className="mb-4 size-16 animate-spin rounded-full border-y-4 border-[#0D5BAA]"></div>
          <p className="text-lg font-medium text-[#0D5BAA]">Loading Blogs...</p>
        </div>
      )}

      {/* Main Content */}
      <div className="mt-32 flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="font-roboto mb-8 text-4xl font-semibold tracking-wide text-[#0D5BAA] md:text-5xl">
          All Blogs
        </h1>

        {/* Go to Editor Button */}
        <button
          onClick={() => (window.location.href = `/blog/createEditor`)}
          className="mb-6 rounded-xl border border-[#E11F26] px-6 py-3 text-base font-medium text-[#E11F26] shadow-sm transition-all hover:bg-[#E11F26] hover:text-white"
        >
          Go to Editor
        </button>

        {/* Search Box */}
        <div className="mb-10 flex w-full max-w-2xl flex-col items-center gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blogs..."
            className="w-full rounded-xl border border-gray-200 px-5 py-3 text-base text-gray-700 shadow-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D5BAA] sm:flex-1"
          />

          <button
            onClick={handleSearch}
            className="rounded-xl bg-[#0D5BAA] px-6 py-3 text-base font-medium text-white shadow-sm transition-all hover:bg-[#074b83]"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="mb-12 w-full px-4 sm:px-10 lg:px-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {results.length > 0 ? (
              results.map((blog) => (
                <div
                  key={blog._id}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-2xl border border-gray-100 max-w-sm mx-auto flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full">
                    <Image
                      // src={blog.coverImage ?? "/placeholder.png"}
                      src={`${baseUrl}/blogs/${blog._id}/cover`}
                      alt={blog.title || "Blog Cover"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      // className="object-cover scale-110 transition-transform duration-300 group-hover:scale-100"
                      unoptimized
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <p className="text-blue-700 font-semibold">
                        {blog?.categories?.[0] ?? "Uncategorized"}
                      </p>
                      <div className="flex items-center gap-2">
                        <p>{formatDate(blog?.createdAt)}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBlogId(blog._id);
                            setShowModal(true);
                          }}
                          className="rounded-full p-1 text-[#E11F26] transition-all hover:bg-[#E11F26] hover:text-white"
                        >
                          <AiFillDelete size={20} />
                        </button>
                      </div>
                    </div>

                    <h1 className="text-xl font-semibold text-[#001F39] mb-2 line-clamp-2">
                      {blog.title}
                    </h1>
                    <p className="text-gray-600 text-base mb-4 line-clamp-3 min-h-[3.5rem]">
                      {truncateWords(blog?.summary, 12)}
                    </p>
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="mt-auto inline-block px-4 py-2 bg-[#001F39] text-white rounded-lg font-medium hover:bg-[#003366] transition-colors"
                    >
                      Read More...
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="mt-10 text-center text-base text-gray-500">
                {loading ? "Loading..." : "No blogs found."}
              </p>
            )}
          </div>

        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mb-12 flex items-center justify-center gap-2">
            <button
              onClick={() =>
                fetchBlogs(
                  Math.max(1, pagination.page - 1),
                  query.trim() || null,
                )
              }
              disabled={pagination.page === 1}
              className={`rounded-lg border px-4 py-2 text-sm transition-all ${pagination.page === 1
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "border-[#0D5BAA] bg-white text-[#0D5BAA] hover:bg-[#0D5BAA] hover:text-white"
                }`}
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => fetchBlogs(page, query.trim() || null)}
                  className={`rounded-lg border px-4 py-2 text-sm transition-all ${pagination.page === page
                    ? "bg-[#0D5BAA] text-white"
                    : "border-[#0D5BAA] bg-white text-[#0D5BAA] hover:bg-[#0D5BAA] hover:text-white"
                    }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() =>
                fetchBlogs(
                  Math.min(pagination.totalPages, pagination.page + 1),
                  query.trim() || null,
                )
              }
              disabled={pagination.page === pagination.totalPages}
              className={`rounded-lg border px-4 py-2 text-sm transition-all ${pagination.page === pagination.totalPages
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "border-[#0D5BAA] bg-white text-[#0D5BAA] hover:bg-[#0D5BAA] hover:text-white"
                }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-[90%] max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Confirm Delete
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-gray-600 transition-all hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-[#E11F26] px-5 py-2 text-white transition-all hover:bg-[#c91a1f]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Base };
