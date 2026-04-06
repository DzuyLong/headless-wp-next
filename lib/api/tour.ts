import { fetchGraphQL } from "@/lib/graphql";
import { GET_TOURS_QUERY } from "@/lib/queries/tour";

type TourFeaturedImageNode = {
  mediaItemUrl: string;
};

type TourGalleryNode = {
  mediaItemUrl: string;
};

type TourNode = {
  id: string;
  databaseId: number;
  slug: string;
  title: string;
  tourGroupAcf?: {
    fieldGroupName?: string;
    tourDesc?: string;
    tourDuration?: string;
    tourName?: string;
    tourPriceFrom?: number;
    tourFeaturedImage?: {
      node?: TourFeaturedImageNode | null;
    } | null;
    tourGallery?: {
      edges?: Array<{
        node?: TourGalleryNode | null;
      }>;
    } | null;
  };
};

type GetToursResponse = {
  tours: {
    nodes: TourNode[];
  };
};

export type TourItem = {
  id: string;
  databaseId: number;
  slug: string;
  title: string;
  name: string;
  desc: string;
  duration: string;
  priceFrom: number | null;
  featuredImage: string;
  gallery: string[];
};

function normalizeTour(node: TourNode): TourItem {
  return {
    id: node.id,
    databaseId: node.databaseId,
    slug: node.slug,
    title: node.title,
    name: node.tourGroupAcf?.tourName || node.title,
    desc: node.tourGroupAcf?.tourDesc || "",
    duration: node.tourGroupAcf?.tourDuration || "",
    priceFrom: node.tourGroupAcf?.tourPriceFrom ?? null,
    featuredImage:
      node.tourGroupAcf?.tourFeaturedImage?.node?.mediaItemUrl || "",
    gallery:
      node.tourGroupAcf?.tourGallery?.edges
        ?.map((edge) => edge.node?.mediaItemUrl || "")
        .filter(Boolean) || [],
  };
}


export async function getTours(): Promise<TourItem[]> {
  const data = await fetchGraphQL<GetToursResponse>(GET_TOURS_QUERY);

  return data.tours.nodes.map(normalizeTour);
}

export async function getTourBySlug(slug: string): Promise<TourItem | null> {
  const tours = await getTours();

  return tours.find((tour) => tour.slug === slug) || null;
}