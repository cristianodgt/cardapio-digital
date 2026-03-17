"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { MenuItem } from "@/lib/types";
import PriceTag from "@/components/ui/PriceTag";

interface ItemDetailsProps {
  item: MenuItem;
  onClose: () => void;
}

export default function ItemDetails({ item, onClose }: ItemDetailsProps) {
  const gallery = item.gallery || [item.media_url];
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => setCurrentIndex((i) => Math.min(i + 1, gallery.length));
  const goPrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  // Last slide is the info slide
  const isInfoSlide = currentIndex === gallery.length;
  const totalSlides = gallery.length + 1;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="absolute inset-0 z-40 bg-black"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Slide indicators */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-1.5">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "w-6 bg-white"
                : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Slides */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="popLayout" initial={false}>
          {!isInfoSlide ? (
            <motion.div
              key={`media-${currentIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Image
                src={gallery[currentIndex]}
                alt={`${item.name} - foto ${currentIndex + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          ) : (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black flex flex-col items-start justify-center px-8 pb-20"
            >
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold text-white mb-4"
              >
                {item.name}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/70 text-lg leading-relaxed mb-6"
              >
                {item.description}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <PriceTag price={item.price} />
              </motion.div>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-lg active:scale-95 transition-transform shadow-lg shadow-orange-500/30"
              >
                Adicionar ao pedido
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation touch areas */}
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-0 top-0 w-1/3 h-full z-30"
            aria-label="Anterior"
          />
        )}
        {currentIndex < totalSlides - 1 && (
          <button
            onClick={goNext}
            className="absolute right-0 top-0 w-1/3 h-full z-30"
            aria-label="Próximo"
          />
        )}

        {/* Navigation arrows (desktop) */}
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10 opacity-0 md:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}
        {currentIndex < totalSlides - 1 && (
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10 opacity-0 md:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
