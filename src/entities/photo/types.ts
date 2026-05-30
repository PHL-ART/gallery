import type { Tag } from "@/entities/tag/types";
import type { Album } from "@/entities/album/types";

export interface Photo {
  id: string;
  s3Key: string;
  publishedAt: Date;
  shotAt?: Date | null;
  exifData?: Record<string, string> | null;
  tags?: Pick<Tag, "id" | "name" | "title">[];
  albums?: Pick<Album, "id" | "name" | "title">[];
}
