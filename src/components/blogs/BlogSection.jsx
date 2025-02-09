import { useFetchBlogs } from "@/hooks/useFetchBlogs";
import LatestBlogSkeleton from "@/skeletons/LatestBlogSkeleton";
import BlogList from "./BlogList";
import SectionCover from "./SectionCover";
import SectionHeader from "./SectionHeader";

export default function BlogSection({ category }) {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <SectionHeader category={category} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
        <SectionCover sectionImage={category?.image} />
        <BlogList slug={category?.slug} />
      </div>
    </div>
  );
}
