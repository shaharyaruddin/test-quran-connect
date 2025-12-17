import {
    addBookMarkAyat,
    deleteBookMark,
    getAllBookMark,
  } from "@/reducers/apiSlice";
  import { Bookmark, Heart, Pause, Play, ThumbsUp } from "lucide-react";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  
  const JuzzArabicCard = ({
    ayahText,
    ayahNumber,
    ayahEnglish,
    BismillahTextArabic,
    BismillahTextEnglish,
    isPlaying,
    onPlay, // Receive play function
    fontSize,
    isSelected,
    ref,
    script,
    ayatId,
    onBookmark,
    tempBookmarkedIds
  }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const minFontSize = 10; // Minimum font size in pixels
    const maxFontSize = 50; // Maximum font size in pixels
    const sizeAdjustment = 5; // Add 5px to make it bigger
  
    // Calculate font size based on slider value, plus adjustment
    let calculatedFontSize =
      minFontSize +
      (maxFontSize - minFontSize) * (fontSize / 100) +
      sizeAdjustment;
    const translationFontSize = calculatedFontSize / 2;
  
    if (script === "67fde5c131fdd14db9aa6836") {
      calculatedFontSize = calculatedFontSize * 0.8; // Reduce font size by 30% for English
    }
    const dispatch = useDispatch();
    const bookmark = useSelector((state) => state?.api?.bookMarkAyah);
  
    const isBookmarked =
    bookmark.some(
      (item) => Array.isArray(item.ayatId) && item.ayatId.includes(ayatId)
    ) || tempBookmarkedIds?.includes(ayatId);
  
  
    const deleteBookmark = async () => {
      try {
        const bookmarkItem = bookmark.find(
          (item) => Array.isArray(item.ayatId) && item.ayatId.includes(ayatId)
        );
        if (!bookmarkItem) {
          console.log("Bookmark not found for ayatId:", ayatId);
          return;
        }
        const payload = {
          id: bookmarkItem._id,
        };
        const res = await dispatch(deleteBookMark(payload)).unwrap();
        await dispatch(getAllBookMark({ bookMarkType: "ayat" })).unwrap();
        console.log("Bookmark deleted", res);
      } catch (error) {
        console.log("Error in delete bookmark", error);
      }
    };
  
    return (
      <div
        ref={ref}
        className={`text-center ${isPlaying ? "light-yellow" : ""} ${
          isSelected ? "light-purple" : ""
        }`}
      >
        <div className="">
         
          <div
            className={`${
              script === "67fde5c131fdd14db9aa6836" ? "" : "font-UthmanicScript"
            }`}
            style={{ fontSize: `${calculatedFontSize}px` }}
          >
            {ayahText} <span>{ayahNumber}</span>
          </div>
          {ayahEnglish && (
            <div style={{ fontSize: `${translationFontSize}px` }}>
              {ayahEnglish}
            </div>
          )}
          {BismillahTextArabic && (
            <div
              className={`${
                script === "67fde5c131fdd14db9aa6836" ? "" : "font-UthmanicScript"
              }`}
              style={{ fontSize: `${calculatedFontSize}px` }}
            >
              {BismillahTextArabic}
            </div>
          )}
          {BismillahTextEnglish && (
            <div style={{ fontSize: `${translationFontSize}px` }}>
              {BismillahTextEnglish}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default JuzzArabicCard;
  