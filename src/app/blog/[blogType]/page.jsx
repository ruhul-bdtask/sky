"use client";
import BlackBlog from "@/components/blogs/BlackBlog";
import BlogTypeCard from "@/components/blogs/BlogTypeCard";
import { useParams } from "next/navigation";

export default function Page() {
  const { blogType } = useParams();

  console.log(blogType);
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
