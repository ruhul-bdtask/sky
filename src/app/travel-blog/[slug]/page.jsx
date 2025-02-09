"use client";

import { useFetchBlogs } from "@/hooks/useFetchBlogs";
import BlogDetailSkeleton from "@/skeletons/BlogDetailSkeleton";
import { useParams } from "next/navigation";

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError, error } = useFetchBlogs(`/${slug}`);

  const blog = data?.data;

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <BlogDetailSkeleton />
      ) : (
        <article className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{blog?.title}</h1>
          <img
            src={blog.image}
            alt="Blog post image"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <div className="prose">
            <p dangerouslySetInnerHTML={{ __html: blog?.content }} />
          </div>
        </article>
      )}
    </div>
  );
};

export default BlogDetailsPage;
