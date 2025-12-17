import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Star, Heart, Bookmark } from "lucide-react";

const Rating = ({ value = 3 }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3].map((i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i <= value ? "fill-[#F7C948] text-[#F7C948]" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

const JuzCard = ({
  number,
  titleEn,
  titleAr,
  surahsText,
  questionsText,
  thumbnail,
}) => {
  const router = useRouter();
  const go = () => router.push(`/juzz/${number}`);

  return (
    <div
      onClick={go}
      className="cursor-pointer group grid grid-cols-[120px_1fr] gap-3 bg-white rounded-xl shadow-[0px_5px_6px_0px_rgba(0,_0,_0,_0.1)] hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative h-[120px] w-[135px]">
        <Image
          src={thumbnail}
          alt={titleEn}
          width={120}
          height={108}
          className="h-full w-full object-cover"
        />
        {/* Number Badge */}
        {/* <div className="absolute bottom-2 right-2 bg-[#2372B9] text-white w-8 h-5 rounded-[4px] flex items-center justify-center">
          <span className="text-xs font-bold">{number}</span>
        </div> */}
      </div>

      {/* Content */}
      <div className="relative p-3 pr-4 pt-8">
        {/* Top right icons */}
        <div className="absolute right-3 top-8 flex items-center gap-1 text-gray-400">
          <button className="-rotate-12">
            <Heart size={17} fill="#E0E0E0" />
          </button>
          <button className="-rotate-12">
            <Bookmark size={17} fill="#E0E0E0" />
          </button>
        </div>
        {/* Rating */}
        <Rating value={3} />

        {/* Title row */}
        <div className="flex items-center justify-between pt-3">
          {/* Left: English title + surahs count */}
          <div className="flex flex-col gap-1">
            <h3 className="text-[13px] font-semibold text-[#39BA92] leading-tight">
              {titleEn}
            </h3>
            <div className="text-[10px] text-gray-400 leading-tight font-calsans">
              {surahsText}
            </div>
          </div>
          {/* Right: Arabic title + questions */}
          <div className="flex flex-col items-end">
            <div className="text-[16px] leading-none text-[#2372B9] font-semibold font-amiri">
              {titleAr}
            </div>
            <div className="mt-1 text-[10px] text-gray-400 leading-tight font-calsans">
              {questionsText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JuzCard;
