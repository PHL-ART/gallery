"use client";
import { motion } from "framer-motion";
import { PhotoCard } from "./PhotoCard";

interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  tags?: string[];
  context?: string;
}

interface Props {
  photos: PhotoItem[];
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.25, 0, 0.15, 1] },
  },
};

export function MotionPhotoGrid({ photos }: Props) {
  return (
    <motion.div
      className="grid grid-cols-3 gap-md px-xl pb-[var(--space-3xl)] max-md:grid-cols-2 max-md:gap-sm max-md:px-md"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {photos.map((photo) => (
        <motion.div key={photo.id} variants={item}>
          <PhotoCard
            id={photo.id}
            src={photo.src}
            alt={photo.alt}
            tags={photo.tags}
            context={photo.context}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
