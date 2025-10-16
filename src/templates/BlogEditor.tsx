import React, { useState } from "react";
import { Block } from "../types";
import BlogPreview from "./BlogPreview";
import BlogEditorForm from "./BlogEditorForm";

export default function BlogEditor() {
  const [view, setView] = useState<"editor" | "preview">("editor");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [categories, setCategories] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedOn, setPublishedOn] = useState("");
  const [estimatedReadTime, setEstimatedReadTime] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => setView("editor")}
          className={`px-4 py-2 rounded font-semibold ${view === "editor" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Editor
        </button>
        <button
          onClick={() => setView("preview")}
          className={`px-4 py-2 rounded font-semibold ${view === "preview" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Preview
        </button>
      </div>

      {view === "editor" ? (
        <BlogEditorForm
          title={title} setTitle={setTitle}
          summary={summary} setSummary={setSummary}
          tags={tags} setTags={setTags}
          categories={categories} setCategories={setCategories}
          author={author} setAuthor={setAuthor}
          publishedOn={publishedOn} setPublishedOn={setPublishedOn}
          coverPreview={coverPreview} setCoverPreview={setCoverPreview}
          blocks={blocks} setBlocks={setBlocks}
          estimatedReadTime={estimatedReadTime} 
          setEstimatedReadTime={setEstimatedReadTime}
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
        />
      )}
    </div>
  );
}


