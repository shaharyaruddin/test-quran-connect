import React from "react";

const DetailHeaderSkeleton = () => {
  return (
    <div className="mt-2 px-4 bg-white rounded-lg py-2 animate-pulse">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Left: number skeleton */}
        <div className="flex items-center">
          <div className="h-10 w-[140px] bg-gray-200 rounded-md" />
        </div>

        {/* Center: English name skeleton */}
        <div className="text-center flex justify-center">
          <div className="h-10 w-40 bg-gray-200 rounded-md" />
        </div>

        {/* Right: Arabic name skeleton */}
        <div className="flex justify-end">
          <div className="h-[38px] w-[120px] bg-gray-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default DetailHeaderSkeleton;
