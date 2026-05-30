"use client";
import { motion } from "framer-motion";

export default function GalleryTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.25, 0, 0.15, 1] }}
    >
      {children}
    </motion.div>
  );
}
