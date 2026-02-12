"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { 
  DndContext, 
  closestCenter, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";

import axiosInstance from "@/utils/axiosInstance";
import type { Block, BlockType } from "../types";
import BlockEditor from "./BlockEditor";
import { SortableBlock } from "./SortableBlock";

interface Props {
  blogId?: string;
  title: string;
  setTitle: (_v: string) => void;
  summary: string;
  setSummary: (_v: string) => void;
  tags: string;
  setTags: (_v: string) => void;
  categories: string;
  setCategories: (_v: string) => void;
  createdAt: string;
  setCreatedAt: (_v: string) => void;
  coverPreview: string | null;
  setCoverPreview: (_v: string | null) => void;
  blocks: Block[];
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  estimatedReadTime: string;
  setEstimatedReadTime: (_v: string) => void;
  slug: string;
  setSlug: (_v: string) => void;
  metaTitle: string;
  setMetaTitle: (_v: string) => void;
  metaDescription: string;
  setMetaDescription: (_v: string) => void;
  website: string;
  coverImageAlt: string;
  setCoverImageAlt: (_v: string) => void;
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
  blogId, title, setTitle, summary, setSummary, tags, setTags,
  categories, setCategories, coverPreview, setCoverPreview,
  blocks, setBlocks, estimatedReadTime, setEstimatedReadTime,
  slug, setSlug, metaTitle, setMetaTitle, metaDescription, setMetaDescription,
  website, coverImageAlt, setCoverImageAlt
}: Props) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  // const [coverImageAlt, setCoverImageAlt] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://olscpanel.omlogistics.co.in/api";

  // Pointer sensor with distance helps differentiate between a "click" to type and a "drag" to move
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, 
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: uuidv4(),
      type,
      data: type === "list" ? { items: [], style: "unordered" } 
          : type === "heading" ? { text: "", level: 1 } 
          : type === "table" ? { rows: [{ cells: [{ text: "" }] }] } 
          : type === "faq" ? { faqs: [{ question: "", answer: "" }] } 
          : { text: "", url: "" },
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (_id: string, _data: any) =>
    setBlocks((prevBlocks) =>
      prevBlocks.map((b) => (b.id === _id ? { ...b, data: _data } : b))
    );

  const removeBlock = (_id: string) => {
    setBlocks((prevBlocks) => prevBlocks.filter((b) => b.id !== _id));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleBlockFileSelect = (blockId: string, file: File) => {
    setImageFiles((prev) => ({ ...prev, [blockId]: file }));
    const previewUrl = URL.createObjectURL(file);
    setImagePreviews((prev) => ({ ...prev, [blockId]: previewUrl }));
    updateBlock(blockId, { ...blocks.find((b) => b.id === blockId)?.data, url: previewUrl });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("coverImageAlt", coverImageAlt);
    formData.append("summary", summary || "");
    formData.append("tags", JSON.stringify(tags.split(",").map((t) => t.trim())));
    formData.append("categories", JSON.stringify(categories.split(",").map((t) => t.trim())));
    formData.append("estimatedReadTime", estimatedReadTime || "0");
    formData.append("slug", slug);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);

    if (coverFile) formData.append("coverImage", coverFile, coverFile.name);
    Object.entries(imageFiles).forEach(([_, file]) => { formData.append("images", file, file.name); });

    const blocksData = blocks.map((b) => {
    if (b.type === "image") {
      return { 
        ...b, 
        data: { 
          ...b.data, 
          url: imagePreviews[b.id] || b.data.url || "",
          alt: b?.data?.alt || "" // ✅ Included in JSON string
        } 
      };
    }
    return b;
  });
  formData.append("blocks", JSON.stringify(blocksData));

    try {
      if (blogId) {
        await axiosInstance.put(`${baseUrl}/blogs/${blogId}`, formData);
        alert("✅ Blog updated successfully!");
      } else {
        formData.append("website", website);
        await axiosInstance.post(`${baseUrl}/blogs`, formData);
        alert("✅ Blog created successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting blog.");
    }
  };

  const renderBlockContent = (block: Block) => (
    <>
      <BlockEditor
        block={block}
        updateBlock={updateBlock}
        removeBlock={removeBlock}
        onFileSelect={handleBlockFileSelect}
      />
      {block.type === "image" && imagePreviews[block.id] && (
        <div className="relative mt-4 h-64 w-full overflow-hidden rounded-lg border">
          <Image src={imagePreviews[block.id]!} alt="Preview" fill className="object-contain" />
        </div>
      )}
    </>
  );

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-6xl space-y-6 rounded-3xl bg-white p-8 shadow-lg">
      {/* Title & Summary */}
      <input
        placeholder="Title"
        className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-800 font-semibold"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Summary"
        className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-800"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      {/* Tags & Categories */}
      <div className="grid grid-cols-2 gap-4">
        <input placeholder="Tags (comma separated)" className="w-full rounded-xl border p-3 focus:ring-2 focus:ring-blue-400" value={tags} onChange={(e) => setTags(e.target.value)} />
        <input placeholder="Categories (comma separated)" className="w-full rounded-xl border p-3 focus:ring-2 focus:ring-blue-400" value={categories} onChange={(e) => setCategories(e.target.value)} />
      </div>

      {/* SEO Section */}
      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <input placeholder="Slug" className="w-full rounded-xl border p-3" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input placeholder="Meta Title" className="w-full rounded-xl border p-3" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
        <textarea placeholder="Meta Description" className="col-span-2 w-full rounded-xl border p-3" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
      </div>

      {/* Meta Data & Cover */}
      <div className="flex flex-wrap items-start gap-6 border-t pt-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Read Time (mins)</label>
          <input className="w-full rounded-xl border p-3" value={estimatedReadTime} onChange={(e) => setEstimatedReadTime(e.target.value)} />
        </div>
        <div className="flex-1 min-w-[300px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
          <input type="file" accept="image/*" onChange={handleCoverChange} className="w-full text-sm text-gray-500" />
          {coverPreview && (
            <div className="relative mt-2 h-40 w-full rounded-lg overflow-hidden border shadow-inner">
              <img src={coverPreview} alt="Cover Preview" className="object-contain w-full h-full" />
            </div>
          )}
        </div>
        <input
        placeholder="Cover Image Alt (SEO Description)"
        className="mt-2 w-full rounded-xl border p-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
        value={coverImageAlt}
        onChange={(e) => setCoverImageAlt(e.target.value)}
        />
      </div>

      {/* Sticky Block Adder */}
      <div className="sticky top-0 z-50 flex flex-wrap gap-3 rounded-xl bg-white/90 p-3 shadow-md border border-blue-50 backdrop-blur-md">
        {blockOptions.map((opt) => (
          <button key={opt.value} type="button" onClick={() => addBlock(opt.value)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
            + {opt.label}
          </button>
        ))}
      </div>

      {/* Draggable Blocks */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-700">Content Blocks</h3>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {blocks.map((block) => (
                <SortableBlock key={block.id} id={block.id}>
                  {renderBlockContent(block)}
                </SortableBlock>
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
            {activeId ? (
              <SortableBlock id={activeId} isOverlay>
                {renderBlockContent(blocks.find((b) => b.id === activeId)!)}
              </SortableBlock>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <button type="submit" className="w-full rounded-xl bg-green-600 px-6 py-4 text-xl font-bold text-white hover:bg-green-700 transition shadow-lg">
        Save Blog to Draft
      </button>
    </form>
  );
}