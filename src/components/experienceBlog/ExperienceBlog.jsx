import React from "react";
import Image from "next/image";
import blog1 from "@/public/images/blog1.png";
import blog2 from "@/public/images/blog2.png";

export default function ExperienceBlog() {
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
    <div>
      <div className="pt-10">
        <h2 className="text-[32px] font-bold mb-4">Travel experiences</h2>

        <div className="flex justify-between">
          <p className="text-[15px] mt-2 text-[#192024] max-w-4xl">
            What’s your favorite thing to do when you’re traveling? Find the
            best things to see and do based on your interests or type of travel.
          </p>
          <button className=" px-4 border text-[14px] font-semibold h-10 rounded-[4px]">
            <span>See all</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
        <div className="lg:col-span-1">
          <div className=" rounded-lg  overflow-hidden">
            <Image
              src={blog2}
              alt="Tropical destination"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div>
          <div className="space-y-7">
            {trendingData.map((article, index) => (
              <div
                key={index}
                className="flex  overflow-hidden items-start border-b pb-7"
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
    </div>
  );
}
