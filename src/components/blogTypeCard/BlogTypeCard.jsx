import Image from "next/image";
import React from "react";
import blog1 from "@/public/images/blog1.png";
import blog7 from "@/public/images/blog7.png";
import blog8 from "@/public/images/blog8.png";

export default function BlogTypeCard() {
  const blogTypeData = [
    {
      title: "Fly in style: how to get cheap Business Class tickets",
      category: "Tips & tricks",
      description: "Experience Venice without the crowds this winter.",
      author: "Duncan Madden",
      readTime: "12 mins read",
      image: blog7,
    },
    {
      title: "How to get cheap last-minute flights: your ultimate guide",
      category: "Travel Recommendations",
      description: "Experience Venice without the crowds this winter.",
      author: "Duncan Madden",
      readTime: "12 mins read",
      image: blog8,
    },
    {
      title: "Your essential guide to visiting Venice, Italy in winter",
      category: "Travel Recommendations",
      description: "Experience Venice without the crowds this winter.",
      author: "Duncan Madden",
      readTime: "12 mins read",
      image: blog7,
    },
    {
      title: "Your essential guide to visiting Venice, Italy in winter",
      category: "Travel Recommendations",
      description: "Experience Venice without the crowds this winter.",
      author: "Duncan Madden",
      readTime: "12 mins read",
      image: blog8,
    },
    {
      title: "Your essential guide to visiting Venice, Italy in winter",
      category: "Travel Recommendations",
      description: "Experience Venice without the crowds this winter.",
      author: "Duncan Madden",
      readTime: "12 mins read",
      image: blog7,
    },
    {
      title: "Your essential guide to visiting Venice, Italy in winter",
      category: "Travel Recommendations",
      description: "Experience Venice without the crowds this winter.",
      author: "Duncan Madden",
      readTime: "12 mins read",
      image: blog8,
    },
  ];
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-20">
        {blogTypeData?.map((type) => (
          <div className="w-[410px] h-[588px]">
            <Image
              src={type?.image}
              alt="Tropical destination"
              className="w-full rounded-[8px]  object-cover"
            />
            <div className="py-4">
              <span className="text-[14px] font-semibold text-[#192024] uppercase">
                {type?.category}
              </span>
              <h3 className="text-[20px] font-semibold mt-2 text-[#192024]">
                {type?.title}
              </h3>
              <p className="text-[15px] mt-2 text-[#192024]">
                {type?.description}
              </p>
              <div className="flex items-center mt-4">
                <Image
                  src={blog1}
                  alt={"author"}
                  className="rounded-full w-[34px] h-[34px]"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {type?.author} | {type?.readTime}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
