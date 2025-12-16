"use client";

import "react-quill/dist/quill.snow.css";

import dynamic from "next/dynamic";
import React from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";

import type { Block } from "../types";
import Image from "next/image";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Props {
  block: Block;
  updateBlock: (_id: string, _data: any) => void;
  removeBlock: (_id: string) => void;
  onFileSelect?: (_blockId: string, _file: File) => void;
}

export default function BlockEditor({
  block,
  updateBlock,
  removeBlock,
  onFileSelect,
}: Props) {
  const handleDataChange = (key: string, value: any) => {
    updateBlock(block.id, { ...block.data, [key]: value });
  };

  // Table helpers
  const handleTableCellChange = (
    _rowIndex: number,
    _cellIndex: number,
    _value: string,
  ) => {
    const rows = block.data.rows?.map((row, rIdx) => {
      if (rIdx !== _rowIndex) return row;
      return {
        ...row,
        cells: row.cells.map((cell, cIdx) =>
          cIdx === _cellIndex ? { text: _value } : cell,
        ),
      };
    });
    handleDataChange("rows", rows);
  };

  const addTableRow = () => {
    const cols = block.data.rows?.[0]?.cells.length || 1;
    const newRow = {
      cells: Array.from({ length: cols }, () => ({ text: "" })),
    };
    handleDataChange("rows", [...(block.data.rows || []), newRow]);
  };

  const addTableColumn = () => {
    const rows = block.data.rows?.map((row) => ({
      ...row,
      cells: [...row.cells, { text: "" }],
    }));
    handleDataChange("rows", rows);
  };

  // FAQ helpers
  const handleFAQChange = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    const faqs = block.data.faqs?.map((faq, i) =>
      i === index ? { ...faq, [field]: value } : faq,
    );
    handleDataChange("faqs", faqs);
  };

  const addFAQ = () =>
    handleDataChange("faqs", [
      ...(block.data.faqs || []),
      { question: "", answer: "" },
    ]);
  const removeFAQ = (index: number) =>
    handleDataChange(
      "faqs",
      block.data.faqs?.filter((_, i) => i !== index),
    );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _file = e.target.files?.[0];
    if (!_file || !onFileSelect) return;
    onFileSelect(block.id, _file);
  };

  return (
    <div className="space-y-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium capitalize text-gray-700">
          {block.type}
        </span>
        <button
          type="button"
          onClick={() => removeBlock(block.id)}
          className="text-red-500"
        >
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
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm">Level</label>
            <select
              value={block.data.level ?? 1}
              onChange={(e) =>
                handleDataChange("level", parseInt(e.target.value, 10))
              }
              className="rounded border px-2 py-1 text-sm"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{`H${n}`}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            className="w-full rounded border p-2"
            placeholder="Heading text"
            value={block.data.text ?? ""}
            onChange={(e) => handleDataChange("text", e.target.value)}
          />
        </>
      )}

      {block.type === "list" && (
        <textarea
          className="w-full rounded border p-2"
          placeholder="Enter each list item on a new line"
          value={(block.data.items ?? []).join("\n")}
          onChange={(e) =>
            handleDataChange("items", e.target.value.split("\n"))
          }
        />
      )}

      {block.type === "quote" && (
        <textarea
          value={block.data.text || ""}
          onChange={(e) => handleDataChange("text", e.target.value)}
          placeholder="Quote"
          className="w-full rounded border p-2"
        />
      )}

      {block.type === "code" && (
        <textarea
          value={block.data.text || ""}
          onChange={(e) => handleDataChange("text", e.target.value)}
          placeholder="Code"
          className="w-full rounded border p-2 font-mono"
        />
      )}

      {block.type === "image" && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2"
          />
          {block.data.url && (
            <div className="relative mt-2 h-60 w-full rounded-lg border shadow">
    <Image
      src={block.data.url}
      alt="preview"
      fill
      className="object-cover rounded-lg"
      unoptimized
    />
  </div>
          )}
          <input
            type="text"
            className="mt-2 w-full rounded border p-2"
            placeholder="Caption (optional)"
            value={block.data.caption ?? ""}
            onChange={(e) => handleDataChange("caption", e.target.value)}
          />
        </>
      )}

      {block.type === "video" && (
        <input
          type="text"
          className="w-full rounded border p-2"
          placeholder="Video URL"
          value={block.data.url ?? ""}
          onChange={(e) => handleDataChange("url", e.target.value)}
        />
      )}

      {block.type === "table" && (
        <div className="overflow-auto rounded-lg border p-2">
          <table className="w-full table-auto border-collapse">
            <tbody>
              {block.data.rows?.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.cells.map((cell, cIdx) => (
                    <td key={cIdx} className="border p-2">
                      <input
                        value={cell.text}
                        onChange={(e) =>
                          handleTableCellChange(rIdx, cIdx, e.target.value)
                        }
                        className="w-full rounded border p-1"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={addTableRow}
              className="flex items-center gap-1 text-blue-600"
            >
              <FaPlus /> Add Row
            </button>
            <button
              type="button"
              onClick={addTableColumn}
              className="flex items-center gap-1 text-blue-600"
            >
              <FaPlus /> Add Column
            </button>
          </div>
        </div>
      )}

      {block.type === "faq" && (
        <div className="space-y-3">
          {block.data.faqs?.map((faq, idx) => (
            <div key={idx} className="space-y-1 rounded-lg border p-2">
              <input
                placeholder="Question"
                value={faq.question}
                onChange={(e) =>
                  handleFAQChange(idx, "question", e.target.value)
                }
                className="w-full rounded border p-1"
              />
              <textarea
                placeholder="Answer"
                value={faq.answer}
                onChange={(e) => handleFAQChange(idx, "answer", e.target.value)}
                className="w-full rounded border p-1"
              />
              <button
                type="button"
                onClick={() => removeFAQ(idx)}
                className="flex items-center gap-1 text-red-500"
              >
                <FaMinus /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFAQ}
            className="flex items-center gap-1 text-blue-600"
          >
            <FaPlus /> Add FAQ
          </button>
        </div>
      )}
    </div>
  );
}
