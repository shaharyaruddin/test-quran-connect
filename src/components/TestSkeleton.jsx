import React from "react";

const TestSkeleton = () => {
  return (
    <div className="bg-white mt-2 rounded-lg px-6 py-6 animate-pulse">
      {/* Title */}
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="h-7 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-12"></div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-8 mb-8 relative overflow-hidden">
        <div className="absolute left-0 top-0 h-8 bg-gray-300 w-1/2 rounded-full"></div>
      </div>

      {/* Question */}
      <div className="mb-8 text-center">
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>

      {/* Answer Options */}
      <div className="space-y-4 mb-6 px-2 sm:px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-full h-12 bg-gray-200 rounded-full"></div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <div className="h-10 w-28 bg-gray-200 rounded-full"></div>
        <div className="h-10 w-28 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};

export default TestSkeleton;
