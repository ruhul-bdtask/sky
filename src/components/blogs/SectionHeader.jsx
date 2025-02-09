import Link from "next/link";
import React from "react";

const SectionHeader = ({ category }) => {
  return (
    <div className="pt-10">
      <h2 className="text-[32px] font-bold mb-4">{category?.name}</h2>
      <div className="flex justify-between">
        <p className="text-[15px] mt-2 text-[#192024] max-w-4xl">
          {category?.description}
        </p>
        <Link href={`/blog/${category?.slug}`}>
          <button className=" px-4 border text-[14px] font-semibold h-10 rounded-[4px]">
            <span>See all</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SectionHeader;
