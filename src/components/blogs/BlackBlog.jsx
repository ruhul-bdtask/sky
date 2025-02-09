"use client";
import blog3 from "@/public/images/blog3.png";
import blog5 from "@/public/images/blog5.png";

import { useFetchBlogs } from "@/hooks/useFetchBlogs";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function BlackBlog({ category }) {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").pop();

  const { data } = useFetchBlogs(`/categories`);

  const categories = data?.data;
  const foundCategory = categories?.find(
    (category) => category?.slug === lastSegment
  );

  return (
    <div className="bg-[#192024] h-full lg:h-[711px] flex justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center ">
        <div className="flex justify-center items-center text-white w-full h-full">
          <div className="p-10 md:p-36 flex flex-col gap-5">
            <h2 className="text-[32px] font-bold">{foundCategory?.name}</h2>
            <p className="text-[15px]  text-white">
              {foundCategory?.description}
            </p>
            {category !== undefined && (
              <button className=" px-4 border text-[14px] font-semibold h-9 w-32 rounded-[4px]">
                <span>{category === 1 ? " Lets do it" : "Learn more"}</span>
              </button>
            )}
          </div>
        </div>
        <div className="px-10 md:px-36 pb-20 lg:pb-0">
          <Image
            className="rounded-[12px]"
            src={category === 1 ? blog3 : blog5}
          ></Image>
        </div>
      </div>
    </div>
  );
}
