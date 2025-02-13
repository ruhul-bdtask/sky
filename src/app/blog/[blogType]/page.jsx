"use client";
import BlackBlog from "@/components/blogs/BlackBlog";
import BlogTypeCard from "@/components/blogs/BlogTypeCard";
import { useFetchBlogs } from "@/hooks/useFetchBlogs";
import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";

export default function Page() {
  const { blogType } = useParams();
  // const lastSegment = pathname.split("/").pop();
  const { data, isLoading } = useFetchBlogs(`/categories`);

  return (
    <div>
      <BlackBlog />
      <BlogTypeCard />
    </div>
  );
}

// export async function getServerSideProps({ params }) {
//   const res = await fetch(
//     `http://143.110.191.53/b2c/api/articles/${params.blohType}`
//   );
//   const blog = await res.json();

//   return {
//     props: { blog },
//   };
// }
