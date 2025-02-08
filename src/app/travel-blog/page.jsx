"use client";
import BlackBlog from "@/components/blogs/blackBlog/BlackBlog";
import BlogList from "@/components/blogs/blogList/BlogList";
import BlogsNavbar from "@/components/blogs/blogsNavbar/BlogsNavbar";
import ExperiencesBlogs from "@/components/blogs/experiencesBlogs/ExperiencesBlogs";
import LatestBlog from "@/components/blogs/latestBlog/LatestBlog";
import RecommendedBlogs from "@/components/blogs/recommendedBlogs/RecommendedBlogs";

export default function Page() {
  return (
    <div>
      <BlogsNavbar />
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LatestBlog />
            <BlogList category={"trending"} heading="Trending" />
          </div>
          <ExperiencesBlogs />
        </div>
      </div>
      <BlackBlog />
      <RecommendedBlogs />
      <BlackBlog />
      <RecommendedBlogs />
    </div>
  );
}
