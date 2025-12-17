import React from "react";

const LessonsSkeleton = () => {
  return (
    <div className="space-y-6 bg-white mt-2 shadow-sm rounded-lg mb-36 animate-pulse">
      {/* Title */}
      <div className="text-start pt-4 px-4">
        <div className="h-6 w-64 bg-gray-200 rounded"></div>
      </div>

      {/* Lessons List */}
     

      {/* Did you know section */}
      <div className="relative flex flex-col sm:flex-row justify-between items-center py-10 sm:py-20 mt-10 overflow-hidden">
        {/* Left Vector */}
        <div className="absolute left-0 hidden sm:block">
          <div className="w-24 h-24 bg-gray-100"></div>
        </div>

        {/* Blue Box */}
        <div className="relative z-10 py-10 px-6 flex-1 bg-gray-200 rounded-3xl mx-40">
          {/* Top Bubble */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-12 h-12 bg-gray-300 rounded-full"></div>

          <div className="h-5 w-32 bg-gray-300 rounded mx-auto mb-4"></div>
          <div className="h-6 w-3/4 bg-gray-300 rounded mx-auto"></div>
        </div>

        {/* Right Vector */}
        <div className="absolute right-0 hidden sm:block">
          <div className="w-24 h-24 bg-gray-100"></div>
        </div>
      </div>

      {/* Lesson Discussion */}
      <div className="relative text-center mx-4 sm:mx-8 md:mx-16 lg:mx-24 mt-12 bg-gray-200 rounded-2xl py-16">
        {/* Lesson Heading */}
        <div className="h-6 w-32 bg-gray-300 rounded mx-auto mb-4"></div>

        {/* Top center image */}
        <div className="absolute -top-[60px] sm:-top-[85px] left-1/2 -translate-x-1/2 w-[260px] h-[120px] bg-gray-300 rounded"></div>

        {/* Description lines */}
        <div className="pt-20 pb-10 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-5 w-full bg-gray-300 rounded mx-auto"
            ></div>
          ))}
        </div>
      </div>

      {/* Remember Section */}
      <div className="relative flex flex-col sm:flex-row justify-between items-center py-10 sm:py-20 mt-10 overflow-hidden">
        <div className="absolute left-0 hidden sm:block">
          <div className="w-24 h-24 bg-gray-100"></div>
        </div>

        <div className="relative z-10 py-10 px-6 flex-1 bg-gray-200 rounded-3xl mx-40">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="h-5 w-32 bg-gray-300 rounded mx-auto mb-4"></div>
          <div className="h-6 w-3/4 bg-gray-300 rounded mx-auto"></div>
        </div>

        <div className="absolute right-0 hidden sm:block">
          <div className="w-24 h-24 bg-gray-100"></div>
        </div>
      </div>

      {/* Bottom image */}
      <div className="w-full">
        <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default LessonsSkeleton;
