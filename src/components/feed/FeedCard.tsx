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
import { Plus, Minus, ShoppingBag, Share2 } from "lucide-react";
import { MenuItem } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

interface FeedCardProps {
  item: MenuItem;
  isActive: boolean;
}

export default function FeedCard({ item, isActive }: FeedCardProps) {
  const gallery = item.gallery || [item.media_url];
  const [mediaIndex, setMediaIndex] = useState(0);
  const [qty, setQty] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});

  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-120, 0, 120], [0.5, 1, 0.5]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 40;
    const velocity = Math.abs(info.velocity.x);
    const shouldSwipe =
      Math.abs(info.offset.x) > threshold || velocity > 300;

    if (shouldSwipe) {
      if (info.offset.x < 0 && mediaIndex < gallery.length - 1) {
        setMediaIndex((i) => i + 1);
      } else if (info.offset.x > 0 && mediaIndex > 0) {
        setMediaIndex((i) => i - 1);
      }
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
        await navigator.share({
          title: item.name,
          url: window.location.href,
        });
      } catch {}
    }
  };

  return (
    <div className="relative w-full h-full snap-start snap-always overflow-hidden bg-black">
      {/* ── IMAGE ── */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full max-w-[480px] mx-auto">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={mediaIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
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

      {/* ── MEDIA DOTS — minimal ── */}
      {gallery.length > 1 && (
        <div className="absolute bottom-[210px] z-30 left-0 right-0 flex justify-center pointer-events-none">
          <div className="flex gap-[6px] items-center">
            {gallery.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === mediaIndex ? 20 : 6,
                  opacity: i === mediaIndex ? 1 : 0.4,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="h-[6px] rounded-full bg-white"
              />
            ))}
          </div>
        </div>
      )}

      {/* ── SWIPE HINT — temporary, first photo only ── */}
      <AnimatePresence>
        {gallery.length > 1 && mediaIndex === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="absolute top-1/2 -translate-y-1/2 right-4 z-30 pointer-events-none"
          >
            <motion.div
              animate={{ x: [0, -10, 0] }}
              transition={{ repeat: 3, duration: 1, ease: "easeInOut", delay: 1.8 }}
              className="flex items-center justify-center gap-1.5 bg-black/50 backdrop-blur-md rounded-full"
              style={{ padding: "6px 14px" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="text-white/80 text-[10px] font-semibold tracking-wide">
                deslize
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GRADIENT — only bottom, subtle ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

      {/* ── BOTTOM CONTENT ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 safe-bottom">
        <div className="max-w-[480px] mx-auto" style={{ padding: "0 20px 28px" }}>
          {/* Badge + Share row */}
          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <div>
              {item.is_featured && (
                <span
                  className="inline-flex items-center bg-orange-500/90 text-white text-[10px] font-bold uppercase tracking-[0.08em] rounded-sm"
                  style={{ height: 22, padding: "0 10px" }}
                >
                  Destaque
                </span>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
            >
              <Share2 className="w-[16px] h-[16px] text-white/60" />
            </motion.button>
          </div>

          {/* Name — largest text, primary hierarchy */}
          <h2
            className="text-white text-[22px] font-bold leading-[1.15] tracking-[-0.02em] line-clamp-2"
            style={{ marginBottom: 6 }}
          >
            {item.name}
          </h2>

          {/* Description — readable but secondary */}
          <p
            className="text-white/55 text-[13px] leading-[1.55] line-clamp-2"
            style={{ marginBottom: 16 }}
          >
            {item.description}
          </p>

          {/* Price + Cart row */}
          <div className="flex items-center justify-between">
            {/* Price — clear hierarchy */}
            <div className="flex items-baseline gap-1">
              <span className="text-white/50 text-[14px] font-medium">
                R$
              </span>
              <span className="text-white text-[28px] font-extrabold tracking-[-0.02em] leading-none tabular-nums">
                {formatPrice(item.price)}
              </span>
            </div>

            {/* Add to cart — prominent CTA */}
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
                    className="flex items-center gap-2 overflow-hidden"
                  >
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setQty(Math.max(0, qty - 1))}
                      className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4 text-white/80" />
                    </motion.button>
                    <motion.span
                      key={qty}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-white font-bold text-[16px] w-6 text-center tabular-nums"
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
                style={{ padding: qty === 0 ? "0 24px" : 0 }}
                className={cn(
                  "h-12 rounded-full flex items-center gap-2",
                  "bg-orange-500 shadow-lg shadow-orange-500/25",
                  "active:brightness-110 transition-all",
                  qty === 0 ? "" : "w-12 justify-center"
                )}
              >
                {qty === 0 ? (
                  <>
                    <ShoppingBag className="w-[18px] h-[18px] text-white" />
                    <span className="text-white text-[14px] font-semibold">
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
  );
}
