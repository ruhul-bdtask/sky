import { useFetchBlogs } from "@/hooks/useFetchBlogs";
import LatestBlogSkeleton from "@/skeletons/LatestBlogSkeleton";
import BlogList from "./BlogList";
import SectionCover from "./SectionCover";
import SectionHeader from "./SectionHeader";

export default function BlogSection({ slug, sectionImage, heading }) {
  console.log({ sectionImage });
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <SectionHeader
        heading={heading}
        description="The world is a big place—not sure where to go? Get recommendations
            on destinations, the best times to go there and what to do."
        slug={slug}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
        <SectionCover sectionImage={sectionImage} />
        <BlogList slug={slug} />
      </div>
    </div>
  );
}
