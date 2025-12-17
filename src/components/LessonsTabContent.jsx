import React from "react";
import { useTranslation } from "react-i18next";

const LessonsTabContent = ({ lesson, runningTranslation, language }) => {
  const { t } = useTranslation("common");
  if (language === "686910236c322b53d21d1e16") {
    language = "668ee3b5f5069cf20aa046f9";
  }
  const isMatched = lesson?.languages?.find(
    (item) => item?.languageId?._id === language
  );

  return (
    <div className="space-y-6 bg-white mt-2 shadow-sm rounded-lg mb-36">
      {/* Title */}
      <div className="text-start pt-4">
        <h2 className="text-2xl font-medium text-[#2372B9] px-4 font-calsans">
          Lessons from Surah {lesson?.surahId?.name}
        </h2>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {runningTranslation?.translations?.map((item, index) => (
          <div key={index} className="px-4">
            <p className="text-black text-lg font-plusJakartaSans">
              {index + 1}.
              <span className="text-lg">
                {item
                  ?.replace("\\n", " ")
                  .replace("\\n", " ")
                  .replace("\\n", " ")}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Did you know section */}
      <div className="relative flex flex-col sm:flex-row justify-between items-center py-10 sm:py-20 mt-10 overflow-hidden">
        <div className="absolute left-0 hidden sm:block">
          <img src="/images/quran-connect-vector1.svg" alt="Vector 1" />
        </div>
        <div className="relative z-10 py-6 px-6 flex-1 text-center bg-[#2372B9] rounded-3xl mx-40">
          <div
            className="absolute"
            style={{
              top: -60,
              left: "40%",
            }}
          >
            <img src="/images/quran-connect-vector3.svg" alt="Vector 3" />
          </div>
          <span className="text-white text-xl font-medium font-calsans block mb-3">
            Did you know?
          </span>
          <p className="font-bold text-white text-xl leading-relaxed font-plusJakartaSans px-14">
            {isMatched?.para}
          </p>
        </div>
        <div className="absolute right-0">
          <img src="/images/quran-connect-vector2.svg" alt="Vector 2" />
        </div>
      </div>

      {/* Lesson Discussion */}
      <div className="relative text-center mx-4 sm:mx-8 md:mx-16 lg:mx-24 mt-12 bg-[#3DB47D] rounded-2xl">
        {/* Top heading */}
        <p className="text-2xl sm:text-3xl font-medium text-white pt-8 font-calsans">
          Lesson
        </p>

        {/* Centered top image */}
        <div className="absolute -top-[60px] sm:-top-[85px] left-1/2 -translate-x-1/2">
          <img
            src="/images/lesson.svg"
            alt="Lesson Decoration"
            className="w-[220px] sm:w-[360px] md:w-[460px] mx-auto"
          />
          <p className="relative -top-[40px] sm:-top-[60px] md:-top-[70px] font-calsans left-1/2 -translate-x-1/2 -translate-y-1/2 text-base sm:text-xl md:text-2xl text-white">
            Let's Discuss
          </p>
        </div>

        {/* Description lines */}
        <div className="text-left pt-32 sm:pt-36 md:pt-20 pb-10">
          {isMatched?.description?.split("\\n").map((line, index) => (
            <span
              key={index}
              className="block font-medium text-white font-plusJakartaSans mt-6 sm:mt-8 md:mt-10 px-6 sm:px-10 md:px-16 leading-relaxed"
            >
              {line}
            </span>
          ))}
        </div>
      </div>

      {/* Remember section */}
      <div className="relative flex flex-col sm:flex-row justify-between items-center py-10 sm:py-20 mt-10 overflow-hidden">
        <div className="absolute left-0">
          <img src="/images/quran-connect-vector1.svg" alt="Vector 1" />
        </div>
        <div className="relative z-10 py-6 px-6 flex-1 text-center bg-[#2372B9] rounded-3xl mx-40">
          <div
            className="absolute"
            style={{
              top: -60,
              left: "40%",
            }}
          >
            <img src="/images/quran-connect-vector3.svg" alt="Vector 3" />
          </div>
          <span className="text-white text-xl font-medium font-calsans block mb-3">
            Remember
          </span>
          <p className="font-bold text-white text-xl leading-relaxed font-plusJakartaSans px-14">
            {isMatched?.remember}
          </p>
        </div>
        <div className="absolute right-0">
          <img src="/images/quran-connect-vector2.svg" alt="Vector 2" />
        </div>
      </div>
      <div className="w-full">
        <img
          src="/images/lesson-icon.svg"
          alt="Vector 2"
          className="w-full rounded-lg"
        />
      </div>
    </div>
  );
};

export default LessonsTabContent;
