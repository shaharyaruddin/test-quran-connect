import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Star, Heart } from "lucide-react";
import { useSelector } from "react-redux";

const Rating = ({ value = 0, max = 3 }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < value ? "fill-[#F7C948] text-[#F7C948]" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const SurahCard = ({
  number,
  titleEn,
  titleAr,
  ayahsText,
  questionsText,
  star,
  thumbnail,
  id,
  ...rest
}) => {
  const router = useRouter();

  const bookmark = useSelector((state) => state.api.bookMarkSurah);

  // const isBookmarked = bookmark.some(
  //   (item) => item.surahId === surah?._id && item.bookMarkType === "surah"
  // );

  const handleAddBookmark = async () => {
    try {
      const payload = {
        surahId: surah?._id,
        bookMarkType: "surah",
      };
      const res = await dispatch(addBookMarkAyat(payload))?.unwrap();
      console.log("Bookmark added:", res);
      await dispatch(getAllBookMark({ bookMarkType: "surah" }))?.unwrap();
    } catch (error) {
      console.log("Error adding bookmark:", error);
    }
  };

  const handleDeleteBookmark = async () => {
    try {
      const bookmarkItem = bookmark.find(
        (item) => item.surahId === surah?._id && item.bookMarkType === "surah"
      );
      if (!bookmarkItem) {
        console.log("Bookmark not found for surahId:", surah?._id);
        return;
      }
      const payload = { id: bookmarkItem._id };
      const res = await dispatch(deleteBookMark(payload))?.unwrap();
      console.log("Bookmark deleted:", res);
      await dispatch(getAllBookMark({ bookMarkType: "surah" }))?.unwrap();
    } catch (error) {
      console.log("Error deleting bookmark:", error);
    }
  };

  // const handleBookMark = async () => {
  //   if (isBookmarked) {
  //     await handleDeleteBookmark();
  //   } else {
  //     await handleAddBookmark();
  //   }
  // };

  // console.log("rating star: ", star);

  const go = () => router.push(`/surah/${id}`);
  return (
    <div
      onClick={go}
      className="cursor-pointer shadow-[0px_5px_6px_0px_rgba(0,_0,_0,_0.1)] group grid grid-cols-[120px_1fr] gap-3 bg-white rounded-xl hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden"
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
        <div className="absolute bottom-2 right-2 bg-[#2372B9] text-white w-8 h-5 rounded-[4px] flex items-center justify-center">
          <span className="text-xs font-bold">{number}</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-3 pr-4 pt-8 pb-3">
        {/* Top right icons */}
        <div className="absolute right-3 top-8 flex items-center gap-1 text-gray-400">
          <button className="-rotate-12">
            <Heart size={17} fill="#E0E0E0" />
          </button>
          {/* <button className="-rotate-12">
            <Bookmark
              size={27}
              // fill={isBookmarked ? "#e5ce2c" : "#C8C8C8"}
              className="cursor-pointer"
              onClick={handleBookMark}
            />{" "}
          </button> */}
        </div>

        {/* Rating */}
        <Rating value={star} />

        {/* Title row */}
        <div className="flex items-center justify-between pt-3">
          {/* Left: English title + ayahs */}
          <div className="flex flex-col gap-1">
            <h3 className="text-[14px] font-semibold text-[#39BA92] leading-tight">
              {titleEn}
            </h3>
            <div className="text-[10px] text-gray-400 leading-tight font-calsans">
              {ayahsText}
            </div>
          </div>
          {/* Right: Arabic title + questions (aligned right) */}
          <div className="flex gap-1 flex-col items-end">
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

export default SurahCard;

export const SurahCardSkeleton = () => {
  return (
    <div className="cursor-pointer  grid grid-cols-[120px_1fr] gap-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      {/* Thumbnail */}
      <div className="relative h-[120px] w-[135px] bg-gray-200">
        {/* Number Badge */}
        <div className="absolute bottom-2 right-2 bg-gray-300 w-8 h-5 rounded-[4px]" />
      </div>

      {/* Content */}
      <div className="relative p-3 pr-4 pt-8 pb-3">
        {/* Top right icons */}
        <div className="absolute right-3 top-8 flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-300 rounded" />
          <div className="w-4 h-4 bg-gray-300 rounded" />
        </div>

        {/* Rating */}
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-300 rounded" />
          ))}
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between pt-3">
          {/* Left: English title + ayahs */}
          <div className="flex flex-col gap-1">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>

          {/* Right: Arabic title + questions */}
          <div className="flex flex-col gap-1 items-end">
            <div className="h-5 w-14 bg-gray-300 rounded" />
            <div className="h-4 w-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
