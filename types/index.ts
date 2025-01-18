export interface Review {
  id: string;
  name: string;
  rating: string;
  review: string;
  avatarUrl?: string;
}

export interface Show {
  id: string;
  title: string;
  genres: string[];
  description: string;
  imageUrl: string;
  ratings: {
    networkScore: string;
    allTimeScore: string;
  };
  watchlistCount: number;
  reviewCount: number;
  reviews: Review[];
  similarShows: {
    title: string;
    friendCount: number;
    rating: string;
    imageUrl: string;
  }[];
  lastUpdated: string;
}