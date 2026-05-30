"use client";
import { motion } from "framer-motion";
import { AlbumCard } from "./AlbumCard";

interface AlbumItem {
  id: string;
  title: string;
  photoCount?: number;
  coverSrc?: string;
  href?: string;
}

interface Props {
  albums: AlbumItem[];
  cols?: 3 | 4;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0, 0.15, 1] },
  },
};

const colClass: Record<3 | 4, string> = {
  3: "grid-cols-3 max-md:grid-cols-2",
  4: "grid-cols-4 max-md:grid-cols-2",
};

export function MotionAlbumGrid({ albums, cols = 3 }: Props) {
  return (
    <motion.div
      className={`grid ${colClass[cols]} gap-md px-xl pb-[var(--space-3xl)] max-md:gap-sm max-md:px-md`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {albums.map((album) => (
        <motion.div key={album.id} variants={item}>
          <AlbumCard
            id={album.id}
            title={album.title}
            photoCount={album.photoCount}
            coverSrc={album.coverSrc}
            href={album.href}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
