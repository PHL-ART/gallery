"use client";
import { motion } from "framer-motion";

export default function PhotoTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex flex-col flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
