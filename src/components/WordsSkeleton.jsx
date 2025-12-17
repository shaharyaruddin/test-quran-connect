import React from "react";

const WordsSkeleton = () => {
  return (
    <div className="mt-4 animate-pulse w-full">
      {/* Header (If needed later) */}
      <div className="flex justify-between items-center px-3 mb-6"></div>

      {/* Words Grid Skeleton */}
      <div className="px-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 place-items-center">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center bg-gray-100 rounded-xl shadow-sm p-3 w-full h-[70px]"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordsSkeleton;
