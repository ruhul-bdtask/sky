import Skeleton from "react-loading-skeleton";

const LatestBlogSkeleton = () => {
  return (
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
  );
};

export default LatestBlogSkeleton;
