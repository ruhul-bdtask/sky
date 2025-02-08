import { useFetchBlogs } from "@/hooks/useFetchBlogs";
import BlogsPageSkeleton from "@/skeletons/LatestBlogSkeleton";
import BlogList from "./BlogList";
import SectionCover from "./SectionCover";
import SectionHeader from "./SectionHeader";

export default function ExperiencesBlogs() {
  const { data, isLoading, isError, error } = useFetchBlogs(
    "/category/travelexperiences"
  );

  const blogs = data?.data;
  const experiencesBlog = blogs?.filter(
    (blog) => blog.category.toLowerCase() === "travel-experiences".toLowerCase()
  );
  if (isLoading) return <BlogsPageSkeleton />;
  if (isError) return <p>{error.message}</p>;

  return (
    <div className="max-w-7xl mx-auto md:p-8">
      <SectionHeader
        title="Travel experiences"
        description="What’s your favorite thing to do when you’re traveling? Find the best
          things to see and do based on your interests or type of travel."
        category="travel-experiences"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
        <SectionCover category="travel-experiences" />
        <BlogList category="travel-experiences" />
      </div>
    </div>
  );
}
