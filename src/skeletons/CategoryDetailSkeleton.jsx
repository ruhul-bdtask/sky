import React from "react";

function CategoryDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-20">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-[500px] shadow-lg rounded-lg overflow-hidden animate-pulse bg-gray-200"
          >
            {/* Image Skeleton */}
            <div className="w-full h-64 bg-gray-300" />

            <div className="p-4">
              {/* Category */}
              <div className="h-4 w-24 bg-gray-300 rounded-md mb-2" />

              {/* Title */}
              <div className="h-6 w-3/4 bg-gray-300 rounded-md mb-2" />

              {/* Content */}
              <div className="h-4 w-full bg-gray-300 rounded-md mb-2" />
              <div className="h-4 w-5/6 bg-gray-300 rounded-md mb-2" />
              <div className="h-4 w-4/6 bg-gray-300 rounded-md mb-2" />

              {/* Author */}
              <div className="flex items-center mt-4">
                <div className="w-[34px] h-[34px] rounded-full bg-gray-300" />
                <div className="ml-2 h-4 w-32 bg-gray-300 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryDetailSkeleton;
