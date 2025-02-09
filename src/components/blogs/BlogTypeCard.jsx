"use client";
import { useFetchBlogs } from "@/hooks/useFetchBlogs";
import blog1 from "@/public/images/blog1.png";
import blog7 from "@/public/images/blog7.png";
import blog8 from "@/public/images/blog8.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BlogTypeCard() {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").pop();
  const { data, isLoading, isError, error } = useFetchBlogs(
    `/category/${lastSegment}`
  );

  const blogs = data?.data;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-20">
        {blogs?.map((blog, index) => (
          <Link href={`/travel-blog/${blog?.slug}`} key={blog?.slug}>
            <div className="h-[500px] shadow-lg rounded-lg overflow-hidden">
              <Image
                height={400}
                width={400}
                src={blog?.image}
                alt="Tropical destination"
                className="w-full h-64  object-cover"
              />
              <div className="p-4">
                <span className="text-[14px] font-semibold text-[#192024] uppercase">
                  {blog?.category}
                </span>
                <h3 className="text-[20px] font-semibold mt-2 text-[#192024]">
                  {blog?.title}
                </h3>
                <p
                  className="text-[15px] mt-2 text-[#192024] h-16 overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html:
                      blog?.content?.length > 150
                        ? blog?.content.slice(0, 150) + "..."
                        : blog?.content,
                  }}
                />
                <div className="flex items-center mt-4">
                  <Image
                    src={blog1}
                    alt={"author"}
                    className="rounded-full w-[34px] h-[34px]"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {blog?.author} | {blog?.read_time}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// const blogTypeData = [
//   {
//     title: "Fly in style: how to get cheap Business Class tickets",
//     category: "Tips & tricks",
//     description: "Experience Venice without the crowds this winter.",
//     author: "Duncan Madden",
//     read_time: "12 mins read",
//     image: blog7,
//   },
//   {
//     title: "How to get cheap last-minute flights: your ultimate guide",
//     category: "Travel Recommendations",
//     description: "Experience Venice without the crowds this winter.",
//     author: "Duncan Madden",
//     read_time: "12 mins read",
//     image: blog8,
//   },
//   {
//     title: "Your essential guide to visiting Venice, Italy in winter",
//     category: "Travel Recommendations",
//     description: "Experience Venice without the crowds this winter.",
//     author: "Duncan Madden",
//     read_time: "12 mins read",
//     image: blog7,
//   },
//   {
//     title: "Your essential guide to visiting Venice, Italy in winter",
//     category: "Travel Recommendations",
//     description: "Experience Venice without the crowds this winter.",
//     author: "Duncan Madden",
//     read_time: "12 mins read",
//     image: blog8,
//   },
//   {
//     title: "Your essential guide to visiting Venice, Italy in winter",
//     category: "Travel Recommendations",
//     description: "Experience Venice without the crowds this winter.",
//     author: "Duncan Madden",
//     read_time: "12 mins read",
//     image: blog7,
//   },
//   {
//     title: "Your essential guide to visiting Venice, Italy in winter",
//     category: "Travel Recommendations",
//     description: "Experience Venice without the crowds this winter.",
//     author: "Duncan Madden",
//     read_time: "12 mins read",
//     image: blog8,
//   },
// ];
