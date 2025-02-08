import { useFetchBlogs } from "@/hooks/useFetchBlogs";
import BlogsPageSkeleton from "@/skeletons/LatestBlogSkeleton";
import BlogCover from "../blogCover/BlogCover";
import BlogList from "../blogList/BlogList";
import SectionHeader from "../SectionHeader";

export default function ExperiencesBlogs() {
  const { data, isLoading, isError, error } = useFetchBlogs(
    "/category/travelexperiences"
  );

  const blogs = data?.data;
  const experiencesBlog = blogs?.filter(
    (blog) => blog.category.toLowerCase() === "travelexperiences".toLowerCase()
  );
  if (isLoading) return <BlogsPageSkeleton />;
  if (isError) return <p>{error.message}</p>;

  return (
    <div>
      <SectionHeader
        title="Travel experiences"
        description="What’s your favorite thing to do when you’re traveling? Find the best
          things to see and do based on your interests or type of travel."
        category="travelexperiences"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
        <BlogCover category="travelexperiences" />
        <BlogList category="travelexperiences" />
      </div>
    </div>
  );
}
