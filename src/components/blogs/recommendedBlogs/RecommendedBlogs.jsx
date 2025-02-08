import React from "react";
import Image from "next/image";
import blog4 from "@/public/images/blog4.png";
import blog1 from "@/public/images/blog1.png";
import blog6 from "@/public/images/blog6.png";
import Link from "next/link";
import SectionHeader from "../SectionHeader";
import BlogCover from "../blogCover/BlogCover";
import BlogList from "../blogList/BlogList";

export default function RecommendedBlog({ position }) {
  const trendingData = [
    {
      title: "The 10 best warm places to visit in March",
      category: "Travel Recommendations",
      author: "Duncan Madden",
      readTime: "12 mins read",
      image: blog1,
    },
    {
      title:
        "Here's your selection of 10 all-inclusive vacations with no passport needed",
      category: "Travel Recommendations",
      author: "Jennifer Breking",
      readTime: "7 mins read",
      image: blog1,
    },
    {
      title: "The 6 largest airports in the world",
      category: "Tips & Tricks",
      author: "Jennifer Sincocco",
      readTime: "9 mins read",
      image: blog1,
    },
    {
      title: "The 10 best warm places to visit in February",
      category: "Travel Recommendations",
      author: "Duncan Madden",
      readTime: "12 mins read",
      image: blog1,
    },
  ];
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
