import blog1 from "@/public/images/blog1.png";
import BlogCover from "./BlogCover";
import BlogList from "./BlogList";
import SectionHeader from "./SectionHeader";

export default function BlogSection({ position }) {
  return (
    <div className="max-w-7xl mx-auto my-20 p-4 md:p-8">
      <SectionHeader
        title="Travel recommendations"
        description="The world is a big place—not sure where to go? Get recommendations
            on destinations, the best times to go there and what to do."
        category="travel-recommended"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
        <BlogCover category="travel-recommended" />
        <BlogList category="travel-recommended" />
      </div>
    </div>
  );
}
