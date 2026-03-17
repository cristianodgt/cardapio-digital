"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MenuItem, Category } from "@/lib/types";
import FeedCard from "./FeedCard";

interface VerticalFeedProps {
  items: MenuItem[];
  categories: Category[];
  establishmentName: string;
}

export default function VerticalFeed({
  items,
  categories,
  establishmentName,
}: VerticalFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = activeCategory
    ? items.filter((item) => item.category_id === activeCategory)
    : items;

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const index = Math.round(container.scrollTop / container.clientHeight);
    setActiveIndex(index);
  }, []);

  const handleCategoryChange = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    setActiveIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="relative w-full h-dvh bg-black overflow-hidden">
      {/* Header — single line: name + scrollable pills */}
      <div className="absolute top-0 left-0 right-0 z-30 safe-top bg-gradient-to-b from-black/70 via-black/30 to-transparent pb-6">
        <div className="flex items-center gap-3 px-4 pt-3 max-w-[480px] mx-auto">
          <h1 className="text-white font-bold text-sm tracking-tight drop-shadow-lg shrink-0 uppercase">
            {establishmentName}
          </h1>
          <div className="w-px h-4 bg-white/20 shrink-0" />
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pr-4">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeCategory === null
                  ? "bg-orange-500 text-white"
                  : "bg-white/10 text-white/60"
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-orange-500 text-white"
                    : "bg-white/10 text-white/60"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      >
        {filteredItems.map((item, index) => (
          <div key={item.id} className="w-full h-dvh">
            <FeedCard item={item} isActive={index === activeIndex} />
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="w-full h-dvh flex items-center justify-center">
            <p className="text-white/40 text-base">Nenhum item nesta categoria</p>
          </div>
        )}
      </div>
    </div>
  );
}
