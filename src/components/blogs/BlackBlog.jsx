"use client";
import blog3 from "@/public/images/blog3.png";
import blog5 from "@/public/images/blog5.png";

import { useFetchBlogs } from "@/hooks/useFetchBlogs";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import Skeleton from "react-loading-skeleton";

export default function BlackBlog({ category }) {
  const { blogType } = useParams();
  const { data, isLoading } = useFetchBlogs(`/categories`);

  const categories = data?.data;

  const foundCategory = categories?.find(
    (category) => category?.slug === blogType
  );

  if (isLoading)
    return (
      <div className="w-screen ">
        <Skeleton className=" h-72" />
      </div>
    );
  // if (!isLoading && !foundCategory)
  //   return (
  //     <div className="p-10 text-center text-xl font-semibold bg-slate-100">
  //       <h2>No blog category found!</h2>
  //     </div>
  //   );

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
            src={category?.image || blog5}
            height={600}
            width={600}
            alt="traveler"
          ></Image>
        </div>
      </div>
    </div>
  );
}
