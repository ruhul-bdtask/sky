import LatestBlog from "@/components/latestBlog/LatestBlog";
import ExperienceBlog from "@/components/experienceBlog/ExperienceBlog";
import BlackBlog from "@/components/blackBlog/BlackBlog";
import RecommendBlog from "@/components/recommendBlog/RecommendBlog";
import BlogHeader from "@/components/blogHeader/BlogHeader";

export default function page() {
  return (
    <div>
      <BlogHeader />
      <div className="min-h-screen  p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <LatestBlog />
          {/* Travel experience */}
          <ExperienceBlog />
        </div>
      </div>
      <BlackBlog position={1} />
      <RecommendBlog position={1} />
      <BlackBlog position={2} />
      <RecommendBlog position={2} />
    </div>
  );
}
