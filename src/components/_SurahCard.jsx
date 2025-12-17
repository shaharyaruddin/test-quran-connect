import {
  addBookMarkAyat,
  getAllBookMark,
  deleteBookMark,
} from "@/reducers/apiSlice";
import { Bookmark, Heart } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

const SurahCard = ({ surah, type }) => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.api.user);
  const bookmark = useSelector((state) => state.api.bookMarkSurah);

  const isBookmarked = bookmark.some(
    (item) => item.surahId === surah?._id && item.bookMarkType === "surah"
  );

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

  const handleBookMark = async () => {
    if (isBookmarked) {
      await handleDeleteBookmark();
    } else {
      await handleAddBookmark();
    }
  };

  const progressImages = {
    0: "/images/mqj-star-0.png",
    1: "/images/mqj-star-25.png",
    2: "/images/mqj-star-50.png",
    3: "/images/mqj-star-100.png",
  };

  return (
    <div className="card h-100 mt-2">
      <Link
        href={type === "surah" ? `/surah/${surah?._id}` : `/juzz/${surah?._id}`}
      >
        <div className="card-img-top">
          <img
            src={progressImages[surah?.star || 0] || ""}
            className="img-fluid"
            alt="Star Icon"
            width={83}
            style={{
              marginTop: "-37px",
            }}
          />
        </div>
        <div
          className="card-body mb-2"
          style={{
            height: "40px",
          }}
        >
          <h5 className="text-wrap">{surah?.name}</h5>
        </div>
        <div className="card-img-bottom">
          <img src={surah?.icon} className="img-fluid" alt="Star Icon" />
          <div className="card-numbers">{surah?.index}</div>
        </div>
      </Link>
      <div
        className="position-absolute"
        style={{
          bottom: -25,
          transform: "rotate(16deg)",
          left: "3px",
        }}
      >
        {type === "surah" ? (
          profile?.memorizedSurahs?.includes(surah?._id) ? (
            <Heart size={27} fill="#FF0000" className="cursor-pointer" />
          ) : (
            <Heart size={27} fill="#C8C8C8" className="cursor-pointer" />
          )
        ) : profile?.memorizedJuzz?.includes(surah?._id) ? (
          <Heart size={27} fill="#FF0000" className="cursor-pointer" />
        ) : (
          <Heart size={27} fill="#C8C8C8" className="cursor-pointer" />
        )}
      </div>
      <div
        className="position-absolute"
        style={{
          bottom: -25,
          right: "3px",
          transform: "rotate(-16deg)",
        }}
      >
        <Bookmark
          size={27}
          fill={isBookmarked ? "#e5ce2c" : "#C8C8C8"}
          className="cursor-pointer"
          onClick={handleBookMark}
        />
      </div>
    </div>
  );
};

export default SurahCard;
