import React, { useState } from "react";
import { Block, BlockType } from "../types";
import { v4 as uuidv4 } from "uuid";
import BlockEditor from "./BlockEditor";
import { FaClock } from "react-icons/fa";
import axiosInstance from "@/utils/axiosInstance";

interface Props {
  blogId?: string;
  title: string;
  setTitle: (v: string) => void;
  summary: string;
  setSummary: (v: string) => void;
  tags: string;
  setTags: (v: string) => void;
  categories: string;
  setCategories: (v: string) => void;
  publishedOn: string;
  setPublishedOn: (v: string) => void;
  coverPreview: string | null;
  setCoverPreview: (v: string | null) => void;
  blocks: Block[];
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  estimatedReadTime: string;
  setEstimatedReadTime: (v: string) => void;
  // ✅ seo fields
  slug: string;
  setSlug: (v: string) => void;
  metaTitle: string;
  setMetaTitle: (v: string) => void;
  metaDescription: string;
  setMetaDescription: (v: string) => void;
}

const blockOptions: { label: string; value: BlockType }[] = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Heading", value: "heading" },
  { label: "List", value: "list" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "Quote", value: "quote" },
  { label: "Code", value: "code" },
  { label: "Table", value: "table" },
  { label: "FAQ", value: "faq" },
];

export default function BlogEditorForm({
  blogId,
  title,
  setTitle,
  summary,
  setSummary,
  tags,
  setTags,
  categories,
  setCategories,
  publishedOn,
  setPublishedOn,
  coverPreview,
  setCoverPreview,
  blocks,
  setBlocks,
  estimatedReadTime,
  setEstimatedReadTime,
  slug,
  setSlug,
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription
}: Props) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});

  // ➕ Add new block
  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: uuidv4(),
      type,
      data:
        type === "list"
          ? { items: [], style: "unordered" }
          : type === "heading"
            ? { text: "", level: 1 }
            : type === "table"
              ? { rows: [{ cells: [{ text: "" }] }] }
              : type === "faq"
                ? { faqs: [{ question: "", answer: "" }] }
                : { text: "", url: "" },
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  // ✏️ Update block
  const updateBlock = (id: string, data: any) =>
    setBlocks((prevBlocks) =>
      prevBlocks.map((b) => (b.id === id ? { ...b, data } : b))
    );

  // 🗑️ Remove block
  const removeBlock = (id: string) => {
    setBlocks((prevBlocks) => prevBlocks.filter((b) => b.id !== id));
    setImageFiles((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setImagePreviews((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  // 🖼️ Cover image change
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // 📸 Block image file select
  const handleBlockFileSelect = (blockId: string, file: File) => {
    setImageFiles((prev) => ({ ...prev, [blockId]: file }));
    const previewUrl = URL.createObjectURL(file);
    setImagePreviews((prev) => ({ ...prev, [blockId]: previewUrl }));
    updateBlock(blockId, {
      ...blocks.find((b) => b.id === blockId)?.data,
      url: previewUrl,
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", title);
  formData.append("summary", summary || "");
  formData.append("tags", JSON.stringify(tags.split(",").map((t) => t.trim())));
  formData.append(
    "categories",
    JSON.stringify(categories.split(",").map((t) => t.trim()))
  );
  // formData.append("author", author || "");
  formData.append("estimatedReadTime", estimatedReadTime || "0");

  //seo fields
  formData.append("slug", slug);
  formData.append("metaTitle", metaTitle);
  formData.append("metaDescription", metaDescription);

  if (coverFile)
    formData.append("coverImage", coverFile, coverFile.name);

  Object.entries(imageFiles).forEach(([_, file]) => {
    formData.append("images", file, file.name);
  });

  const blocksData = blocks.map((b) => {
    if (b.type === "image") {
      return {
        ...b,
        data: { ...b.data, url: imagePreviews[b.id] || b.data.url || "" },
      };
    }
    return b;
  });

  formData.append("blocks", JSON.stringify(blocksData));

  try {
    let res;
    if (blogId) {
      // ✏️ Edit existing blog
      res = await axiosInstance.put(`http://localhost:5000/api/blogs/${blogId}`, formData, {
        headers: { "x-blog-key": "supersecret123" },
      });
      alert("✅ Blog updated successfully!");
    } else {
      // 🆕 Create new blog
      res = await axiosInstance.post("http://localhost:5000/api/blogs", formData, {
        headers: { "x-blog-key": "supersecret123" },
      });
      alert("✅ Blog created successfully!");
    }
  } catch (err) {
    console.error("❌ Blog submit error:", err);
    alert("Error submitting blog.");
  }
};


  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 max-w-6xl mx-auto p-8 bg-white rounded-3xl shadow-lg"
    >
      {/* 📝 Title */}
      <input
        placeholder="Title"
        className="w-full border p-4 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* 📄 Summary */}
      <textarea
        placeholder="Summary"
        className="w-full border p-4 rounded-xl h-32 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      {/* 🏷️ Tags + ✍️ Author */}
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="Tags (comma separated)"
          className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        {/* <input
          placeholder="Author"
          className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        /> */}
      </div>

      {/* 📚 Categories + 📅 Published On */}
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="Categories (comma separated)"
          className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
        />
        <input
          placeholder="Published On"
          className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={publishedOn}
          onChange={(e) => setPublishedOn(e.target.value)}
        />
      </div>

      {/* ⏱ Estimated Time + 🖼 Cover */}
      <div className="relative w-full flex flex-row gap-3 items-center">
        <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          placeholder="Estimated read time (mins)"
          className="w-full border pl-10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={estimatedReadTime}
          onChange={(e) => setEstimatedReadTime(e.target.value)}
        />
        <div>
          <input type="file" accept="image/*" onChange={handleCoverChange} />
          {coverPreview && (
            <img
              src={coverPreview}
              alt="cover"
              style={{ maxHeight: 200, marginTop: 10 }}
            />
          )}
        </div>
        <div className="space-y-4">
  {/* 🧩 Slug */}
  <input
    placeholder="Slug (leave empty to auto-generate from title)"
    className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
    value={slug}
    onChange={(e) => setSlug(e.target.value)}
  />

  {/* 🌐 Meta Title */}
  <input
    placeholder="Meta Title (used for SEO page title)"
    className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
    value={metaTitle}
    onChange={(e) => setMetaTitle(e.target.value)}
  />

  {/* 📝 Meta Description */}
  <textarea
    placeholder="Meta Description (used for SEO snippet)"
    className="w-full border p-3 rounded-xl h-28 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
    value={metaDescription}
    onChange={(e) => setMetaDescription(e.target.value)}
  />
</div>
      </div>

      {/* ➕ Block Options */}
      <div className="sticky top-0 z-50 flex flex-wrap gap-3 mb-6 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow">
        {blockOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => addBlock(opt.value)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + {opt.label}
          </button>
        ))}
      </div>

      {/* 🧩 Render Blocks */}
      <div className="space-y-6">
        {blocks.map((block) => (
          <div
            key={block.id}
            className="bg-gray-50 p-4 rounded-2xl shadow-sm"
          >
            <BlockEditor
              block={block}
              updateBlock={updateBlock}
              removeBlock={removeBlock}
              onFileSelect={handleBlockFileSelect}
            />
            {block.type === "image" && imagePreviews[block.id] && (
              <img
                src={imagePreviews[block.id]}
                alt="Preview"
                className="mt-3 max-h-48 w-full object-cover rounded-xl shadow"
              />
            )}
          </div>
        ))}
      </div>

      {/* ✅ Submit */}
      <button
        type="submit"
        className="w-full bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition text-lg"
      >
        Publish Blog
      </button>
    </form>
  );
}


