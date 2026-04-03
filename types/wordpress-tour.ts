export type WordPressTour = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  acf?: {
    tour_name?: string;
    tour_desc?: string;
    tour_featured_image?: {
      url?: string;
      alt?: string;
    };
    tour_gallery?: Array<{
      url?: string;
      alt?: string;
    }>;
    tour_duration?: string;
    tour_price_from?: number;
  };
};
