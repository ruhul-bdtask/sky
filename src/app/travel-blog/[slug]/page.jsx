"use client";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import blog1 from "@/public/images/blog1.png";

import { useFetchBlogs } from "@/hooks/useFetchBlogs";
import BlogDetailSkeleton from "@/skeletons/BlogDetailSkeleton";
import { useParams } from "next/navigation";

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError, error } = useFetchBlogs(`/${slug}`);
  if (isLoading) return <BlogDetailSkeleton />;

  const blog = data?.data;

  return (
    <article className=" mx-auto ">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center bg-gray-100 px-6 md:px-20 lg:px-60 py-10 gap-10">
        {/* Left: Blog Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight md:px-2 lg:px-10">
          {blog?.title}
        </h1>

        {/* Right: Blog Image */}
        <Image
          src={blog?.image}
          height={600}
          width={600}
          alt="Person taking photos in Venice"
          className="object-cover w-full max-h-96"
          priority
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Content */}
        <div className="prose prose-gray max-w-none dark:prose-invert">
          <p dangerouslySetInnerHTML={{ __html: blog?.content }} />
        </div>

        {/* Author Bio */}
        {/* <div className="mt-12 border-t pt-8">
          <h3 className="text-lg font-semibold">About the author</h3>
          <div className="mt-4 flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage alt="Author avatar" src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h4 className="font-medium">Jane Doe</h4>
              <p className="text-sm text-muted-foreground">
                Travel writer and photographer with a passion for exploring
                historic cities. Based in Rome, specializing in Italian culture
                and destinations.
              </p>
            </div>
          </div>
        </div> */}

        {/* Related Posts */}
        {/* <div className="mt-12">
          <h3 className="text-lg font-semibold mb-4">Explore more articles</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-3">
                  <Image
                    src="/placeholder.svg"
                    alt="Venice canal"
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-medium line-clamp-2 mb-1">
                  Top 10 Hidden Gems in Venice
                </h4>
                <p className="text-sm text-muted-foreground">5 min read</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-3">
                  <Image
                    src="/placeholder.svg"
                    alt="Winter activities"
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-medium line-clamp-2 mb-1">
                  Best Winter Activities in Venice
                </h4>
                <p className="text-sm text-muted-foreground">4 min read</p>
              </CardContent>
            </Card>
            <Card className="sm:hidden lg:block">
              <CardContent className="p-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-3">
                  <Image
                    src="/placeholder.svg"
                    alt="Venice sunset"
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-medium line-clamp-2 mb-1">
                  Venice at Sunset: Photography Guide
                </h4>
                <p className="text-sm text-muted-foreground">6 min read</p>
              </CardContent>
            </Card>
          </div>
        </div> */}
      </div>
    </article>
  );
};

export default BlogDetailsPage;
