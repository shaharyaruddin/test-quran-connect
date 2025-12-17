import { deleteBookMark, getAllBookMark } from "@/reducers/apiSlice";
import { Bookmark, Pause, Play, RefreshCw, Infinity } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ArabicAyahsCard = ({
  ayahText,
  ayahNumber,
  ayahEnglish,
  BismillahTextArabic,
  BismillahTextEnglish,
  isPlaying,
  onPlay,
  fontSize,
  isSelected,
  ref,
  script,
  ayatId,
  onBookmark,
  tempBookmarkedIds,
  setTempBookmarkedIds,
  index,
  setRepeatCount,
  repeatCount,
  onRepeat,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const minFontSize = 10;
  const maxFontSize = 50;
  const sizeAdjustment = 5;
  const profile = useSelector((state) => state.api.user);
  const englishScript = "67fde5c131fdd14db9aa6836";

  let calculatedFontSize =
    minFontSize +
    (maxFontSize - minFontSize) * (fontSize / 100) +
    sizeAdjustment;

let mobilecalculatedFontSize =
  minFontSize + (maxFontSize - minFontSize) * (fontSize / 200) + sizeAdjustment;

  const translationFontSize = calculatedFontSize / 2;

  if (script === englishScript) {
    calculatedFontSize = calculatedFontSize * 0.8;
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
      if (!bookmarkItem) return;

      const payload = { id: bookmarkItem._id };
      await dispatch(deleteBookMark(payload)).unwrap();
      await dispatch(getAllBookMark({ bookMarkType: "ayat" })).unwrap();
      setTempBookmarkedIds((prev) => prev.filter((id) => id !== ayatId));
    } catch (error) {
      console.log("Error in delete bookmark", error);
    }
  };

  return (
    <div
      ref={ref}
      className={`bg-white rounded-lg px-3 py-3 text-center ${
        isPlaying ? "light-yellow" : ""
      } ${isSelected ? "light-purple" : ""}`}
    >
      <div className="pt-4 relative">
        <div className="absolute left-0 top-0 w-full px-2">
          <div
            className="float-left cursor-pointer text-primary-l"
            onClick={() => onPlay(index + 1)}
          >
            {isPlaying ? (
              <Pause size={20} fill="#5f377c" />
            ) : (
              <Play size={20} fill="#5f377c" />
            )}
          </div>

          <div className="relative mb-5 float-left mx-1">
            {repeatCount && repeatCount === 100 ? (
              <Infinity
                color={repeatCount > 1 ? "#5f377c" : "gray"}
                className="cursor-pointer"
                onClick={() => onRepeat()}
              />
            ) : (
              <RefreshCw
                size={18}
                color={repeatCount > 1 ? "#5f377c" : "gray"}
                className="cursor-pointer"
                onClick={() => onRepeat()}
              />
            )}
          </div>

          <div
            className="absolute "
            style={{
              left: "39px",
              fontSize: "11px",
              top: "6px",
              display: repeatCount === 100 ? "none" : "block",
            }}
          >
            {repeatCount}
          </div>

          <div className="float-right  pt-1 flex gap-1">
            {profile && (
              <Bookmark
                size={21}
                onClick={() => {
                  if (isBookmarked) {
                    deleteBookmark();
                  } else {
                    onBookmark();
                  }
                }}
                className="cursor-pointer"
                fill={isBookmarked ? "#e5ce2c" : "#D3D3D3"}
                color={isBookmarked ? "#e5ce2c" : "#D3D3D3"}
              />
            )}
          </div>
        </div>

        <div
          dir={script === englishScript ? "ltr" : ""}
          className={`${
            script === englishScript
              ? ""
              : script === "67ff8621845b885742c9fa48"
              ? "font-IndoPak "
              : "font-UthmanicScript "
          }`}
          style={{ fontSize: `${calculatedFontSize}px` }}
        >
          {ayahText}{" "}
          <span
            className={`${script === englishScript ? "" : "font-UthmanicAyat"}`}
          >
            {ayahNumber}
          </span>
        </div>

        {ayahEnglish && (
          <div style={{ fontSize: `${translationFontSize}px` }}>
            {ayahEnglish}
          </div>
        )}

        {BismillahTextArabic && (
          <div
            className={`${
              script === englishScript ? "" : "font-UthmanicScript"
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

export default ArabicAyahsCard;
