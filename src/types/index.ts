export interface ColorLayer {
  label: string;
  hex: string;
  rgb: string;
}

export interface StrategySpot {
  id: string;
  name: string;
  position: { x: number; y: number };
  description: string;
  colors: ColorLayer[];
  styleNote?: string;
  hiderImage?: string;
  seekerImage?: string;
  stealthRating: number;
  difficultyRating: number;
  discoveredBy: string;
  discovererLink: string;
  successRate: number;
  isApproved: boolean;
  isAuthorPick?: boolean;
}

export interface WorkshopMap {
  id: string;
  title: string;
  author: string;
  authorLink: string;
  thumbnail: string;
  overviewImage: string;
  steamWorkshopUrl: string;
  tags: string[];
  spotCount: number;
  popularity: number;
  subscribers: number;
  fileSize: string;
  createdAt: string;
  updatedAt: string;
  spots: StrategySpot[];
}

export type SortMode = "popularity" | "newest" | "spots";

export interface PendingSpot {
  id: string;
  mapId: string;
  mapTitle: string;
  name: string;
  position: { x: number; y: number };
  colors: ColorLayer[];
  styleNote: string;
  description: string;
  discoveredBy: string;
  discovererLink: string;
  hiderImage?: string;
  seekerImage?: string;
  submittedAt: string;
  isApproved: boolean;
}
