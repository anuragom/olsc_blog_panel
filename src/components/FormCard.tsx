// "use client";

// import Image from "next/image";
// import { HiOutlineArrowNarrowRight } from "react-icons/hi";

// const FormCard = ({
//   title,
//   imageUrl,
//   description,
//   onClick,
// }: {
//   title: string;
//   imageUrl: string;
//   description: string;
//   onClick: () => void;
// }) => (
//   <div
//     onClick={onClick}
//     className="group relative w-80 h-96 bg-white border border-gray-100 rounded-3xl p-4 transition-all duration-500 cursor-pointer hover:border-blue-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
//   >
//     <div className="relative h-48 w-full overflow-hidden rounded-[2rem] bg-gray-50 mb-6">
//       <Image
//         src={imageUrl}
//         alt={title}
//         fill
//         className="object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.5] group-hover:grayscale-0"
//         unoptimized
//       />
//     </div>
//     <div className="px-2">
//       <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-2 group-hover:text-blue-600 transition-colors">
//         Form Module
//       </h2>
//       <h5 className="text-2xl font-light text-slate-900 mb-3 tracking-tight">
//         {title}
//       </h5>
//       <p className="text-sm font-medium text-slate-400 leading-relaxed line-clamp-2">
//         {description}
//       </p>
//     </div>
//     <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-slate-300 transition-all duration-500 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white group-hover:translate-x-1">
//       <HiOutlineArrowNarrowRight className="w-5 h-5" />
//     </div>
//   </div>
// );

// export { FormCard };




"use client";

import { HiArrowRight } from "react-icons/hi";

interface FormCardProps {
  title: string;
  Icon: any;
  description: string;
  onClick: () => void;
}

const FormCard = ({ title, Icon, description, onClick }: FormCardProps) => (
  <div
    onClick={onClick}
    className="group relative bg-white p-10 transition-all duration-300 cursor-pointer hover:bg-slate-50 flex flex-col justify-between h-[320px] border-r border-b border-slate-100 last:border-r-0"
  >
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="w-12 h-12 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#074B83] transition-colors border border-slate-100">
          <Icon size={24} />
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-[#EE222F]">
          Active Link
        </span>
      </div>

      <h5 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase">
        {title}
      </h5>
      <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-[240px]">
        {description}
      </p>
    </div>

    {/* Formal Footer */}
    <div className="flex items-center justify-between pt-6 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="text-[10px] font-black uppercase tracking-widest text-[#074B83]">
        Execute Module
      </span>
      <HiArrowRight className="text-[#EE222F]" />
    </div>

    {/* Accent Hover Bar */}
    <div className="absolute top-0 left-0 w-full h-1 bg-[#074B83] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
  </div>
);

export { FormCard };
