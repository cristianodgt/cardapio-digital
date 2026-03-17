"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MenuItem, Category } from "@/lib/types";
import FeedCard from "./FeedCard";
import CategoryPills from "@/components/ui/CategoryPills";

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
    // Scroll to top when category changes
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
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 safe-top">
        <div className="px-4 pt-3 pb-1">
          <h1 className="text-white font-bold text-lg tracking-tight drop-shadow-lg">
            {establishmentName}
          </h1>
        </div>
        <CategoryPills
          categories={categories}
          activeId={activeCategory}
          onSelect={handleCategoryChange}
        />
      </div>

      {/* Feed container */}
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
            <p className="text-white/50 text-lg">
              Nenhum item nesta categoria
            </p>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      {activeIndex === 0 && filteredItems.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 rounded-full bg-white/60 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
