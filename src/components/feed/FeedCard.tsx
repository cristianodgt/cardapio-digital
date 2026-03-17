"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
import Image from "next/image";
import { Plus, Minus, ShoppingBag, Share2, ChevronDown } from "lucide-react";
import { MenuItem } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

interface FeedCardProps {
  item: MenuItem;
  isActive: boolean;
}

/* Stagger children variants — GPU only (transform + opacity) */
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const fadeSlideRight = {
  hidden: { opacity: 0, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function FeedCard({ item, isActive }: FeedCardProps) {
  const gallery = item.gallery || [item.media_url];
  const [mediaIndex, setMediaIndex] = useState(0);
  const [qty, setQty] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});
  const [swipeDir, setSwipeDir] = useState<"left" | "right">("left");

  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-120, 0, 120], [0.5, 1, 0.5]);

  /* Shimmer pulse for CTA button */
  const [shimmer, setShimmer] = useState(false);
  useEffect(() => {
    if (!isActive || qty > 0) return;
    const id = setInterval(() => {
      setShimmer(true);
      setTimeout(() => setShimmer(false), 600);
    }, 4000);
    return () => clearInterval(id);
  }, [isActive, qty]);

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
        setSwipeDir("left");
        setMediaIndex((i) => i + 1);
      } else if (info.offset.x > 0 && mediaIndex > 0) {
        setSwipeDir("right");
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

  /* Slide direction for media transitions */
  const slideX = swipeDir === "left" ? 60 : -60;

  return (
    <div className="relative w-full h-full snap-start snap-always overflow-hidden bg-black">
      {/* ── IMAGE with parallax slide ── */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full max-w-[480px] mx-auto">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={mediaIndex}
              initial={{ opacity: 0, x: slideX, scale: 1.04 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -slideX, scale: 0.96 }}
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

      {/* ── GRADIENT ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

      {/* ── BOTTOM CONTENT — staggered entry ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 safe-bottom">
        <motion.div
          className="max-w-[480px] mx-auto"
          style={{ padding: "0 20px 28px" }}
          variants={staggerContainer}
          initial="hidden"
          animate={isActive ? "visible" : "hidden"}
        >
          {/* Badge + Share row */}
          <motion.div
            variants={fadeSlideRight}
            className="flex items-center justify-between"
            style={{ marginBottom: 8 }}
          >
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
          </motion.div>

          {/* Name */}
          <motion.h2
            variants={fadeSlideUp}
            className="text-white text-[22px] font-bold leading-[1.15] tracking-[-0.02em] line-clamp-2"
            style={{ marginBottom: 6 }}
          >
            {item.name}
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={fadeSlideUp}
            className="text-white/55 text-[13px] leading-[1.55] line-clamp-2"
            style={{ marginBottom: 16 }}
          >
            {item.description}
          </motion.p>

          {/* Price + Hint + Cart row */}
          <motion.div
            variants={fadeSlideUp}
            className="flex items-center justify-between"
          >
            {/* Price */}
            <div className="flex items-baseline gap-1 shrink-0">
              <span className="text-white/50 text-[14px] font-medium">
                R$
              </span>
              <span className="text-white text-[28px] font-extrabold tracking-[-0.02em] leading-none tabular-nums">
                {formatPrice(item.price)}
              </span>
            </div>

            {/* Scroll hint */}
            <motion.div
              animate={{ y: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="flex items-center gap-0.5 mx-2"
            >
              <span className="text-white/20 text-[7px] font-medium tracking-wider uppercase whitespace-nowrap">
                mais
              </span>
              <ChevronDown className="w-2.5 h-2.5 text-white/20" />
            </motion.div>

            {/* Add to cart */}
            <div className="flex items-center gap-2 shrink-0">
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
                  "h-12 rounded-full flex items-center gap-2 relative overflow-hidden",
                  "bg-orange-500 shadow-lg shadow-orange-500/25",
                  "active:brightness-110 transition-all",
                  qty === 0 ? "" : "w-12 justify-center"
                )}
              >
                {/* Shimmer overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={shimmer ? { x: "100%" } : { x: "-100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
                {qty === 0 ? (
                  <>
                    <ShoppingBag className="w-[18px] h-[18px] text-white relative z-10" />
                    <span className="text-white text-[14px] font-semibold relative z-10">
                      Adicionar
                    </span>
                  </>
                ) : (
                  <Plus className="w-5 h-5 text-white relative z-10" strokeWidth={2.5} />
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
