import { useFetchBlogs } from "@/hooks/useFetchBlogs";
import blog1 from "@/public/images/blog1.png";
import BlogListSkeleton from "@/skeletons/BlogListSkeleton";
import Image from "next/image";
import Link from "next/link";

const BlogList = ({ category, heading }) => {
  const { data, isLoading, isError, error } = useFetchBlogs(
    `/category/${category}`
  );

  const trendingBlogs = data?.data?.slice(0, 4);

  if (isLoading) return <BlogListSkeleton />;
  if (isError) return <p>{error.message}</p>;
  if (trendingBlogs.length === 0) return <p>No data found!</p>;

  return (
    <div>
      <h2 className="text-[32px] font-bold mb-4">{heading}</h2>
      <div className="space-y-4">
        {trendingBlogs.map((article, index) => (
          <Link
            key={article?.slug}
            href={`/travel-blog/${article.slug}`}
            className="flex  overflow-hidden items-start border-b pb-5"
          >
            <Image
              src={article?.image}
              alt={article?.title}
              height={200}
              width={200}
              className="w-[112px] h-[112px] rounded-lg object-cover"
            />
            <div className="px-4 flex-1">
              <span className="text-xs font-semibold text-[#192024] uppercase">
                {article?.category}
              </span>
              <h3 className="text-sm font-bold mt-1 text-[#192024]">
                {article?.title}
              </h3>
              <div className="flex items-center mt-2">
                <Image
                  src={blog1}
                  alt={article?.author}
                  className="rounded-full w-[34px] h-[34px]"
                />
                <Link href={`/author/id`}>
                  <span className="ml-2 text-[14px] text-gray-600">
                    {article?.author || "Author"} |{" "}
                    {article?.readTime || "9 mins read"}
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
