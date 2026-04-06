import Image from "next/image";
import { notFound } from "next/navigation";
import { getTourBySlug } from "@/lib/api/tour";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TourDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  return (
    <main>
      <h1>{tour.name}</h1>

      {tour.featuredImage && (
        <div>
          <Image
            src={tour.featuredImage}
            alt={tour.name}
            unoptimized
            width={1200}
            height={700}
          />
        </div>
      )}

      <p>{tour.desc}</p>
      <p>Thời lượng: {tour.duration}</p>

      {tour.priceFrom !== null && (
        <p>Giá từ: {tour.priceFrom.toLocaleString("vi-VN")} VNĐ</p>
      )}

      {tour.gallery.length > 0 && (
        <section>
          <h2>Gallery</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
            }}
          >
            {tour.gallery.map((imageUrl, index) => (
              <div key={`${imageUrl}-${index}`}>
                <Image
                  src={imageUrl}
                  alt={`${tour.name} - ${index + 1}`}
                  unoptimized
                  width={500}
                  height={350}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}