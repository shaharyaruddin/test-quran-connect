import React from "react";

const ArabicViewSkeleton = () => {
  const items = Array.from({ length: 12 });

  return (
    <div className="mt-2 flex gap-2 w-full lg:flex-wrap lg:flex-row-reverse lg:ml-auto">
      <div
        className="w-full lg:container text-center px-4 py-3 h-auto lg:h-96 bg-white rounded-lg animate-pulse"
        style={{
          lineHeight: "1.8",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        {/* Top Play Buttons */}
        <div className="flex justify-between mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>

        {/* Bismillah Skeleton */}
        <div className="w-72 h-10 bg-gray-200 rounded mx-auto mb-6"></div>

        {/* Desktop Ayat Layout */}
        <div className="hidden lg:flex flex-col items-center gap-4  ">
          {Array.from({ length: 4 }).map((_, rowIndex) => {
            // Alternate between 3 items and 2 items per line
            const itemsInRow = rowIndex % 2 === 0 ? 3 : 2;
            const startIndex = rowIndex * 3 - Math.floor(rowIndex / 2);
            return (
              <div
                key={rowIndex}
                className="flex justify-center gap-3 w-full text-right"
              >
                {Array.from({ length: itemsInRow }).map((_, i) => {
                  const itemIndex = startIndex + i;
                  if (itemIndex >= items.length) return null;
                  return (
                    <span key={itemIndex} className="flex items-center">
                      {/* <span className="h-6 bg-gray-200 rounded inline-block w-24"></span> */}
                      <span className="ml-2 w-96 h-12 bg-gray-300 rounded-md"></span>
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Mobile Ayat Layout */}
        <div className="lg:hidden text-right flex flex-col w-full gap-3">
          {items.map((_, i) => (
            <div key={i} className="flex w-full">
              <span className="h-5 bg-gray-200 rounded w-full"></span>
              <span className="ml-2 w-5 h-5 bg-gray-300 rounded-full"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArabicViewSkeleton;
