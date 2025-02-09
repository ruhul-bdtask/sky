import blog1 from "@/public/images/blog1.png";
import BlogList from "./BlogList";
import SectionCover from "./SectionCover";
import SectionHeader from "./SectionHeader";

const TipsAndTricks = () => {
  const trendingData = [
    {
      title: "The 10 best warm places to visit in March",
      category: "Travel Recommendations",
      author: "Duncan Madden",
      read_time: "12 mins read",
      image: blog1,
    },
    {
      title:
        "Here's your selection of 10 all-inclusive vacations with no passport needed",
      category: "Travel Recommendations",
      author: "Jennifer Breking",
      read_time: "7 mins read",
      image: blog1,
    },
    {
      title: "The 6 largest airports in the world",
      category: "Tips & Tricks",
      author: "Jennifer Sincocco",
      read_time: "9 mins read",
      image: blog1,
    },
    {
      title: "The 10 best warm places to visit in February",
      category: "Travel Recommendations",
      author: "Duncan Madden",
      read_time: "12 mins read",
      image: blog1,
    },
  ];
  return (
    <div className="max-w-7xl mx-auto my-20 p-4 md:p-8">
      <SectionHeader
        title="Tips & tricks"
        description="The world is a big place—not sure where to go? Get recommendations on destinations, the best times to go there and what to do."
        category="tips-and-tricks"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
        <SectionCover category="tips-and-tricks" />
        <BlogList category="tips-and-tricks" />
      </div>
    </div>
  );
};

export default TipsAndTricks;
