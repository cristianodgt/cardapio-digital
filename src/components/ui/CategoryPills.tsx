"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Category } from "@/lib/types";

interface CategoryPillsProps {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryPills({
  categories,
  activeId,
  onSelect,
}: CategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const scrollLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3"
    >
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(null)}
        ref={activeId === null ? activeRef : undefined}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          activeId === null
            ? "bg-white text-black shadow-lg"
            : "bg-white/10 text-white/80 backdrop-blur-sm border border-white/10"
        }`}
      >
        Todos
      </motion.button>
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat.id)}
          ref={activeId === cat.id ? activeRef : undefined}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            activeId === cat.id
              ? "bg-white text-black shadow-lg"
              : "bg-white/10 text-white/80 backdrop-blur-sm border border-white/10"
          }`}
        >
          {cat.name}
        </motion.button>
      ))}
    </div>
  );
}
