import {
  deleteBookMark,
  getAllBookMark,
  getBookMarkAyatsById,
} from "@/reducers/apiSlice";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

const BookMarkModal = ({ closeModal }) => {
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState("surahs");
  const [bookmarkId, setBookMarkId] = useState("");
  const [ayatsSec, setAyatsSec] = useState(false);
  const [ayatsCount, setAyatsCount] = useState("");
  const [surahName, setSurahName] = useState("");
  const [displayAyat, setDisplayAyat] = useState([]);
  const bookmarkAyah = useSelector((state) => state.api.bookMarkAyah);
  const bookmarkSurah = useSelector((state) => state.api.bookMarkSurah);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSurah = (id) => {
    router.push(`/surah/${id}`);
    closeModal();
  };

  const handleDeleteBookmark = async (e, id) => {
    e.stopPropagation();
    try {
      const bookmarkItem = bookmarkSurah.find(
        (item) => item.surahId === id && item.bookMarkType === "surah"
      );
      if (!bookmarkItem) {
        console.log("Bookmark not found for surahId:", id);
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

  const handleDeleteBookmarkAyah = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await dispatch(deleteBookMark({ id })).unwrap();
      console.log("Bookmark deleted:", res);
      await dispatch(getAllBookMark({ bookMarkType: "ayat" })).unwrap();
      setAyatsSec(false);
    } catch (error) {
      console.log("Error in deleting bookmark:", error);
    }
  };

  const handleBookMarkAyats = async (id, ayat, surahName) => {
    setAyatsSec(true);
    try {
      setBookMarkId(id);
      setAyatsCount(ayat);
      setSurahName(surahName);
      const res = await dispatch(getBookMarkAyatsById(id))?.unwrap();
      setDisplayAyat(res?.data);
      console.log("res of ayats ", res?.data);
      console.log("res of ayats ", res);
    } catch (error) {
      console.log("error in bookmar ayats", error);
    }
  };
  console.log("currentId", bookmarkId);
  const handleBack = () => {
    setAyatsSec(false);

    setDisplayAyat([]);
  };

  return (
    <div className="w-full mt-4 text-center">
      {/* Tabs */}
      <div className="mt-4 w-full bg-[#eee] rounded-full p-1 flex">
        <button
          onClick={() => setActiveTab("surahs")}
          className={`flex-1 py-2 rounded-full font-semibold transition-all duration-300 ${
            activeTab === "surahs"
              ? "bg-[#3DB47D] text-white shadow-md"
              : "text-gray-600 hover:text-[#3DB47D]"
          }`}
        >
          {t("Surahs")}
        </button>

        <button
          onClick={() => setActiveTab("ayahs")}
          className={`flex-1 py-2 rounded-full font-semibold transition-all duration-300 ${
            activeTab === "ayahs"
              ? "bg-[#3DB47D] text-white shadow-md"
              : "text-gray-600 hover:text-[#3DB47D]"
          }`}
        >
          {t("Ayahs")}
        </button>
      </div>

      {/* Content Section */}
      <div className="mt-5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        {activeTab === "surahs" && (
          <>
            {bookmarkSurah.length > 0 ? (
              bookmarkSurah.map((ayah, index) => (
                <div
                  key={index}
                  onClick={() => handleSurah(ayah?.surahId)}
                  className="group cursor-pointer rounded-lg bg-[#3DB47D]/80 hover:bg-[#3DB47D] transition-all duration-300 shadow-sm hover:shadow-md flex justify-between items-center px-4 py-3 mb-2"
                >
                  <h3 className="text-white font-medium">
                    {t("Surah")} {ayah?.chapters?.index} {ayah?.chapters?.name}
                  </h3>

                  <Bookmark
                    fill="#e5ce2c"
                    onClick={(e) => handleDeleteBookmark(e, ayah?.surahId)}
                    className="cursor-pointer opacity-90 hover:opacity-100 transition"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 mt-8">{t("Nobookmarkyet")}</p>
            )}
          </>
        )}

        {activeTab === "ayahs" && (
          <>
            {!ayatsSec ? (
              <>
                {bookmarkAyah.length > 0 ? (
                  bookmarkAyah.map((ayah, index) => {
                    const firstIndex = ayah?.firstAyat?.ayatIndex;
                    const lastIndex = ayah?.lastAyat?.ayatIndex;
                    const ayahDisplay =
                      firstIndex === lastIndex
                        ? `${firstIndex}`
                        : `${firstIndex}-${lastIndex}`;
                    const surahName = ayah?.firstAyat?.chapters?.name;

                    return (
                      <div
                        key={index}
                        onClick={() =>
                          handleBookMarkAyats(ayah?._id, ayahDisplay, surahName)
                        }
                        className="cursor-pointer rounded-lg bg-[#2372B9]/90 hover:bg-[#2372B9] transition-all duration-300 shadow-sm hover:shadow-md flex justify-between items-center px-4 py-3 mb-2"
                      >
                        <h3 className="text-white font-medium">
                          Surah {surahName}
                        </h3>

                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium">
                            Ayah {ayahDisplay}
                          </h3>
                          <Bookmark
                            fill="white"
                            onClick={(e) =>
                              handleDeleteBookmarkAyah(e, ayah?._id)
                            }
                            className="cursor-pointer opacity-90 hover:opacity-100 transition"
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 mt-8">{t("Nobookmarkyet")}</p>
                )}
              </>
            ) : (
              <div className="bg-[#2372B9] rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <ArrowLeft
                    color="white"
                    onClick={handleBack}
                    className="cursor-pointer hover:scale-110 transition"
                  />
                  <div className="text-white font-medium text-lg">
                    Surah {surahName} • {t("Ayahs")} {ayatsCount}
                  </div>
                  <Bookmark
                    fill="#ffff"
                    onClick={(e) => handleDeleteBookmarkAyah(e, bookmarkId)}
                    className="cursor-pointer hover:scale-105 transition"
                  />
                </div>

                {displayAyat.length > 0 ? (
                  displayAyat?.[0]?.ayats?.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg px-3 py-3 flex items-center justify-between shadow-sm mb-2"
                    >
                      <h2 className="text-black font-UthmanicScript text-xl leading-relaxed">
                        {item?.scripts[0]?.text}
                      </h2>
                      <Bookmark
                        fill="0000"
                        onClick={(e) => handleDeleteBookmarkAyah(e, bookmarkId)}
                        className="cursor-pointer hover:opacity-80 transition"
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin w-7 h-7 border-2 border-white border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookMarkModal;
