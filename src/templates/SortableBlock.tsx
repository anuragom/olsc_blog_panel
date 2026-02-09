// //SortableBlock.tsx:

// "use client";

// import React from "react";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { MdDragIndicator } from "react-icons/md";

// interface Props {
//   id: string;
//   children: React.ReactNode;
// }

// export function SortableBlock({ id, children }: Props) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id });

//   const style: React.CSSProperties = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     zIndex: isDragging ? 50 : "auto",
//     position: "relative",
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className={`group mb-6 flex gap-3 rounded-xl border bg-white p-4 transition-all ${
//         isDragging ? "shadow-2xl ring-2 ring-blue-500 scale-[1.02]" : "shadow-sm border-gray-200"
//       }`}
//     >
//       {/* DRAG HANDLE - Dragging only starts from here */}
//       <div
//         {...attributes}
//         {...listeners}
//         className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-blue-500 transition-colors"
//       >
//         <MdDragIndicator size={24} />
//       </div>

//       <div className="flex-1 w-full overflow-hidden">
//         {children}
//       </div>
//     </div>
//   );
// }

























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
    opacity: isDragging && !isOverlay ? 0.4 : 1, // Make the placeholder faint
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
      {/* Hide handle interaction on the overlay ghost to prevent focus issues */}
      <div
        {...(!isOverlay ? { ...attributes, ...listeners } : {})}
        className={`mt-1 text-gray-400 ${
          isOverlay ? "cursor-grabbing" : "cursor-grab hover:text-blue-500"
        }`}
      >
        <MdDragIndicator size={24} />
      </div>

      <div className="flex-1 w-full overflow-hidden pointer-events-none">
        {children}
      </div>
    </div>
  );
}











