import React from "react";
import Skeleton from "react-loading-skeleton";

const BlogsPageSkeleton = () => {
  return (
    <div className="container_search max-w-5xl mx-auto p-4 flex flex-row gap-4 mt-8">
      {/* Left Sidebar with Filters */}
      <div className="lg:col-span-1">
        <Skeleton width={280} height={40} className="mb-4" />

        <div className="  overflow-hidden">
          <Skeleton width={580} height={300} />
          <div className="py-4">
            <Skeleton width={280} />

            <Skeleton width={380} />
            <Skeleton width={280} />
            <div className="flex items-center">
              <Skeleton
                circle
                width={40}
                height={40}
                className="mr-3 rounded-full"
              />
              <Skeleton width={280} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4">
        {/* Flight Cards */}

        <article className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-row justify-between gap-4 flex-wrap">
            <div className="flex-1 space-y-4">
              {/* Tags */}
              <div className="flex gap-2">
                <Skeleton width={280} height={40} />
              </div>

              {/* Flight Details */}

              <div className="flex items-center gap-4">
                <Skeleton rounded width={120} height={120} />
                <div>
                  <Skeleton width={180} />
                  <Skeleton width={180} />
                  <div className="flex items-center gap-1">
                    <Skeleton
                      circle
                      width={40}
                      height={40}
                      className="mr-3 rounded-full"
                    />
                    <Skeleton width={100} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton rounded width={120} height={120} />
                <div>
                  <Skeleton width={180} />
                  <Skeleton width={180} />
                  <div className="flex items-center gap-1">
                    <Skeleton
                      circle
                      width={40}
                      height={40}
                      className="mr-3 rounded-full"
                    />
                    <Skeleton width={100} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton rounded width={120} height={120} />
                <div>
                  <Skeleton width={180} />
                  <Skeleton width={180} />
                  <div className="flex items-center gap-1">
                    <Skeleton
                      circle
                      width={40}
                      height={40}
                      className="mr-3 rounded-full"
                    />
                    <Skeleton width={100} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton rounded width={120} height={120} />
                <div>
                  <Skeleton width={180} />
                  <Skeleton width={180} />
                  <div className="flex items-center gap-1">
                    <Skeleton
                      circle
                      width={40}
                      height={40}
                      className="mr-3 rounded-full"
                    />
                    <Skeleton width={100} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogsPageSkeleton;
