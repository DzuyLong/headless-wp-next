import Image from "next/image";
import Link from "next/link";
import { getTours } from "@/lib/api/tour";

export default async function ToursPage() {
  const tours = await getTours();
console.log("Tours data:", tours);
  return (
    <main>
      <h1>Danh sách tour</h1>

      {tours.length === 0 ? (
        <p>Không có tour nào.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          {tours.map((tour) => (
            <article
              key={tour.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <Link
                href={`/tours/${tour.slug}`}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                {tour.featuredImage && (
                  <div>
                    <Image
                      src={tour.featuredImage}
                      alt={tour.name}
                      width={360}
                      height={360}
                      unoptimized
                      className="w-full h-auto"
                    />
                  </div>
                )}

                <div style={{ padding: "16px" }}>
                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: "12px",
                      fontSize: "20px",
                    }}
                  >
                    {tour.name}
                  </h2>

                  {tour.duration && (
                    <p style={{ margin: "0 0 8px" }}>
                      <strong>Thời lượng:</strong> {tour.duration}
                    </p>
                  )}

                  {tour.priceFrom !== null && (
                    <p style={{ margin: "0 0 8px" }}>
                      <strong>Giá từ:</strong>{" "}
                      {tour.priceFrom.toLocaleString("vi-VN")} VNĐ
                    </p>
                  )}

                  {tour.desc && (
                    <p
                      style={{
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: "hidden",
                      }}
                    >
                      {tour.desc}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}