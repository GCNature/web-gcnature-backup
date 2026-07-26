// Review data system - unique reviews per product/category
export interface Review {
  name: string;
  avatar: string;
  color: string;
  rating: number;
  date: string;
  verified: boolean;
  text: string;
  helpful: number;
  images: string[];
}

export interface ReviewSummary {
  avgRating: number;
  totalReviews: number;
  distribution: { stars: number; count: number; pct: number }[];
}

/*
// All possible reviews - categorized
const glassesReviews: Review[] = [
...
*/

// Get review summary for a product
export function getReviewSummary(reviews: Review[]): ReviewSummary {
  const total = reviews.length;
  if (total === 0) {
    return {
      avgRating: 0,
      totalReviews: 0,
      distribution: [5,4,3,2,1].map(s => ({ stars: s, count: 0, pct: 0 })),
    };
  }
  
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = Math.round((sum / total) * 10) / 10;
  
  const dist = [5,4,3,2,1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    return { stars, count, pct: Math.round((count / total) * 100) };
  });
  
  return { avgRating: avg, totalReviews: total, distribution: dist };
}
