import Skeleton from "react-loading-skeleton";

const BlogListSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton width={280} height={40} />
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
  );
};

export default BlogListSkeleton;
