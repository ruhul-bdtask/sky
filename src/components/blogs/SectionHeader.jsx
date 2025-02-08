import Link from "next/link";
import React from "react";

const SectionHeader = ({ heading, description, slug }) => {
  return (
    <div className="pt-10">
      <h2 className="text-[32px] font-bold mb-4">{heading}</h2>
      <div className="flex justify-between">
        <p className="text-[15px] mt-2 text-[#192024] max-w-4xl">
          {description}
        </p>
        <button className=" px-4 border text-[14px] font-semibold h-10 rounded-[4px]">
          <Link href={`/blog/${slug}`}>
            <span>See all</span>
          </Link>
        </button>
      </div>
    </div>
  );
};

export default SectionHeader;
