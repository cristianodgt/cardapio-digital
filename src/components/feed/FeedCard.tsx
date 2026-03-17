"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import Image from "next/image";
import { Heart, Share2, Plus, Minus, ShoppingBag } from "lucide-react";
import { MenuItem } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

interface FeedCardProps {
  item: MenuItem;
  isActive: boolean;
}

export default function FeedCard({ item, isActive }: FeedCardProps) {
  const gallery = item.gallery || [item.media_url];
  const [mediaIndex, setMediaIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [qty, setQty] = useState(0);
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});
  const constraintsRef = useRef<HTMLDivElement>(null);

  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-100, 0, 100], [0.5, 1, 0.5]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && mediaIndex < gallery.length - 1) {
      setMediaIndex((i) => i + 1);
    } else if (info.offset.x > threshold && mediaIndex > 0) {
      setMediaIndex((i) => i - 1);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 700);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: item.name, url: window.location.href });
      } catch {}
    }
  };

  return (
    <div className="relative w-full h-full snap-start snap-always overflow-hidden">
      {/* Background media — swipeable */}
      <div ref={constraintsRef} className="absolute inset-0">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={mediaIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={gallery[mediaIndex] || item.media_url}
              alt={`${item.name} - ${mediaIndex + 1}`}
              fill
              sizes="100vw"
              priority={isActive && mediaIndex === 0}
              onLoad={() => setImgLoaded((s) => ({ ...s, [mediaIndex]: true }))}
              className={cn(
                "object-cover transition-opacity duration-300",
                imgLoaded[mediaIndex] ? "opacity-100" : "opacity-0"
              )}
            />
          </motion.div>
        </AnimatePresence>

        {/* Drag overlay for swipe gesture */}
        {gallery.length > 1 && (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ x: dragX, opacity: dragOpacity }}
            className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
          />
        )}
      </div>

      {/* Media indicators */}
      {gallery.length > 1 && (
        <div className="absolute top-14 left-6 right-6 z-30 flex gap-1">
          {gallery.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-[3px] rounded-full transition-all duration-300",
                i === mediaIndex ? "flex-[2] bg-white" : "flex-1 bg-white/25"
              )}
            />
          ))}
        </div>
      )}

      {/* Floating heart animation */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.2, opacity: 0, y: -60 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <Heart className="w-20 h-20 text-red-500 fill-red-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

      {/* Side actions */}
      <div className="absolute right-4 bottom-56 z-20 flex flex-col items-center gap-5">
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-all",
              "bg-black/30 backdrop-blur-md border border-white/10"
            )}
          >
            <Heart
              className={cn("w-[22px] h-[22px]", liked ? "text-red-500 fill-red-500" : "text-white")}
            />
          </div>
          <span className="text-white/50 text-[10px] font-medium">Curtir</span>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center active:scale-90 transition-all">
            <Share2 className="w-[22px] h-[22px] text-white" />
          </div>
          <span className="text-white/50 text-[10px] font-medium">Enviar</span>
        </button>
      </div>

      {/* Bottom content — proper spacing and alignment */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 safe-bottom">
        {/* Badge */}
        {item.is_featured && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2.5 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-[0.1em] rounded-md">
              Destaque
            </span>
          </div>
        )}

        {/* Name */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.01em] mb-2">
          {item.name}
        </h2>

        {/* Description */}
        <p className="text-white/50 text-sm leading-[1.6] line-clamp-2 mb-5 max-w-[85%]">
          {item.description}
        </p>

        {/* Price + Cart row */}
        <div className="flex items-center justify-between">
          {/* Price */}
          <div className="flex items-baseline gap-0.5">
            <span className="text-white/40 text-sm font-medium">R$</span>
            <span className="text-white text-[28px] font-extrabold tracking-tight leading-none">
              {formatPrice(item.price)}
            </span>
          </div>

          {/* Add to cart */}
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {qty > 0 && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="flex items-center gap-2 overflow-hidden"
                >
                  <button
                    onClick={() => setQty(Math.max(0, qty - 1))}
                    className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-white font-bold text-base w-6 text-center tabular-nums">
                    {qty}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setQty(qty + 1)}
              className={cn(
                "h-11 rounded-full flex items-center gap-2 active:scale-95 transition-all",
                "bg-orange-500 shadow-lg shadow-orange-500/25",
                qty === 0 ? "px-6" : "px-4"
              )}
            >
              {qty === 0 ? (
                <>
                  <ShoppingBag className="w-[18px] h-[18px] text-white" />
                  <span className="text-white text-sm font-semibold">Adicionar</span>
                </>
              ) : (
                <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
