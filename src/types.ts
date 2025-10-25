export type BlockType =
  | "paragraph"
  | "heading"
  | "list"
  | "image"
  | "video"
  | "quote"
  | "code"
  | "table"
  | "faq";

export interface TableCell {
  text: string;
}

export interface TableRow {
  cells: TableCell[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Block {
  id: string;
  type: BlockType;
  data: {
    text?: string;
    level?: number;
    items?: string[];
    style?: "ordered" | "unordered";
    url?: string;
    caption?: string;
    language?: string;
    rows?: TableRow[];
    faqs?: FAQItem[];
    src?: string;
    preview?: string;
  };
}

export interface BlogType {
  _id: string;
  title: string;
  summary: string;
  author: string;
  coverImage: string;
  tags: string[];
  categories: string[];
  estimatedReadTime: string;
  createdAt: string;
  updatedAt: string;
  blocks: Block[];
  publishedOn: string;
  coverPreview: any;
}
