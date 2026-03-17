"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, ShoppingBag, Plus } from "lucide-react";

interface ActionButtonsProps {
  onAdd?: () => void;
}

export default function ActionButtons({ onAdd }: ActionButtonsProps) {
  const [liked, setLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Confira esse item!",
          url: window.location.href,
        });
      } catch {}
    }
  };

  const buttons = [
    {
      icon: Heart,
      label: "Curtir",
      onClick: handleLike,
      active: liked,
      activeColor: "text-red-500",
      fill: liked,
    },
    {
      icon: Share2,
      label: "Compartilhar",
      onClick: handleShare,
      active: false,
      activeColor: "",
      fill: false,
    },
    {
      icon: ShoppingBag,
      label: "Pedir",
      onClick: onAdd,
      active: false,
      activeColor: "",
      fill: false,
    },
  ];

  return (
    <>
      {/* Floating heart animation */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0, y: -100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <Heart className="w-24 h-24 text-red-500 fill-red-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons sidebar */}
      <div className="flex flex-col items-center gap-5">
        {buttons.map((btn, i) => (
          <motion.button
            key={btn.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, type: "spring" }}
            onClick={btn.onClick}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center active:scale-90 transition-transform">
              <btn.icon
                className={`w-5 h-5 transition-colors ${
                  btn.active ? btn.activeColor : "text-white"
                }`}
                fill={btn.fill ? "currentColor" : "none"}
              />
            </div>
            <span className="text-white/70 text-[10px] font-medium">
              {btn.label}
            </span>
          </motion.button>
        ))}

        {/* Add to cart - highlighted */}
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          onClick={onAdd}
          className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 active:scale-90 transition-transform"
        >
          <Plus className="w-7 h-7 text-white" strokeWidth={3} />
        </motion.button>
      </div>
    </>
  );
}
