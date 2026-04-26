export interface Album {
  id: string;
  name: string;
  title: string;
  description?: string | null;
  isSpecial: boolean;
  photoCount?: number;
  coverS3Key?: string | null;
}
