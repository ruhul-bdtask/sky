import { useFetchBlogs } from "@/hooks/useFetchBlogs";
import blog1 from "@/public/images/blog1.png";
import BlogsPageSkeleton from "@/skeletons/BlogsPageSkeleton";
import Image from "next/image";
import Link from "next/link";

export default function LatestBlog() {
  const { data, isLoading, isError, error } = useFetchBlogs("/category/latest");

  const blogs = data?.data;
  const latestBlog = blogs?.find(
    (blog) => blog.category.toLowerCase() === "latest".toLowerCase()
  );
  if (isLoading) return <BlogsPageSkeleton />;
  if (isError) return <p>{error.message}</p>;
  return (
    <>
      <div className="lg:col-span-1">
        <h2 className="text-[32px] font-bold mb-4">Latest</h2>
        <div className="overflow-hidden">
          <Link href={`/travel-blog/${"slug"}`}>
            <Image
              src={latestBlog?.image}
              height={600}
              width={600}
              alt="Tropical destination"
              className="w-full h-full rounded-[8px]  object-cover"
            />
          </Link>
          <div className="py-4">
            <span className="text-[14px] font-semibold text-[#192024] uppercase">
              Travel Recommendations
            </span>
            <h3 className="text-[20px] font-semibold mt-2 text-[#192024]">
              {latestBlog.title}
            </h3>
            <p className="text-[15px] mt-2 text-[#192024]">
              Experience Venice without the crowds this winter.
            </p>
            <div className="flex items-center mt-4">
              <Image
                src={blog1}
                alt={"author"}
                className="rounded-full w-[34px] h-[34px]"
              />
              <span className="ml-2 text-sm text-gray-600">
                Jennifer Breking | 9 mins read
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
