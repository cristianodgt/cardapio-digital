"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Heart, Share2, Plus, Minus, ShoppingBag } from "lucide-react";
import { MenuItem } from "@/lib/types";

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

  const currentMedia = gallery[mediaIndex] || item.media_url;

  const goNext = useCallback(() => {
    setMediaIndex((i) => (i < gallery.length - 1 ? i + 1 : i));
  }, [gallery.length]);

  const goPrev = useCallback(() => {
    setMediaIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

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
      {/* Background media with crossfade */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={mediaIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Image
            src={currentMedia}
            alt={`${item.name} - ${mediaIndex + 1}`}
            fill
            sizes="100vw"
            priority={isActive && mediaIndex === 0}
            onLoad={() => setImgLoaded((s) => ({ ...s, [mediaIndex]: true }))}
            className={`object-cover transition-opacity duration-300 ${
              imgLoaded[mediaIndex] ? "opacity-100" : "opacity-0"
            }`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Tap zones for horizontal media navigation */}
      {gallery.length > 1 && (
        <>
          {mediaIndex > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-0 top-0 w-1/4 h-3/4 z-20"
              aria-label="Foto anterior"
            />
          )}
          {mediaIndex < gallery.length - 1 && (
            <button
              onClick={goNext}
              className="absolute right-0 top-0 w-1/4 h-3/4 z-20"
              aria-label="Próxima foto"
            />
          )}
        </>
      )}

      {/* Media indicators */}
      {gallery.length > 1 && (
        <div className="absolute top-12 left-0 right-0 z-20 flex justify-center gap-1 px-16">
          {gallery.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                i === mediaIndex ? "flex-[3] bg-white" : "flex-1 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* Floating heart */}
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

      {/* Side actions */}
      <div className="absolute right-3 bottom-48 z-20 flex flex-col items-center gap-4">
        <button onClick={handleLike} className="flex flex-col items-center gap-0.5">
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform">
            <Heart
              className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : "text-white"}`}
            />
          </div>
          <span className="text-white/50 text-[9px]">Curtir</span>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center gap-0.5">
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white/50 text-[9px]">Enviar</span>
        </button>
      </div>

      {/* Bottom: info + purchase */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 safe-bottom">
        <div className="mb-3">
          {item.is_featured && (
            <span className="inline-block px-2 py-0.5 bg-orange-500/90 text-white text-[9px] font-bold uppercase tracking-widest rounded mb-2">
              Destaque
            </span>
          )}
          <h2 className="text-white text-xl font-bold leading-snug mb-1">
            {item.name}
          </h2>
          <p className="text-white/45 text-[13px] leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-white/40 text-xs">R$</span>
            <span className="text-white text-2xl font-extrabold tracking-tight">
              {item.price.toFixed(2).replace(".", ",")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {qty > 0 && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                className="flex items-center gap-1 overflow-hidden"
              >
                <button
                  onClick={() => setQty(Math.max(0, qty - 1))}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
                >
                  <Minus className="w-3.5 h-3.5 text-white" />
                </button>
                <span className="text-white font-bold text-sm w-5 text-center">{qty}</span>
              </motion.div>
            )}
            <button
              onClick={() => setQty(qty + 1)}
              className="h-10 px-5 rounded-full bg-orange-500 flex items-center gap-2 active:scale-95 transition-transform shadow-lg shadow-orange-500/25"
            >
              {qty === 0 ? (
                <>
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-bold">Adicionar</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-bold">Mais</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
