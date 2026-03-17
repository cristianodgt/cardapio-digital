"use client";

import { motion } from "framer-motion";

interface PriceTagProps {
  price: number;
}

export default function PriceTag({ price }: PriceTagProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
      className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20"
    >
      <span className="text-white/70 text-sm font-medium">R$</span>
      <span className="text-white text-lg font-bold">
        {price.toFixed(2).replace(".", ",")}
      </span>
    </motion.div>
  );
}
