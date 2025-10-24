import React, { useState } from "react";
import { Block } from "../types";
import BlogPreview from "./BlogPreview";
import BlogEditorForm from "./BlogEditorForm";
import { BsPencil } from "react-icons/bs";
import { VscPreview } from "react-icons/vsc";

interface BlogEditorProps {
  blogId?: string;
  initialTitle?: string;
  initialSummary?: string;
  initialTags?: string;
  initialCategories?: string;
  initialAuthor?: string;
  initialPublishedOn?: string;
  initialEstimatedReadTime?: string;
  initialCoverPreview?: string | null;
  initialBlocks?: Block[];
  initialSlug?: string;
  initialMetaTitle?: string;
  initialMetaDescription?: string;
}

export default function BlogEditor({
  blogId = "",
  initialTitle = "",
  initialSummary = "",
  initialTags = "",
  initialCategories = "",
  initialAuthor = "",
  initialPublishedOn = "",
  initialEstimatedReadTime = "",
  initialCoverPreview = null,
  initialBlocks = [],
  initialSlug = "",
  initialMetaTitle = "",
  initialMetaDescription = ""
}: BlogEditorProps) {
  const [view, setView] = useState<"editor" | "preview">("editor");
  const [title, setTitle] = useState(initialTitle);
  const [summary, setSummary] = useState(initialSummary);
  const [tags, setTags] = useState(initialTags);
  const [categories, setCategories] = useState(initialCategories);
  const [author, setAuthor] = useState(initialAuthor);
  const [publishedOn, setPublishedOn] = useState(initialPublishedOn);
  const [estimatedReadTime, setEstimatedReadTime] = useState(initialEstimatedReadTime);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialCoverPreview);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [slug, setSlug] = useState(initialSlug);
  const [metaTitle, setMetaTitle] = useState(initialMetaTitle);
  const [metaDescription, setMetaDescription] = useState(initialMetaDescription);


  return (
    <div className="p-4">
      <div className="flex justify-end mb-4 gap-2 mt-[35px]">
        <button
          onClick={() => setView("editor")}
          className={`px-4 py-2 rounded font-semibold ${view === "editor" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          <BsPencil /> Editor
        </button>
        <button
          onClick={() => setView("preview")}
          className={`px-4 py-2 rounded font-semibold ${view === "preview" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          <VscPreview /> Preview
        </button>
        <button
          onClick={() => (window.location.href = `/`)}
          className="px-4 py-2 rounded font-semibold bg-blue-500 text-white"
        >
          Go to all blogs
        </button>
      </div>

      {view === "editor" ? (
        <BlogEditorForm
          blogId={blogId}
          title={title} setTitle={setTitle}
          summary={summary} setSummary={setSummary}
          tags={tags} setTags={setTags}
          categories={categories} setCategories={setCategories}
          publishedOn={publishedOn} setPublishedOn={setPublishedOn}
          coverPreview={coverPreview} setCoverPreview={setCoverPreview}
          blocks={blocks} setBlocks={setBlocks}
          estimatedReadTime={estimatedReadTime} setEstimatedReadTime={setEstimatedReadTime}
          slug={slug} setSlug={setSlug}
          metaTitle={metaTitle} setMetaTitle={setMetaTitle}
          metaDescription={metaDescription} setMetaDescription={setMetaDescription}
        />
      ) : (
        <BlogPreview
          title={title}
          summary={summary}
          tags={tags}
          categories={categories}
          author={author}
          publishedOn={publishedOn}
          coverPreview={coverPreview}
          blocks={blocks}
          estimatedReadTime={estimatedReadTime}
          slug={slug}
          metaTitle={metaTitle} setMetaTitle={setMetaTitle}
          metaDescription={metaDescription} setMetaDescription={setMetaDescription}
        />
      )}
    </div>
  );
}
