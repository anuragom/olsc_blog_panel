"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";

interface Props {
  id: string;
  children: React.ReactNode;
  isOverlay?: boolean;
}

export function SortableBlock({ id, children, isOverlay }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0.4 : 1,
    zIndex: isOverlay ? 1000 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex gap-3 rounded-xl border bg-white p-4 transition-all ${
        isOverlay 
          ? "shadow-2xl ring-2 ring-blue-500 cursor-grabbing" 
          : "shadow-sm border-gray-200"
      } ${isDragging && !isOverlay ? "bg-gray-100 border-dashed" : ""}`}
    >
      {/* Drag Handle: Attributes and Listeners ONLY here */}
      <div
        {...attributes}
        {...listeners}
        className={`mt-1 text-gray-400 cursor-grab active:cursor-grabbing hover:text-blue-500 transition-colors`}
      >
        <MdDragIndicator size={24} />
      </div>

      {/* Content Wrapper: pointer-events disabled ONLY while dragging */}
      <div className={`flex-1 w-full overflow-hidden ${isDragging ? "pointer-events-none" : ""}`}>
        {children}
      </div>
    </div>
  );
}