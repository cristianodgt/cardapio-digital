"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { MenuItem } from "@/lib/types";
import MediaPlayer from "./MediaPlayer";
import ItemDetails from "./ItemDetails";
import PriceTag from "@/components/ui/PriceTag";
import ActionButtons from "@/components/ui/ActionButtons";

interface FeedCardProps {
  item: MenuItem;
  isActive: boolean;
}

export default function FeedCard({ item, isActive }: FeedCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative w-full h-full snap-start snap-always">
      {/* Background media */}
      <MediaPlayer item={item} isActive={isActive && !showDetails} />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none h-32" />

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-8 flex items-end gap-3 z-10">
        {/* Item info */}
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {item.is_featured && (
              <span className="inline-block px-2.5 py-0.5 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
                Destaque
              </span>
            )}
            <h2 className="text-white text-2xl font-bold leading-tight mb-1 drop-shadow-lg">
              {item.name}
            </h2>
            <p className="text-white/60 text-sm line-clamp-2 mb-3 leading-relaxed">
              {item.description}
            </p>
            <div className="flex items-center gap-3">
              <PriceTag price={item.price} />
              <button
                onClick={() => setShowDetails(true)}
                className="flex items-center gap-1 text-white/50 text-xs font-medium"
              >
                Ver mais
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Action buttons */}
        <ActionButtons onAdd={() => setShowDetails(true)} />
      </div>

      {/* Horizontal detail view */}
      <AnimatePresence>
        {showDetails && (
          <ItemDetails item={item} onClose={() => setShowDetails(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
