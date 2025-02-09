"use client";
import BlackBlog from "@/components/blogs/BlackBlog";
import BlogList from "@/components/blogs/BlogList";
import BlogCategorySection from "@/components/blogs/BlogCategorySection";
import BlogsNavbar from "@/components/blogs/BlogsNavbar";
import LatestBlog from "@/components/blogs/LatestBlog";
import { useFetchBlogs } from "@/hooks/useFetchBlogs";

export default function Page() {
  const { data, isLoading, isError, error } = useFetchBlogs(`/categories`);

  const blogCategories = data?.data;

  const categorySlug = blogCategories?.[0]?.slug;

  if (isError) return <p>{error.message}</p>;
  return (
    <div>
      <BlogsNavbar />
      <div className="p-4 ">
        <div className="max-w-7xl mx-auto md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LatestBlog slug={categorySlug} />
            <BlogList slug={categorySlug} heading="Trending" />
          </div>
        </div>
      </div>

      {blogCategories?.map((category) => (
        <BlogCategorySection category={category} key={category.slug} />
      ))}
      <BlackBlog category="news" />
    </div>
  );
}
