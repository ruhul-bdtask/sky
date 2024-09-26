import Image from "next/image";
import blog1 from "@/public/images/blog1.png";

import React from "react";

export default function LatestBlog() {
  
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Latest Section */}
      <div className="lg:col-span-1">
        <h2 className="text-[32px] font-bold mb-4">Latest</h2>
        <div className="  overflow-hidden">
          <Image
            src={blog1}
            alt="Tropical destination"
            className="w-full rounded-[8px] h-full object-cover"
          />
          <div className="py-4">
            <span className="text-[14px] font-semibold text-[#192024] uppercase">
              Travel Recommendations
            </span>
            <h3 className="text-[20px] font-semibold mt-2 text-[#192024]">
              Your essential guide to visiting Venice, Italy in winter
            </h3>
            <p className="text-[15px] mt-2 text-[#192024]">
              Experience Venice without the crowds this winter.
            </p>
            <div className="flex items-center mt-4">
              <Image
                src={blog1}
                alt={"author"}
                className="rounded-full w-[34px] h-[34px]"
              />
              <span className="ml-2 text-sm text-gray-600">
                Jennifer Breking | 9 mins read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <div>
        <h2 className="text-[32px] font-bold mb-4">Trending</h2>
        <div className="space-y-4">
          {trendingData.map((article, index) => (
            <div
              key={index}
              className="flex  overflow-hidden items-start border-b pb-5"
            >
              <Image
                src={article.image}
                alt={article.title}
                className="w-[112px] h-[112px] rounded-lg object-cover"
              />
              <div className="px-4 flex-1">
                <span className="text-xs font-semibold text-[#192024] uppercase">
                  {article.category}
                </span>
                <h3 className="text-sm font-bold mt-1 text-[#192024]">
                  {article.title}
                </h3>
                <div className="flex items-center mt-2">
                  <Image
                    src={blog1}
                    alt={article.author}
                    className="rounded-full w-[34px] h-[34px]"
                  />
                  <span className="ml-2 text-[14px] text-gray-600">
                    {article.author} | {article.readTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
