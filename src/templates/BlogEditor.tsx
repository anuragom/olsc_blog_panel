import React, { useState } from "react";
import { BsPencil } from "react-icons/bs";
import { VscPreview } from "react-icons/vsc";
import { IoIosHome } from "react-icons/io";

import type { Block } from "../types";
import BlogEditorForm from "./BlogEditorForm";
import BlogPreview from "./BlogPreview";

interface BlogEditorProps {
  blogId?: string;
  initialTitle?: string;
  initialSummary?: string;
  initialTags?: string;
  initialCategories?: string;
  initialAuthor?: string;
  initialCreatedAt?: string;
  initialEstimatedReadTime?: string;
  initialCoverPreview?: string | null;
  initialBlocks?: Block[];
  initialSlug?: string;
  initialMetaTitle?: string;
  initialMetaDescription?: string;
  website?: string;
  initialCoverImageAlt?: string;
}

export default function BlogEditor({
  blogId = "",
  initialTitle = "",
  initialSummary = "",
  initialTags = "",
  initialCategories = "",
  initialAuthor = "",
  initialCreatedAt = "",
  initialEstimatedReadTime = "",
  initialCoverPreview = null,
  initialBlocks = [],
  initialSlug = "",
  initialMetaTitle = "",
  initialMetaDescription = "",
  website,
  initialCoverImageAlt = "",

}: BlogEditorProps) {
  const [view, setView] = useState<"editor" | "preview">("editor");
  const [title, setTitle] = useState(initialTitle);
  const [summary, setSummary] = useState(initialSummary);
  const [tags, setTags] = useState(initialTags);
  const [categories, setCategories] = useState(initialCategories);
  const [author] = useState(initialAuthor);
  const [createdAt, setCreatedAt] = useState(initialCreatedAt);
  const [estimatedReadTime, setEstimatedReadTime] = useState(
    initialEstimatedReadTime,
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialCoverPreview,
  );
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [slug, setSlug] = useState(initialSlug);
  const [metaTitle, setMetaTitle] = useState(initialMetaTitle);
  const [metaDescription, setMetaDescription] = useState(
    initialMetaDescription,
  );
  const [websiteState] = useState(website || "");
  const [coverImageAlt, setCoverImageAlt] = useState(initialCoverImageAlt);
  const topMarginClass = view === "preview" ? "mt-[70px]" : "mt-[35px]";
if (!website) {
    return <p className="p-10 text-red-600">Error: Website context is required to load editor.</p>;
  }

  return (
    <div className="p-10">
      <div className={`mb-4 flex justify-end gap-2 relative z-50 ${topMarginClass}`}>
        <button
          onClick={() => setView("editor")}
          className={`rounded px-4 py-2 font-semibold ${
            view === "editor" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <BsPencil /> Editor
        </button>
        <button
          onClick={() => setView("preview")}
          className={`rounded px-4 py-2 font-semibold ${
            view === "preview" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <VscPreview /> Preview
        </button>
        <button
          onClick={() => (window.location.href = `/`)}
          className="rounded bg-blue-500 px-4 py-2 font-semibold text-white"
        >
          <IoIosHome /> Go to Home
        </button>
      </div>

      {view === "editor" ? (
        <BlogEditorForm
          blogId={blogId}
          title={title}
          setTitle={setTitle}
          summary={summary}
          setSummary={setSummary}
          tags={tags}
          setTags={setTags}
          categories={categories}
          setCategories={setCategories}
          createdAt={createdAt}
          setCreatedAt={setCreatedAt}
          coverPreview={coverPreview}
          setCoverPreview={setCoverPreview}
          blocks={blocks}
          setBlocks={setBlocks}
          estimatedReadTime={estimatedReadTime}
          setEstimatedReadTime={setEstimatedReadTime}
          slug={slug}
          setSlug={setSlug}
          metaTitle={metaTitle}
          setMetaTitle={setMetaTitle}
          metaDescription={metaDescription}
          setMetaDescription={setMetaDescription}
          website={websiteState}
          coverImageAlt={coverImageAlt}
          setCoverImageAlt={setCoverImageAlt}
        />
      ) : (
        <BlogPreview
          blogId={blogId}
          title={title}
          summary={summary}
          tags={tags}
          categories={categories}
          author={author}
          createdAt={createdAt}
          coverPreview={coverPreview}
          blocks={blocks}
          estimatedReadTime={estimatedReadTime}
          slug={slug}
          metaTitle={metaTitle}
          setMetaTitle={setMetaTitle}
          metaDescription={metaDescription}
          setMetaDescription={setMetaDescription}
          website={websiteState}
        />
      )}
    </div>
  );
}
