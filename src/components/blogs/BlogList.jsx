import { useFetchBlogs } from "@/hooks/useFetchBlogs";
import blog1 from "@/public/images/blog1.png";
import BlogListSkeleton from "@/skeletons/BlogListSkeleton";
import Image from "next/image";
import Link from "next/link";

const BlogList = ({ slug, heading }) => {
  const { data, isLoading, isError, error } = useFetchBlogs(
    `/category/${slug}`
  );

  if (isLoading) return <BlogListSkeleton />;
  if (isError) return <p>{error.message}</p>;
  if (data?.data?.length === 0) return <p>No data found!</p>;
  const blogs = data?.data;
  return (
    <div>
      <h2 className="text-[32px] font-bold mb-4">{heading}</h2>
      <div className="space-y-4">
        {blogs.slice(0, 4).map((blog, index) => (
          <Link
            key={blog?.slug}
            href={`/travel-blog/${blog.slug}`}
            className="flex  overflow-hidden items-start border-b pb-5"
          >
            <Image
              src={blog?.image}
              alt={blog?.title}
              height={200}
              width={200}
              className="w-[112px] h-[112px] rounded-lg object-cover"
            />
            <div className="px-4 flex-1">
              <span className="text-xs font-semibold text-[#192024] uppercase">
                {blog?.category}
              </span>
              <h3 className="text-sm font-bold mt-1 text-[#192024]">
                {blog?.title}
              </h3>
              <div className="flex items-center mt-2">
                <Image
                  src={blog1}
                  alt={blog?.author}
                  className="rounded-full w-[34px] h-[34px]"
                />
                <Link href={`/author/id`}>
                  <span className="ml-2 text-[14px] text-gray-600">
                    {blog?.author || "Author"} |{" "}
                    {blog?.readTime || "9 mins read"}
                  </span>
                </Link>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogList;

// const trendingData = [
//   {
//     title: "The 10 best warm places to visit in March",
//     category: "Travel Recommendations",
//     author: "Duncan Madden",
//     readTime: "12 mins read",
//     image: blog1,
//   },
//   {
//     title:
//       "Here's your selection of 10 all-inclusive vacations with no passport needed",
//     category: "Travel Recommendations",
//     author: "Jennifer Breking",
//     readTime: "7 mins read",
//     image: blog1,
//   },
//   {
//     title: "The 6 largest airports in the world",
//     category: "Tips & Tricks",
//     author: "Jennifer Sincocco",
//     readTime: "9 mins read",
//     image: blog1,
//   },
//   {
//     title: "The 10 best warm places to visit in February",
//     category: "Travel Recommendations",
//     author: "Duncan Madden",
//     readTime: "12 mins read",
//     image: blog1,
//   },
// ];
