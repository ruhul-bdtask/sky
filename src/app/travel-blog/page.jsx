"use client";
import BlackBlog from "@/components/blogs/BlackBlog";
import BlogCover from "@/components/blogs/BlogCover";
import BlogList from "@/components/blogs/BlogList";
import BlogsNavbar from "@/components/blogs/BlogsNavbar";
import ExperiencesBlogs from "@/components/blogs/ExperiencesBlogs";
import LatestBlog from "@/components/blogs/LatestBlog";
import RecommendedBlogs from "@/components/blogs/BlogSection";
import SectionHeader from "@/components/blogs/SectionHeader";
import TipsAndTricks from "@/components/blogs/TipsAndTricks";

export default function Page() {
  return (
    <div>
      <BlogsNavbar />
      <div className="min-h-screen p-4 ">
        <div className="max-w-7xl mx-auto md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LatestBlog />
            <BlogList category="trending" heading="Trending" />
          </div>
        </div>
      </div>

      <BlackBlog category="out-there" />
      <RecommendedBlogs />
      <BlackBlog category="news" />
    </div>
  );
}
