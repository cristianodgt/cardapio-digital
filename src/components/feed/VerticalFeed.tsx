"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MenuItem, Category } from "@/lib/types";
import FeedCard from "./FeedCard";
import { cn } from "@/lib/utils";

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
  const [showScrollHint, setShowScrollHint] = useState(true);

  const filteredItems = activeCategory
    ? items.filter((item) => item.category_id === activeCategory)
    : items;

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const index = Math.round(container.scrollTop / container.clientHeight);
    setActiveIndex(index);
    if (index > 0) setShowScrollHint(false);
  }, []);

  const handleCategoryChange = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    setActiveIndex(0);
    setShowScrollHint(true);
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
      {/* ── HEADER ── */}
      <div className="absolute top-0 left-0 right-0 z-30 safe-top">
        <div className="bg-gradient-to-b from-black/80 via-black/40 to-transparent" style={{ paddingBottom: 16 }}>
          <div className="max-w-[480px] mx-auto" style={{ padding: "16px 16px 0" }}>
            {/* Establishment name */}
            <h1
              className="text-white font-bold text-[13px] tracking-[0.06em] drop-shadow-lg uppercase"
              style={{ marginBottom: 12 }}
            >
              {establishmentName}
            </h1>

            {/* Category pills — proper touch targets */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
              <button
                onClick={() => handleCategoryChange(null)}
                style={{ padding: "8px 16px" }}
                className={`shrink-0 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                  activeCategory === null
                    ? "bg-orange-500 text-white"
                    : "bg-white/10 text-white/60 active:bg-white/20"
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  style={{ padding: "8px 16px" }}
                  className={`shrink-0 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                    activeCategory === cat.id
                      ? "bg-orange-500 text-white"
                      : "bg-white/10 text-white/60 active:bg-white/20"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FEED ── */}
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
            <p className="text-white/40 text-base">
              Nenhum item nesta categoria
            </p>
          </div>
        )}
      </div>

      {/* ── SCROLL HINT ── */}
      <AnimatePresence>
        {showScrollHint && filteredItems.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="absolute bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none safe-bottom"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-white/40 text-[10px] font-medium tracking-wide uppercase">
                Deslize para ver mais
              </span>
              <ChevronDown className="w-4 h-4 text-white/40" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
