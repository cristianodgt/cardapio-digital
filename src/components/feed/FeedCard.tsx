"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
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
  const [justAdded, setJustAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});

  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-120, 0, 120], [0.4, 1, 0.4]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 40;
    const velocity = Math.abs(info.velocity.x);
    const shouldSwipe = Math.abs(info.offset.x) > threshold || velocity > 300;

    if (shouldSwipe) {
      if (info.offset.x < 0 && mediaIndex < gallery.length - 1) {
        setMediaIndex((i) => i + 1);
      } else if (info.offset.x > 0 && mediaIndex > 0) {
        setMediaIndex((i) => i - 1);
      }
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 700);
    }
  };

  const handleAdd = () => {
    setQty((q) => q + 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 300);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: item.name, url: window.location.href });
      } catch {}
    }
  };

  return (
    <div className="relative w-full h-full snap-start snap-always overflow-hidden bg-black">
      {/* ── MEDIA LAYER ── */}
      {/* Fixed aspect ratio container — 9:16 portrait, centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-[480px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={mediaIndex}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={gallery[mediaIndex] || item.media_url}
                alt={`${item.name} - ${mediaIndex + 1}`}
                fill
                sizes="(max-width: 480px) 100vw, 480px"
                priority={isActive && mediaIndex === 0}
                onLoad={() =>
                  setImgLoaded((s) => ({ ...s, [mediaIndex]: true }))
                }
                className={cn(
                  "object-cover transition-opacity duration-300",
                  imgLoaded[mediaIndex] ? "opacity-100" : "opacity-0"
                )}
              />
            </motion.div>
          </AnimatePresence>

          {/* Swipe gesture layer */}
          {gallery.length > 1 && (
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              style={{ x: dragX, opacity: dragOpacity }}
              className="absolute inset-0 z-20 touch-pan-y"
            />
          )}
        </div>
      </div>

      {/* ── MEDIA INDICATORS ── */}
      {gallery.length > 1 && (
        <div className="absolute top-14 z-30 left-0 right-0 px-6">
          <div className="flex gap-[3px] max-w-[480px] mx-auto">
            {gallery.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-[2.5px] rounded-full transition-all duration-300",
                  i === mediaIndex ? "flex-[2.5] bg-white" : "flex-1 bg-white/20"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── HEART ANIMATION ── */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.3, opacity: 0, y: -80 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GRADIENT OVERLAYS ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

      {/* ── SIDE ACTIONS ── */}
      <div className="absolute right-0 z-20 bottom-0 pb-56 pr-4 safe-bottom">
        <div className="flex flex-col items-center gap-5 max-w-[480px]">
          <button onClick={handleLike} className="flex flex-col items-center gap-1 group">
            <motion.div
              whileTap={{ scale: 0.85 }}
              className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center"
            >
              <Heart
                className={cn(
                  "w-[22px] h-[22px] transition-colors",
                  liked ? "text-red-500 fill-red-500" : "text-white"
                )}
              />
            </motion.div>
            <span className="text-white/40 text-[10px] font-medium">Curtir</span>
          </button>
          <button onClick={handleShare} className="flex flex-col items-center gap-1 group">
            <motion.div
              whileTap={{ scale: 0.85 }}
              className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center"
            >
              <Share2 className="w-[22px] h-[22px] text-white" />
            </motion.div>
            <span className="text-white/40 text-[10px] font-medium">Enviar</span>
          </button>
        </div>
      </div>

      {/* ── BOTTOM CONTENT (Contained) ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 safe-bottom">
        <div className="max-w-[480px] mx-auto px-5 pb-7">
          {/* Card info container with flex-col for consistent alignment */}
          <div className="flex flex-col">
            {/* Badge */}
            {item.is_featured && (
              <div className="mb-2.5">
                <span className="inline-flex items-center h-6 px-2.5 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-[0.08em] rounded">
                  Destaque
                </span>
              </div>
            )}

            {/* Name — line-clamp-1 */}
            <h2 className="text-white text-[22px] font-bold leading-[1.2] tracking-[-0.02em] line-clamp-1 mb-1.5">
              {item.name}
            </h2>

            {/* Description — line-clamp-2, fixed height */}
            <p className="text-white/45 text-[13px] leading-[1.65] line-clamp-2 mb-4 pr-16 min-h-[43px]">
              {item.description}
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-white/8 mb-4" />

            {/* Price + Cart — mt-auto guarantees alignment */}
            <div className="flex items-center justify-between mt-auto">
              {/* Price */}
              <div className="flex items-baseline gap-0.5">
                <span className="text-white/35 text-[13px] font-medium">R$</span>
                <span className="text-white text-[26px] font-extrabold tracking-[-0.02em] leading-none tabular-nums">
                  {formatPrice(item.price)}
                </span>
              </div>

              {/* Quantity + Add */}
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {qty > 0 && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="flex items-center gap-1.5 overflow-hidden"
                    >
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setQty(Math.max(0, qty - 1))}
                        className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4 text-white/70" />
                      </motion.button>
                      <motion.span
                        key={qty}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-white font-bold text-[15px] w-6 text-center tabular-nums"
                      >
                        {qty}
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  animate={justAdded ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ duration: 0.25 }}
                  onClick={handleAdd}
                  className={cn(
                    "h-11 rounded-full flex items-center gap-2",
                    "bg-orange-500 shadow-lg shadow-orange-500/20",
                    "active:brightness-110 transition-all",
                    qty === 0 ? "px-5" : "w-11 justify-center px-0"
                  )}
                >
                  {qty === 0 ? (
                    <>
                      <ShoppingBag className="w-[17px] h-[17px] text-white" />
                      <span className="text-white text-[13px] font-semibold">
                        Adicionar
                      </span>
                    </>
                  ) : (
                    <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
