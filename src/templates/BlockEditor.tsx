"use client";
import React from "react";
import { Block } from "../types";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Props {
  block: Block;
  updateBlock: (id: string, data: any) => void;
  removeBlock: (id: string) => void;
  onFileSelect?: (blockId: string, file: File) => void;
}

export default function BlockEditor({ block, updateBlock, removeBlock, onFileSelect }: Props) {
  const handleDataChange = (key: string, value: any) => {
    updateBlock(block.id, { ...block.data, [key]: value });
  };

  // Table helpers
  const handleTableCellChange = (rowIndex: number, cellIndex: number, value: string) => {
    const rows = block.data.rows?.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;
      return { ...row, cells: row.cells.map((cell, cIdx) => cIdx === cellIndex ? { text: value } : cell) };
    });
    handleDataChange("rows", rows);
  };

  const addTableRow = () => {
    const cols = block.data.rows?.[0]?.cells.length || 1;
    const newRow = { cells: Array.from({ length: cols }, () => ({ text: "" })) };
    handleDataChange("rows", [...(block.data.rows || []), newRow]);
  };

  const addTableColumn = () => {
    const rows = block.data.rows?.map((row) => ({ ...row, cells: [...row.cells, { text: "" }] }));
    handleDataChange("rows", rows);
  };

  // FAQ helpers
  const handleFAQChange = (index: number, field: "question" | "answer", value: string) => {
    const faqs = block.data.faqs?.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq));
    handleDataChange("faqs", faqs);
  };

  const addFAQ = () => handleDataChange("faqs", [...(block.data.faqs || []), { question: "", answer: "" }]);
  const removeFAQ = (index: number) => handleDataChange("faqs", block.data.faqs?.filter((_, i) => i !== index));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onFileSelect) return;
    onFileSelect(block.id, file);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700 capitalize">{block.type}</span>
        <button type="button" onClick={() => removeBlock(block.id)} className="text-red-500">
          <FaTrash />
        </button>
      </div>

      {block.type === "paragraph" && (
        <ReactQuill
          theme="snow"
          value={block.data.text || ""}
          onChange={(content) => handleDataChange("text", content)}
        />
      )}

      {block.type === "heading" && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm">Level</label>
            <select
              value={block.data.level ?? 1}
              onChange={(e) => handleDataChange("level", parseInt(e.target.value, 10))}
              className="border rounded px-2 py-1 text-sm"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{`H${n}`}</option>)}
            </select>
          </div>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Heading text"
            value={block.data.text ?? ""}
            onChange={(e) => handleDataChange("text", e.target.value)}
          />
        </>
      )}

      {block.type === "list" && (
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Enter each list item on a new line"
          value={(block.data.items ?? []).join("\n")}
          onChange={(e) => handleDataChange("items", e.target.value.split("\n"))}
        />
      )}

      {block.type === "quote" && (
        <textarea
          value={block.data.text || ""}
          onChange={(e) => handleDataChange("text", e.target.value)}
          placeholder="Quote"
          className="w-full border p-2 rounded"
        />
      )}

      {block.type === "code" && (
        <textarea
          value={block.data.text || ""}
          onChange={(e) => handleDataChange("text", e.target.value)}
          placeholder="Code"
          className="w-full border p-2 rounded font-mono"
        />
      )}

      {block.type === "image" && (
        <>
          <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
          {block.data.url && <img src={block.data.url} alt="preview" className="mt-2 max-h-60 rounded-lg shadow border" />}
          <input
            type="text"
            className="w-full border p-2 rounded mt-2"
            placeholder="Caption (optional)"
            value={block.data.caption ?? ""}
            onChange={(e) => handleDataChange("caption", e.target.value)}
          />
        </>
      )}

      {block.type === "video" && (
        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="Video URL"
          value={block.data.url ?? ""}
          onChange={(e) => handleDataChange("url", e.target.value)}
        />
      )}

      {block.type === "table" && (
        <div className="overflow-auto border rounded-lg p-2">
          <table className="table-auto border-collapse w-full">
            <tbody>
              {block.data.rows?.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.cells.map((cell, cIdx) => (
                    <td key={cIdx} className="border p-2">
                      <input
                        value={cell.text}
                        onChange={(e) => handleTableCellChange(rIdx, cIdx, e.target.value)}
                        className="w-full border p-1 rounded"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={addTableRow} className="text-blue-600 flex items-center gap-1">
              <FaPlus /> Add Row
            </button>
            <button type="button" onClick={addTableColumn} className="text-blue-600 flex items-center gap-1">
              <FaPlus /> Add Column
            </button>
          </div>
        </div>
      )}

      {block.type === "faq" && (
        <div className="space-y-3">
          {block.data.faqs?.map((faq, idx) => (
            <div key={idx} className="border p-2 rounded-lg space-y-1">
              <input
                placeholder="Question"
                value={faq.question}
                onChange={(e) => handleFAQChange(idx, "question", e.target.value)}
                className="w-full border p-1 rounded"
              />
              <textarea
                placeholder="Answer"
                value={faq.answer}
                onChange={(e) => handleFAQChange(idx, "answer", e.target.value)}
                className="w-full border p-1 rounded"
              />
              <button type="button" onClick={() => removeFAQ(idx)} className="text-red-500 flex items-center gap-1">
                <FaMinus /> Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addFAQ} className="text-blue-600 flex items-center gap-1">
            <FaPlus /> Add FAQ
          </button>
        </div>
      )}
    </div>
  );
}
