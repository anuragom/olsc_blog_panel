"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/templates/Navbar";
import Footer from "@/templates/Footer";
import { AiFillDelete } from "react-icons/ai";
import Link from "next/link";
import axiosInstance from "@/utils/axiosInstance";

const Base = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const fetchBlogs = async (page = 1, searchQuery: string | null = null) => {
    setLoading(true);
    try {
      const url = searchQuery
        ? `http://localhost:5000/api/blogs/search?q=${encodeURIComponent(
          searchQuery
        )}&page=${page}&limit=6`
        : `http://localhost:5000/api/blogs?page=${page}&limit=6&sortBy=title&sortOrder=asc`;

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
    return words.slice(0, limit).join(" ") + "…";
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
      await axiosInstance.delete(`http://localhost:5000/api/blogs/${selectedBlogId}`, {
        headers: { "x-blog-key": "supersecret123" },
      });
      setResults((prev) => prev.filter((b) => b._id !== selectedBlogId));
      setShowModal(false);
    } catch (err) {
      console.error("❌ Delete Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm transition-all">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0D5BAA] mb-4"></div>
          <p className="text-[#0D5BAA] text-lg font-medium">Loading Blogs...</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 mt-32 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-[#0D5BAA] mb-8 font-roboto tracking-wide">
          All Blogs
        </h1>

        {/* Go to Editor Button */}
        <button
          onClick={() => (window.location.href = `/blog/createEditor`)}
          className="mb-6 border border-[#E11F26] text-[#E11F26] px-6 py-3 rounded-xl shadow-sm hover:bg-[#E11F26] hover:text-white transition-all text-base font-medium"
        >
          Go to Editor
        </button>

        {/* Search Box */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-2xl mb-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blogs..."
            className="w-full sm:flex-1 px-5 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0D5BAA] transition-all text-gray-700 placeholder-gray-400 text-base"
          />

          <button
            onClick={handleSearch}
            className="bg-[#0D5BAA] text-white px-6 py-3 rounded-xl shadow-sm hover:bg-[#074b83] transition-all text-base font-medium"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="w-full px-20 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {results.length > 0 ? (
              results.map((blog) => (
                <div className="group bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-2xl border border-gray-100 max-w-sm mx-auto flex flex-col relative">


                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover scale-110 group-hover:scale-100 transition-transform duration-300"
                  />

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <p className="text-blue-700 font-semibold">{blog?.categories[0]}</p>
                      <div>
                        <p>{formatDate(blog?.createdAt)}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBlogId(blog._id);
                            setShowModal(true);
                          }}
                          className="text-[#E11F26] hover:bg-[#E11F26] hover:text-white p-1 rounded-full transition-all z-20"
                        >
                          <AiFillDelete size={25} />
                        </button>
                      </div>
                    </div>
                    <h1 className="text-xl font-semibold text-[#001F39] mb-2 line-clamp-2">{blog.title}</h1>
                    <p className="text-gray-600 text-base mb-4 line-clamp-3">{truncateWords(blog?.summary, 12)}</p>
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="mt-auto inline-block px-4 py-2 bg-[#001F39] text-white rounded-lg font-medium hover:bg-[#003366] transition-colors"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-base mt-10 text-center">
                {loading ? "Loading..." : "No blogs found."}
              </p>
            )}
          </div>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center gap-2 mb-12 justify-center">
            {/* Previous Page */}
            <button
              onClick={() => fetchBlogs(Math.max(1, pagination.page - 1), query.trim() || null)}
              disabled={pagination.page === 1}
              className={`px-4 py-2 rounded-lg text-sm border transition-all ${pagination.page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-[#0D5BAA] border-[#0D5BAA] hover:bg-[#0D5BAA] hover:text-white"
                }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchBlogs(page, query.trim() || null)}
                className={`px-4 py-2 rounded-lg text-sm border transition-all ${pagination.page === page
                  ? "bg-[#0D5BAA] text-white"
                  : "bg-white text-[#0D5BAA] border-[#0D5BAA] hover:bg-[#0D5BAA] hover:text-white"
                  }`}
              >
                {page}
              </button>
            ))}

            {/* Next Page */}
            <button
              onClick={() =>
                fetchBlogs(
                  Math.min(pagination.totalPages, pagination.page + 1),
                  query.trim() || null
                )
              }
              disabled={pagination.page === pagination.totalPages}
              className={`px-4 py-2 rounded-lg text-sm border transition-all ${pagination.page === pagination.totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-[#0D5BAA] border-[#0D5BAA] hover:bg-[#0D5BAA] hover:text-white"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Delete
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-[#E11F26] text-white rounded-lg hover:bg-[#c91a1f] transition-all"
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