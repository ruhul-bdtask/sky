"use client";
import BlackBlog from "@/components/blogs/blackBlog/BlackBlog";
import BlogHeader from "@/components/blogs/blogHeader/BlogHeader";
import BlogList from "@/components/blogs/blogList/BlogList";
import ExperiencesBlogs from "@/components/blogs/experiencesBlogs/ExperiencesBlogs";
import LatestBlog from "@/components/blogs/latestBlog/LatestBlog";
import RecommendedBlogs from "@/components/blogs/recommendedBlogs/RecommendedBlogs";

export default function Page() {
  return (
    <div>
      <BlogHeader />
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LatestBlog />
            <BlogList category={"trending"} heading="Trending" />
          </div>
          <ExperiencesBlogs />
        </div>
      </div>
      <BlackBlog position={1} />
      <RecommendedBlogs position={1} />
      <BlackBlog position={2} />
      <RecommendedBlogs position={2} />
    </div>
  );
}
