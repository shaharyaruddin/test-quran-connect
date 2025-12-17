import React from "react";

const AyahCardSkeleton = ({ showBismillah = true }) => {
  return (
    <div dir="rtl" className="mt-2 flex flex-col gap-2 w-full">
      <div
        className="text-center py-3 rounded-2  animate-pulse"
        style={{
          lineHeight: "1.5",
          whiteSpace: "normal",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {/* Bismillah Skeleton */}
        {showBismillah && (
          <div className="w-full flex justify-center mb-4">
            <div className="h-24 w-full bg-gray-200 rounded"></div>
          </div>
        )}

        {/* Ayah skeleton cards */}
        <div className="flex flex-wrap gap-2 justify-center w-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 grow lg:max-w-[300px] w-full animate-pulse"
            >
              {/* Top Controls Skeleton */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Ayah Text Skeleton */}
              <div className="h-6 bg-gray-200 rounded-lg mb-3 w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AyahCardSkeleton;
