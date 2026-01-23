"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import { MdPublishedWithChanges } from "react-icons/md";
import { RiDraftLine } from "react-icons/ri";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/utils/AuthContext"; 

interface Blog {
    _id: string;
    title: string;
    summary: string;
    categories: string[];
    slug: string;
    createdAt: string;
    coverImage: any;
    isPublished: boolean;
}

interface BlogListingPanelProps {
  website: 'omlogistics' | 'sanjvik';
}

type BlogStatusFilter = 'all' | 'published' | 'draft';

const BlogListingPanel = ({ website }: BlogListingPanelProps) => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BlogStatusFilter>('all');
  const [results, setResults] = useState<Blog[]>([]); 
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const { user, hasPermission } = useAuth();

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const canPublish = hasPermission("blog:publish") || user?.role === "SuperAdmin";
  const canDelete = hasPermission("blog:delete") || user?.role === "SuperAdmin";
  const canCreate = hasPermission("blog:create") || user?.role === "SuperAdmin";

  const fetchBlogs = async (page = 1, searchQuery: string | null = null, currentStatusFilter: BlogStatusFilter = statusFilter) => {
    setLoading(true);
    try {
      const statusParam = currentStatusFilter !== 'all' 
        ? `&status=${currentStatusFilter}` 
        : '';
        
      let url = searchQuery
        ? `/blogs/search?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=6&website=${website}${statusParam}`
        : `/blogs?page=${page}&limit=6&sortBy=createdAt&sortOrder=desc&website=${website}${statusParam}`;

      // --- OPTIMIZED: Using axiosInstance handles the baseUrl and cookies automatically ---
      const res = await axiosInstance.get(url);
      setResults(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1, null, statusFilter);
  }, [website, statusFilter]); 

  const handleSearch = () => {
    fetchBlogs(1, query.trim() || null, statusFilter);
  };
  
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as BlogStatusFilter;
    setQuery('');
    setStatusFilter(newStatus);
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
      await axiosInstance.delete(`/blogs/${selectedBlogId}`);
      setShowModal(false);
      fetchBlogs(pagination?.page || 1, query.trim() || null, statusFilter);
    } catch (err) {
      console.error("❌ Delete Error:", err);
    }
  };

  const handlePublish = async () => {
    if (!selectedBlogId) return;
    try {
      const res = await axiosInstance.patch(`/blogs/${selectedBlogId}/toggle-publish`);
      const updatedBlog = res.data.blog as Blog; 

      const shouldRemoveFromList = statusFilter !== 'all' && 
                                  ((statusFilter === 'published' && !updatedBlog.isPublished) ||
                                  (statusFilter === 'draft' && updatedBlog.isPublished));

      if (shouldRemoveFromList) {
          setResults(prev => prev.filter(b => b._id !== updatedBlog._id));
      } else {
          setResults(prevResults => prevResults.map(blog => 
             blog._id === updatedBlog._id ? updatedBlog : blog
          ));
      }

      setShowPublishModal(false);
      setSelectedBlogId(null);
    } catch (err) {
      console.error("❌ Publish Error:", err);
      alert("Error toggling publish status.");
    }
  };

  const blogToToggle = results.find(b => b._id === selectedBlogId);
  const isCurrentlyPublished = blogToToggle?.isPublished;
  const toggleAction = isCurrentlyPublished ? "Unpublish" : "Publish";

  return (
    <div className="w-full bg-gray-50">
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm transition-all">
          <div className="mb-4 size-16 animate-spin rounded-full border-y-4 border-[#0D5BAA]"></div>
          <p className="text-lg font-medium text-[#0D5BAA]">Loading Blogs...</p>
        </div>
      )}

      <div className="pt-4 pb-10 flex flex-col items-center px-4 text-center">
        
        <div className="flex items-center justify-center w-full max-w-5xl mb-6 relative">
            <h1 className="font-roboto text-4xl font-semibold tracking-wide text-[#0D5BAA] md:text-5xl">
                {website === 'sanjvik' ? 'Sanjvik Blogs' : 'OM Logistics Blogs'}
            </h1>
        </div>

        {/* --- UPDATED: Only show Create button if user has permission --- */}
        {canCreate && (
          <button
            onClick={() => (window.location.href = `/blog/createEditor?website=${website}`)}
            className="mb-6 rounded-xl border border-[#E11F26] px-6 py-3 text-base font-medium text-[#E11F26] shadow-sm transition-all hover:bg-[#E11F26] hover:text-white"
          >
            Go to Editor
          </button>
        )}

        <div className="mb-10 flex w-full max-w-4xl flex-col items-center gap-3 sm:flex-row">
            <div className="flex w-full sm:flex-1 gap-3">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search ${website} blogs...`}
                    className="w-full rounded-xl border border-gray-200 px-5 py-3 text-base text-gray-700 shadow-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D5BAA] sm:flex-1"
                />
                <button
                    onClick={handleSearch}
                    className="rounded-xl bg-[#0D5BAA] px-6 py-3 text-base font-medium text-white shadow-sm transition-all hover:bg-[#074b83] min-w-[100px]"
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            <select
                value={statusFilter}
                onChange={handleFilterChange}
                className="rounded-xl border border-gray-200 px-5 py-3 text-base bg-[#0D5BAA] text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0D5BAA] w-full sm:w-auto"
            >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
            </select>
        </div>

        <div className="mb-12 w-full px-4 sm:px-10 lg:px-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {results.length > 0 ? (
              results.map((blog) => (
                <div
                  key={blog._id}
                  className={`group bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-2xl border ${blog.isPublished ? 'border-green-400' : 'border-red-400'} max-w-sm mx-auto flex flex-col`}
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={`${baseUrl}/blogs/${blog._id}/cover`}
                      alt={blog.title || "Blog Cover"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      unoptimized
                    />
                    <span className={`absolute top-2 right-2 px-3 py-1 text-xs font-bold text-white rounded-full shadow-md ${blog.isPublished ? 'bg-green-600' : 'bg-yellow-600'}`}>
                        {blog.isPublished ? <MdPublishedWithChanges size={20} />: <RiDraftLine size={20} />}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      
                      {/* --- UPDATED: Dynamic Publish Control --- */}
                      {canPublish && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBlogId(blog._id);
                            setShowPublishModal(true);
                          }}
                          className={`rounded-full p-1 transition-all ${blog.isPublished ? 'text-red-500 hover:bg-red-500 hover:text-white' : 'text-green-500 hover:bg-green-500 hover:text-white'}`}
                        >
                          <TbTruckDelivery size={20} />
                        </button>
                      )}
                      
                      <p className="text-blue-700 font-semibold">
                        {blog?.categories?.[0] ?? "Uncategorized"}
                      </p>
                      <div className="flex items-center gap-2">
                        <p>{formatDate(blog?.createdAt)}</p>
                        
                        {/* --- UPDATED: Dynamic Delete Control --- */}
                        {canDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBlogId(blog._id);
                            setShowModal(true);
                          }}
                          className="rounded-full p-1 text-[#E11F26] transition-all hover:bg-[#E11F26] hover:text-white"
                        >
                          <AiFillDelete size={20} />
                        </button>)}
                      </div>
                    </div>

                    <h1 className="text-xl font-semibold text-[#001F39] mb-2 line-clamp-2 text-left">
                      {blog.title}
                    </h1>
                    <p className="text-gray-600 text-base mb-4 line-clamp-3 min-h-[3.5rem] text-left">
                      {truncateWords(blog?.summary, 12)}
                    </p>
                    <Link
                      href={`/blog/${blog.slug}?website=${website}`}
                      className="mt-auto inline-block px-4 py-2 bg-[#001F39] text-white rounded-lg font-medium hover:bg-[#003366] transition-colors"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="mt-10 text-center text-base text-gray-500 col-span-full">
                {loading ? "Loading..." : `No blogs found for ${website} under status '${statusFilter}'.`}
              </p>
            )}
          </div>
        </div>

        {/* Pagination logic remains same */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mb-12 flex items-center justify-center gap-2">
            <button
              onClick={() => fetchBlogs(Math.max(1, pagination.page - 1), query.trim() || null, statusFilter)}
              disabled={pagination.page === 1}
              className={`rounded-lg border px-4 py-2 text-sm transition-all ${pagination.page === 1 ? "bg-gray-200 text-gray-400" : "border-[#0D5BAA] bg-white text-[#0D5BAA] hover:bg-[#0D5BAA] hover:text-white"}`}
            >
              Previous
            </button>
            <button
              onClick={() => fetchBlogs(Math.min(pagination.totalPages, pagination.page + 1), query.trim() || null, statusFilter)}
              disabled={pagination.page === pagination.totalPages}
              className={`rounded-lg border px-4 py-2 text-sm transition-all ${pagination.page === pagination.totalPages ? "bg-gray-200 text-gray-400" : "border-[#0D5BAA] bg-white text-[#0D5BAA] hover:bg-[#0D5BAA] hover:text-white"}`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modals remain structurally the same but benefit from permissions check above */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-[90%] max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">Confirm Delete</h3>
            <p className="mb-6 text-sm text-gray-500">Are you sure you want to delete this blog? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-lg border border-gray-300 px-5 py-2 text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={handleDelete} className="rounded-lg bg-[#E11F26] px-5 py-2 text-white hover:bg-[#c91a1f]">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-[90%] max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">Confirm {toggleAction}</h3>
            <p className="mb-6 text-sm text-gray-500">Are you sure you want to {toggleAction.toLowerCase()} this blog?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowPublishModal(false)} className="rounded-lg border border-gray-300 px-5 py-2 text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={handlePublish} className={`rounded-lg px-5 py-2 text-white ${isCurrentlyPublished ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>{toggleAction}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { BlogListingPanel };