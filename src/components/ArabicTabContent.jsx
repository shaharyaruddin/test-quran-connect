import React, { useEffect, useRef, useState } from "react";
import {
  textBasedOnScript,
  textBasedOnScriptForAyat,
  toArabicNumber,
} from "../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import {
  addBookMarkAyat,
  deleteBookMark,
  getAllBookMark,
} from "@/reducers/apiSlice";
import indopakScript from "@/utils/quran_15_lines_updated_indopak.json";
import otherScripts from "@/utils/quran_15_lines_updated_Usmani.json";

import {
  Bookmark,
  Pause,
  Play,
  RefreshCw,
  Infinity,
  RotateCcw,
  Heart,
} from "lucide-react";
import AyatsLoader from "./AyatsLoader";
import { useRouter } from "next/router";
import Button from "./Button";
import Modal from "./Modal";
import MemorizedModal from "./MemorizedModal";
import { t } from "i18next";

const ArabicTabContent = ({
  ayats,
  bismillah,
  playingAyahIndex,
  playingAudio,
  fontSize,
  currentVerse,
  scripts,
  type,
  id,
  hizb,
  lines,
  surah,
  juzzNo,
  repeatCount,
  onRepeat,
  currentRuku,
  isPlaying,
  loader,
}) => {
  const router = useRouter();
  const [scrollTrigger, setScrollTrigger] = useState(null);
  const [highlightedVerse, setHighlightedVerse] = useState(null);
  const [selectedAyats, setSelectedAyats] = useState([]);
  const [tempBookmarkedIds, setTempBookmarkedIds] = useState([]);
  const profile = useSelector((state) => state.api.user);

  //for heart modal type
  const [modalType, setModalType] = useState("");

  const dispatch = useDispatch();
  const timeoutRef = useRef(null);
  const selectedAyatsRef = useRef([]);
  const ayahRefs = useRef([]);
  const hizbRefs = useRef({}); // Refs for Hizb markers
  const surahs = useSelector((state) => state.api.surahs);
  const juzzList = useSelector((state) => state.api.juzz);
  const minFontSize = 30; // Minimum font size in pixels
  const maxFontSize = 50; // Maximum font size in pixels
  const sizeAdjustment = 5; // Add 5px to make it bigger
  const englishScript = "67fde5c131fdd14db9aa6836";
  let calculatedFontSize =
    minFontSize +
    (maxFontSize - minFontSize) * (fontSize / 100) +
    sizeAdjustment;

  if (scripts === englishScript) {
    calculatedFontSize = calculatedFontSize * 0.8; // Reduce font size by 30% for English
  }
  //Find Hizb
  const findCurrentJuzz = juzzList?.find((item) => item?._id === id);
  const findArbah = findCurrentJuzz?.hisb?.arbah;
  const findNisf = findCurrentJuzz?.hisb?.nisf;
  const findSalasa = findCurrentJuzz?.hisb?.salasa;
  const bookmark = useSelector((state) => state?.api?.bookMarkAyah);

  const bookmark2 = useSelector((state) => state?.api?.bookMarkSurah);

  console.log("bookmark: ", bookmark);

  const hizbMap = {
    arbah: findArbah,
    nisf: findNisf,
    salasa: findSalasa,
  };
  const hizbId = hizbMap[hizb] || null;
  // console.log("find Script", scripts);

  // For Highlight Ayah and Hizb
  useEffect(() => {
    ayahRefs.current = Array(ayats?.length).fill(null);
  }, [ayats]);

  useEffect(() => {
    if (currentVerse) {
      setScrollTrigger(currentVerse);
      setHighlightedVerse(currentVerse);
      const timer = setTimeout(() => {
        setHighlightedVerse(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentVerse]);

  useEffect(() => {
    if (hizbId) {
      setScrollTrigger(hizbId); // Use hizbId instead of hizb
      setHighlightedVerse(hizbId);
      const timer = setTimeout(() => {
        setHighlightedVerse(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hizbId]);

  useEffect(() => {
    if (scrollTrigger && ayahRefs.current.length === ayats.length) {
      // Scroll to Hizb marker if scrollTrigger matches a Hizb ID
      if (
        [findArbah, findNisf, findSalasa].includes(scrollTrigger) &&
        hizbRefs.current[scrollTrigger]
      ) {
        hizbRefs.current[scrollTrigger].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        // Scroll to ayah if scrollTrigger is an ayatIndex
        const index = ayats.findIndex(
          (ayah) =>
            String(
              type === "juzz"
                ? `${ayah.surahId?.index} : ${ayah.ayatIndex}`
                : ayah.ayatIndex
            ) === String(scrollTrigger)
        );
        if (index !== -1 && ayahRefs.current[index]) {
          ayahRefs.current[index].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  }, [scrollTrigger, ayats, findArbah, findNisf, findSalasa]);

  useEffect(() => {
    if (playingAyahIndex !== null && ayahRefs.current[playingAyahIndex]) {
      ayahRefs.current[playingAyahIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [playingAyahIndex]);

  const handleBookmarkClick = (ayah) => {
    setTempBookmarkedIds((prev) => [...prev, ayah._id]);
    setSelectedAyats((prev) => {
      const alreadySelected = prev.find((a) => a._id === ayah._id);
      if (alreadySelected) return prev;

      // Add new ayah and sort by ayatIndex
      const updated = [...prev, ayah].sort((a, b) => a.ayatIndex - b.ayatIndex);
      selectedAyatsRef.current = updated;
      return updated;
    });

    // Reset timer on each click
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      handleBookmarkSubmit();
    }, 5000); // 5 seconds window
  };

  const handleBookmarkSubmit = async () => {
    const selected = selectedAyatsRef.current;

    if (selected.length === 0) return;

    // Sort based on ayatIndex in ascending order for checking sequentiality
    const sorted = [...selected].sort((a, b) => a.ayatIndex - b.ayatIndex);

    // Check if the sorted ayats are sequential (in ascending order)
    const isSequential = sorted.every((curr, i, arr) => {
      return i === 0 || curr.ayatIndex === arr[i - 1].ayatIndex + 1;
    });

    // console.log(
    //   "📌 Selected Ayat Indexes (Sorted):",
    //   sorted.map((a) => a.ayatIndex)
    // );
    // console.log("✅ Are Ayats Sequential?", isSequential);

    // If the selected ayahs are sequential, process them as a group
    if (isSequential) {
      const ayatIds = sorted.map((a) => a._id);

      const payload = {
        ayatId: ayatIds,
        bookMarkType: "ayat",
      };

      // Dispatch a single group bookmark request
      await dispatch(addBookMarkAyat(payload)).unwrap();
    } else {
      // If not sequential, process each ayah individually
      for (const ayah of sorted) {
        const payload = {
          ayatId: [ayah._id],
          bookMarkType: "ayat",
        };

        // Dispatch individual bookmark requests for non-sequential ayahs
        await dispatch(addBookMarkAyat(payload)).unwrap();
      }
    }

    // Fetch updated bookmarks
    await dispatch(getAllBookMark({ bookMarkType: "ayat" })).unwrap();

    // Reset selected ayats after submission
    setSelectedAyats([]);
    selectedAyatsRef.current = [];
    setTempBookmarkedIds([]);
  };

  const deleteBookmark = async (ayatId) => {
    try {
      const bookmarkItem = bookmark.find(
        (item) => Array.isArray(item.ayatId) && item.ayatId.includes(ayatId)
      );
      if (!bookmarkItem) return;

      const payload = { id: bookmarkItem._id };
      await dispatch(deleteBookMark(payload)).unwrap();
      await dispatch(getAllBookMark({ bookMarkType: "ayat" })).unwrap();

      // Optionally remove from temp state
      setTempBookmarkedIds((prev) => prev.filter((id) => id !== ayatId));
    } catch (error) {
      console.log("Error deleting bookmark", error);
    }
  };
  const isBookmarked = (ayahId) => {
    return bookmark?.some(
      (item) => Array.isArray(item.ayatId) && item.ayatId.includes(ayahId)
    );
  };

  const isBookmarked2 = bookmark2.some(
    (item) => item.surahId === id && item.bookMarkType === "surah"
  );

  console.log("isBookmarked2", isBookmarked2);

  // Remove bismillah from Surah9
  const findCurrentSurah = surahs?.find((item) => item?._id === id);
  const checkSurah9 = findCurrentSurah?.index === 9;

  // const groupedPages = quranPages
  //   ?.filter((item) => item?.juzNumber === findCurrentJuzz?.index)
  //   .map((page) => {
  //     const {
  //       pageNumber,
  //       ayatStartNumber,
  //       ayatEndNumber,
  //       chapterStart,
  //       chapterEnd,
  //       juzNumber,
  //     } = page;

  //     // Filter ayats based on chapterStart, chapterEnd, and the specific ayat range
  //     const ayatsForPage = ayats.filter((ayat) => {
  //       const surahIndex = ayat.surahId.index;

  //       // Handle single surah case (chapterStart === chapterEnd)
  //       if (chapterStart === chapterEnd) {
  //         return (
  //           surahIndex === chapterStart &&
  //           ayat.ayatIndex >= ayatStartNumber &&
  //           ayat.ayatIndex <= ayatEndNumber
  //         );
  //       }

  //       // Handle multiple surahs case (chapterStart !== chapterEnd)
  //       return (
  //         // For chapterStart, only include ayats from ayatStartNumber onwards
  //         (surahIndex === chapterStart &&
  //           ayat.ayatIndex - 1 >= ayatStartNumber) ||
  //         // For chapterEnd, only include ayats up to ayatEndNumber
  //         (surahIndex === chapterEnd && ayat.ayatIndex - 1 <= ayatEndNumber) ||
  //         // For surahs in between, include all ayats
  //         (surahIndex > chapterStart && surahIndex < chapterEnd)
  //       );
  //     });

  //     return {
  //       pageNumber,
  //       juzNumber,
  //       chapterStart,
  //       chapterEnd,
  //       ayats: ayatsForPage,
  //     };
  //   });

  const changeJson =
    scripts === "67ff8621845b885742c9fa48" ? indopakScript : otherScripts;

  const groupedPages = changeJson
    ?.filter((item) => item?.juzNumber === findCurrentJuzz?.index)
    .map((page) => {
      const {
        pageNumber,
        ayatStartNumber,
        ayatEndNumber,
        chapterStart,
        chapterEnd,
        juzNumber,
      } = page;

      const ayatsForPage = ayats.filter((ayat) => {
        const surahIndex = ayat.surahId.index;

        if (chapterStart === chapterEnd) {
          return (
            surahIndex === chapterStart &&
            ayat.ayatIndex >= ayatStartNumber &&
            ayat.ayatIndex <= ayatEndNumber
          );
        }

        return (
          (surahIndex === chapterStart && ayat.ayatIndex >= ayatStartNumber) ||
          (surahIndex === chapterEnd && ayat.ayatIndex <= ayatEndNumber) ||
          (surahIndex > chapterStart && surahIndex < chapterEnd)
        );
      });

      // ✅ Total text length of all ayats in the page
      const totalTextLength = ayatsForPage.reduce((acc, ayah) => {
        const text =
          textBasedOnScriptForAyat(ayah, scripts)?.replace(/—/g, " ") || "";
        return acc + text.length;
      }, 0);

      return {
        pageNumber,
        juzNumber,
        chapterStart,
        chapterEnd,
        ayats: ayatsForPage,
        totalTextLength, // add this
      };
    });

  const findSurahInJuzz = surahs?.find(
    (item) => item?.index == surah && item?.parahNumber == juzzNo
  );

  const surahRef = useRef(null);
  const rukuRef = useRef({});

  // Step 3: Scroll when component mounts or params change
  useEffect(() => {
    if (findSurahInJuzz && surahRef.current) {
      surahRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [findSurahInJuzz]);

  // console.log(ayats)
  const findRuku = ayats?.find(
    (item) => item?.rukuEnd?.rukuNo === Number(currentRuku)
  );

  useEffect(() => {
    if (findRuku?.rukuEnd?.rukuNo !== undefined) {
      const rukuNo = Number(findRuku.rukuEnd.rukuNo); // Ensure it's a number
      const refElement = rukuRef.current[rukuNo];
      if (refElement) {
        refElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [findRuku]);

  // const getDynamicWordSpacing = (textLength, ayatsLength, surahsLength) => {
  //   let spacing;

  //   if (textLength <= 1140) {
  //     // Range 1100–1200 maps to 10–5
  //     const minLen = 1100;
  //     const maxLen = 1140;
  //     const minSpacing = 7;
  //     const maxSpacing = 16;

  //     const ratio = (textLength - minLen) / (maxLen - minLen);
  //     spacing = maxSpacing - ratio * (maxSpacing - minSpacing);
  //   }
  //   else if (textLength <= 1151) {
  //     // Range 1100–1200 maps to 10–5
  //     const minLen = 1140;
  //     const maxLen = 1150;
  //     const minSpacing = 10;
  //     const maxSpacing = 55

  //     const ratio = (textLength - minLen) / (maxLen - minLen);
  //     spacing = maxSpacing - ratio * (maxSpacing - minSpacing);
  //   }
  //   else if (textLength <= 1200) {
  //     // Range 1100–1200 maps to 10–5
  //     const minLen = 1151;
  //     const maxLen = 1200;
  //     const minSpacing = 5;
  //     const maxSpacing = 5;

  //     const ratio = (textLength - minLen) / (maxLen - minLen);
  //     spacing = maxSpacing - ratio * (maxSpacing - minSpacing);
  //   }
  //   else if (textLength <= 1290) {
  //     // Range 1200–1330 maps to 5–1
  //     const minLen = 1200;
  //     const maxLen = 1290;
  //     const minSpacing = 1;
  //     const maxSpacing = 3;

  //     const ratio = (textLength - minLen) / (maxLen - minLen);
  //     spacing = maxSpacing - ratio * (maxSpacing - minSpacing);
  //   }
  //   else if (textLength <= 1330) {
  //     // Range 1200–1330 maps to 5–1
  //     const minLen = 1200;
  //     const maxLen = 1330;
  //     const minSpacing = 1;
  //     const maxSpacing = 5;

  //     const ratio = (textLength - minLen) / (maxLen - minLen);
  //     spacing = maxSpacing - ratio * (maxSpacing - minSpacing);
  //   }
  //   else {
  //     spacing = 1; // For text > 1330
  //   }

  //   return `${spacing.toFixed(1)}px`;
  // };

  const getDynamicWordSpacing = (textLength, ayatsLength, surahsLength) => {
    // Base thresholds
    const baseMinLen = 1100;
    const baseMaxLen = 1350;

    // Dynamic scaling factors
    const surahMultiplier = surahsLength > 1 ? 0.6 : 0.8;
    const ayatFactor =
      ayatsLength <= 3
        ? 1.6
        : ayatsLength <= 7
        ? 1.0
        : ayatsLength <= 8
        ? 1.2
        : ayatsLength <= 13
        ? 1.2
        : ayatsLength <= 15
        ? 0.8
        : ayatsLength <= 30
        ? 0.6
        : 0.85;

    // Calculate effective spacing range dynamically
    const maxSpacing = 16 * ayatFactor * surahMultiplier;
    const minSpacing = 1 * surahMultiplier;

    // Clamp text length
    const clampedLength = Math.max(
      baseMinLen,
      Math.min(textLength, baseMaxLen)
    );

    // Interpolation ratio
    const ratio = (clampedLength - baseMinLen) / (baseMaxLen - baseMinLen);

    // Interpolate spacing: longer text = less spacing
    const spacing = maxSpacing - ratio * (maxSpacing - minSpacing);

    return `${spacing.toFixed(1)}px`;
  };

  const [activeAyahId, setActiveAyahId] = useState(null);
  const [toggleBtn, setToggleBtn] = useState(false);

  const handleAudioBox = (id) => {
    // Toggle the box visibility for the clicked ayah
    setActiveAyahId(activeAyahId === id ? null : id);
  };

  const bismillahRefs = useRef({});

  const handleAddBookmark = async () => {
    try {
      const payload = {
        surahId: id,
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
      const bookmarkItem = bookmark2.find(
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

  const handleBookMark = async () => {
    if (isBookmarked2) {
      await handleDeleteBookmark();
    } else {
      await handleAddBookmark();
    }
  };
  //FOR HEART MODAL
  const handleModalOpen = (type, path) => {
    setModalType(type);
    if (path) {
      setPath(path);
    }
  };

  //for scroll 15 lines ayat
  useEffect(() => {
    if (playingAyahIndex && playingAyahIndex.surahId) {
      const { index, surahId } = playingAyahIndex;
      let element;
      if (index === -1) {
        // Scroll to bismillah
        element = bismillahRefs.current[surahId];
      } else {
        // Scroll to ayah
        element = ayahRefs.current[index];
      }
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        console.log(
          `📜 Scrolled to ${index === -1 ? "bismillah" : `ayah ${index}`}`
        );
      } else {
        console.warn(
          `⚠️ No ref found for ${index === -1 ? "bismillah" : `ayah ${index}`}`
        );
      }
    }
  }, [playingAyahIndex]);
  let rukuCounter = 0; // outside map so it persists

  const handleModalClose = () => {
    const modalElement = document.getElementById("memorized-modal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
    setModalType(""); // Reset modal type after closing
  };

  const handleMemorized = async () => {
    try {
      const response = await dispatch(memorizeSurah(id))?.unwrap();
      handleModalClose();
    } catch (error) {
      console.log("error in memorized surah", error);
    }
  };

  const handleUnMemorized = async () => {
    try {
      const response = await dispatch(unMemorizeSurah(id))?.unwrap();
      handleModalClose();
    } catch (error) {
      console.log("error in unmemorized surah", error);
    }
  };

  return (
    <>
      <Modal id="memorized-modal" type="purple" hideClose>
        {modalType === "memorized" && (
          <MemorizedModal
            icon="/images/mqj-heart.svg"
            description={t("HaveyoumemorizedthisSurah")}
            handleModalClose={handleModalClose}
            handleSurah={handleMemorized}
          />
        )}
        {modalType === "unmemorized" && (
          <MemorizedModal
            icon="/images/mqj-unmemorized-icon.svg"
            description={t("Areyousureyouwanttounmarkthissurahasmemorized")}
            handleModalClose={handleModalClose}
            handleSurah={handleUnMemorized}
          />
        )}
      </Modal>
      <div className="space-y-8">
        {loader ? (
          <AyatsLoader />
        ) : lines === "15" ? (
          groupedPages?.map((page, pageIndex) => {
            const uniqueSurahIds = [
              ...new Set(page?.ayats?.map((opt) => opt?.surahId?._id)),
            ];

            return (
              <div key={pageIndex} className="rounded-md p-2 ">
                {/* Page Number */}
                <div className="flex flex-wrap  md:w-3/4 mx-auto items-end">
                  <div className="flex flex-wrap justify-between text-white text-3xl mb-0 gap-2">
                    {uniqueSurahIds?.map((surahId, index) => {
                      const findSpecificSurah = surahs?.find(
                        (item) => item?._id === surahId
                      );
                      return (
                        <span
                          key={surahId}
                          className=""
                          style={{
                            fontSize:
                              uniqueSurahIds.length > 1 ? "18px" : "25px",
                          }}
                        >
                          {findSpecificSurah?.arabicName}{" "}
                          {toArabicNumber(findSpecificSurah?.index)}
                          {index < uniqueSurahIds.length - 1 ? "," : ""}
                        </span>
                      );
                    })}
                  </div>

                  <div className="md:w-full text-center">
                    <p className="text-white text-3xl mb-0 shrink-0">
                      {/* {toArabicNumber(page.pageNumber)} */}
                    </p>
                  </div>
                  <div className="md:w-full text-right">
                    <p className="text-white  text-3xl mb-0 shrink-0">
                      {findCurrentJuzz?.meaning}{" "}
                      {toArabicNumber(findCurrentJuzz?.index)}
                    </p>
                  </div>
                </div>

                <div
                  className="bg-white px-3 relative"
                  style={{
                    // fontSize: `45px`, // Adjust this dynamically
                    lineHeight: "2.1", // Adjust for line spacing
                    direction: "rtl",
                    textAlign: "justify",
                    textAlignLast: "center",
                    width: "880px", // Ensure full container width
                    margin: "auto",
                    // letterSpacing: '2px',
                    borderRadius: "12px",
                    paddingTop: "34px",
                    paddingBottom: "34px",
                  }}
                >
                  {uniqueSurahIds.map((surahId) => {
                    const findSurah = surahs?.find((s) => s?._id === surahId);
                    const ayatsInSurah = page?.ayats?.filter(
                      (a) => a?.surahId?._id === surahId
                    );

                    return (
                      <div key={surahId}>
                        {ayatsInSurah[0]?.ayatIndex === 1 && (
                          <div className=" relative text-center mb-2">
                            <img
                              src="/images/frame.png"
                              className="img-fluid w-75"
                              alt="Surah Box"
                              style={{ marginBottom: "-39px" }}
                            />
                            <h5
                              className="position-absolute top-50 start-50 translate-middle text-[#3DB47D]"
                              style={{
                                fontSize: "45px",
                                whiteSpace: "nowrap",
                                marginTop: "-11px",
                              }}
                            >
                              {toArabicNumber(findSurah?.index)} -{" "}
                              {findSurah?.arabicName}
                            </h5>
                          </div>
                        )}

                        {/* Bismillah */}
                        {ayatsInSurah[0]?.ayatIndex === 1 &&
                          findSurah?.index !== 9 && (
                            <span
                              ref={(el) =>
                                (bismillahRefs.current[surahId] = el)
                              }
                              className={`block ${
                                scripts === "67ff8621845b885742c9fa48"
                                  ? "font-IndoPak"
                                  : "font-UthmanicScript"
                              } ${
                                playingAyahIndex?.surahId === surahId &&
                                playingAyahIndex?.index === -1
                                  ? "highlighted-ayat"
                                  : ""
                              }`}
                              style={{
                                fontSize: "45px",
                              }}
                            >
                              {textBasedOnScript(bismillah, scripts)}{" "}
                            </span>
                          )}

                        {/* Ayahs inline */}
                        {ayatsInSurah?.map((ayah, index) => {
                          if (ayah.rukuEnd) {
                            rukuCounter += 1;
                          }

                          // // Ruku ayah count logic
                          let ayahsInRuku = 0;
                          let rukuInParah = 0;

                          if (ayah.rukuEnd) {
                            const startAyatId = ayah?.rukuEnd?.startAyat;
                            const endAyatId = ayah?.rukuEnd?.endAyat;
                            const totalRukuInParah = ayats?.find(
                              (item) => item?.rukuEnd
                            );

                            if (totalRukuInParah?.rukuEnd?.rukuNo > 1) {
                              const rukuParah =
                                ayah?.rukuEnd?.rukuNo -
                                totalRukuInParah?.rukuEnd?.rukuNo;
                              rukuInParah = rukuParah > 0 ? rukuParah : 1; // Ensure rukuInParah is never zero
                            } else {
                              rukuInParah = ayah?.rukuEnd?.rukuNo || 1; // Default to 1 if rukuNo is zero or undefined
                            }

                            // Find the start and end indices of the Ayats by their IDs
                            const startIndex = ayats.findIndex(
                              (item) => item._id === startAyatId
                            );
                            const endIndex = ayats.findIndex(
                              (item) => item._id === endAyatId
                            );

                            // If both start and end indices are found and valid
                            if (
                              startIndex !== -1 &&
                              endIndex !== -1 &&
                              endIndex >= startIndex
                            ) {
                              // Slice the array to get Ayats between startIndex and endIndex (inclusive)
                              const ayatsInRuku = ayats.slice(
                                startIndex,
                                endIndex + 1
                              );

                              // Count the number of Ayats between the start and end indices
                              const ayahsInRukuCount = ayatsInRuku.length;

                              // console.log(
                              //   `Number of Ayats between ${startAyatId} and ${endAyatId}: ${ayahsInRukuCount}`
                              // );
                              ayahsInRuku = ayahsInRukuCount;
                            } else {
                              console.log("Invalid start or end Ayat IDs.");
                            }
                          }

                          const globalAyahIndex = ayats.findIndex(
                            (a) => a._id === ayah._id
                          );

                          return (
                            <span key={ayah._id} className="inline">
                              <span className="position-relative">
                                <span
                                  ref={(el) =>
                                    (ayahRefs.current[globalAyahIndex] = el)
                                  }
                                  className={`cursor-pointer me-1
                                  ${
                                    playingAyahIndex?.surahId ===
                                      ayah.surahId._id &&
                                    playingAyahIndex?.index === globalAyahIndex
                                      ? "bg-[#3DB47D] text-white"
                                      : ""
                                  } 
                              ${
                                String(
                                  `${ayah.surahId?.index} : ${ayah.ayatIndex}`
                                ) === String(highlightedVerse)
                                  ? "bg-[#3DB47D] text-white"
                                  : ""
                              }
                               ${
                                 scripts === "67ff8621845b885742c9fa48"
                                   ? "font-IndoPak"
                                   : scripts === englishScript
                                   ? ""
                                   : "font-UthmanicScript"
                               }  
                               ${
                                 activeAyahId === ayah?._id
                                   ? "bg-[#E9D4FF]"
                                   : ""
                               }
                              `}
                                  onClick={() => handleAudioBox(ayah?._id)}
                                  style={{
                                    fontSize: "45px",
                                    // wordSpacing : isTextLong > 1200 ? '3px' : '13px'
                                    wordSpacing: getDynamicWordSpacing(
                                      page.totalTextLength,
                                      page?.ayats?.length,
                                      uniqueSurahIds?.length
                                    ),
                                  }}
                                >
                                  {activeAyahId === ayah?._id && (
                                    <span
                                      className="bg-[#6FCA9D] rounded px-3 py-2"
                                      style={{
                                        // top: "-50px",
                                        cursor: "pointer",
                                        position: "absolute",
                                        right: "0px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {!toggleBtn ? (
                                        <Play
                                          className="text-black"
                                          size={25}
                                          onClick={() => {
                                            setToggleBtn(true);
                                            playingAudio(globalAyahIndex);
                                            setActiveAyahId(null);
                                          }}
                                        />
                                      ) : (
                                        <Pause
                                          className="text-black"
                                          size={25}
                                          onClick={() => {
                                            setToggleBtn(false);
                                            playingAudio(globalAyahIndex);
                                          }}
                                        />
                                      )}
                                      <span className="inline-flex items-center gap-1">
                                        {repeatCount[globalAyahIndex] ===
                                        100 ? (
                                          <Infinity
                                            size={25}
                                            color={
                                              repeatCount[globalAyahIndex] > 1
                                                ? "#e5ce2c"
                                                : "black"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                              onRepeat(globalAyahIndex)
                                            }
                                          />
                                        ) : (
                                          <RefreshCw
                                            size={25}
                                            className="text-black cursor-pointer"
                                            color={
                                              repeatCount[globalAyahIndex] > 1
                                                ? "#e5ce2c"
                                                : "black"
                                            }
                                            onClick={() => {
                                              onRepeat(globalAyahIndex);
                                            }}
                                          />
                                        )}
                                        <span
                                          className="position-absolute text-black"
                                          style={{
                                            left: "61px",
                                            fontSize: "13px",
                                            top: "7px",
                                            display:
                                              repeatCount[globalAyahIndex] ===
                                              100
                                                ? "none"
                                                : "inline-block",
                                          }}
                                        >
                                          {repeatCount[globalAyahIndex]}
                                        </span>
                                      </span>
                                      <Bookmark
                                        size={25}
                                        fill={
                                          tempBookmarkedIds.includes(
                                            ayah._id
                                          ) || isBookmarked(ayah._id)
                                            ? "#e5ce2c"
                                            : "black"
                                        }
                                        className="cursor-pointer text-black"
                                        onClick={() => {
                                          if (
                                            isBookmarked(ayah._id) &&
                                            !tempBookmarkedIds.includes(
                                              ayah._id
                                            )
                                          ) {
                                            deleteBookmark(ayah._id);
                                          } else {
                                            handleBookmarkClick(ayah);
                                          }
                                        }}
                                      />
                                    </span>
                                  )}
                                  {textBasedOnScriptForAyat(
                                    ayah,
                                    scripts
                                  )?.replace(/—/g, " ")}
                                  <div className="relative inline">
                                    <span className="mx-1 font-UthmanicAyat ms-1">
                                      {scripts === englishScript
                                        ? `(${ayah?.ayatIndex})`
                                        : toArabicNumber(ayah?.ayatIndex)}
                                    </span>
                                    {ayah?.rukuEnd && (
                                      <span
                                        className="absolute"
                                        style={{
                                          top:
                                            scripts === englishScript
                                              ? "-12px"
                                              : "-7px",
                                          left:
                                            scripts === englishScript
                                              ? "27px"
                                              : "14px",
                                          fontSize: "15px",
                                          fontWeight: "bold",
                                          color: "black",
                                        }}
                                      >
                                        ع
                                      </span>
                                    )}
                                  </div>
                                </span>
                              </span>
                              {ayah._id === findArbah && (
                                <span
                                  ref={(el) =>
                                    (hizbRefs.current[findArbah] = el)
                                  }
                                  className={`${
                                    ayah?.rukuEnd && ayah._id === findArbah
                                      ? "hizb-15-lines hizb-15-lines-right"
                                      : "hizb-15-lines"
                                  }`}
                                >
                                  الربع
                                </span>
                              )}
                              {ayah._id === findNisf && (
                                <span
                                  ref={(el) =>
                                    (hizbRefs.current[findNisf] = el)
                                  }
                                  className={`${
                                    ayah?.rukuEnd && ayah._id === findNisf
                                      ? "hizb-15-lines hizb-15-lines-right"
                                      : "hizb-15-lines"
                                  }`}
                                >
                                  النصف
                                </span>
                              )}
                              {ayah._id === findSalasa && (
                                <span
                                  ref={(el) =>
                                    (hizbRefs.current[findSalasa] = el)
                                  }
                                  className={`${
                                    ayah?.rukuEnd && ayah._id === findSalasa
                                      ? "hizb-15-lines hizb-15-lines-right"
                                      : "hizb-15-lines"
                                  }`}
                                >
                                  الثلاثة
                                </span>
                              )}
                              {ayah?.rukuEnd ? (
                                <span
                                  className="lines-15-ruku"
                                  ref={(el) => {
                                    if (
                                      el &&
                                      ayah?.rukuEnd?.rukuNo !== undefined
                                    ) {
                                      rukuRef.current[ayah.rukuEnd.rukuNo] = el;
                                    }
                                  }}
                                >
                                  <span style={{ transform: "rotate(-91deg)" }}>
                                    <span
                                      style={{
                                        position: "absolute",
                                        fontSize: "18px",
                                        left: "28%",
                                        top: 10,
                                      }}
                                    >
                                      {toArabicNumber(ayah.rukuEnd.rukuInSurah)}
                                    </span>
                                    <span
                                      style={{
                                        position: "absolute",
                                        fontSize: "18px",
                                        top: "39px",
                                        left: "17px",
                                      }}
                                    >
                                      {toArabicNumber(ayahsInRuku)}
                                    </span>
                                    <span
                                      style={{
                                        position: "absolute",
                                        fontSize: "18px",
                                        left: "15px",
                                        bottom: -12,
                                      }}
                                    >
                                      {toArabicNumber(rukuCounter)}
                                    </span>
                                    <span className="">ع</span>
                                  </span>
                                </span>
                              ) : null}
                              {ayah?.sajdaNo && (
                                <span
                                  className={`${
                                    (ayah?.rukuEnd && ayah?.sajdaNo) ||
                                    ayah._id === findArbah ||
                                    ayah._id === findNisf ||
                                    ayah._id === findSalasa
                                      ? "sajda-15  sajda-right"
                                      : "sajda-15"
                                  }`}
                                  style={{
                                    position: "absolute",
                                    fontSize: "20px",
                                    transform: "rotate(-90deg)",
                                    right: "-60px",
                                  }}
                                >
                                  سَجْدَة{toArabicNumber(ayah?.sajdaNo)}
                                </span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : lines === "normal" ? (
          groupedPages.map((page, pageIndex) => {
            // Get unique surahs on this page
            const uniqueSurahIds = [
              ...new Set(page?.ayats?.map((opt) => opt?.surahId?._id)),
            ];

            return (
              <div key={pageIndex} className="rounded-lg">
                <div className="flex flex-wrap mb-2 items-end justify-between my-2 mt-2">
                  {/* Surah Names */}
                  <div className="flex flex-wrap gap-2 text-white rounded-lg text-3xl mb-0 w-1/3">
                    {uniqueSurahIds?.map((surahId, index) => {
                      const findSpecificSurah = surahs?.find(
                        (item) => item?._id === surahId
                      );
                      return (
                        <span
                          key={surahId}
                          style={{
                            fontSize:
                              uniqueSurahIds.length > 1 ? "18px" : "25px",
                          }}
                        >
                          {findSpecificSurah?.arabicName}{" "}
                          {toArabicNumber(findSpecificSurah?.index)}
                          {index < uniqueSurahIds.length - 1 ? "," : ""}
                        </span>
                      );
                    })}
                  </div>

                  {/* Page Number */}
                  <div className="text-center w-1/3">
                    <p className="text-white text-3xl mb-0">
                      {toArabicNumber(page.pageNumber)}
                    </p>
                  </div>

                  {/* Juzz Info */}
                  <div className="text-end w-1/3">
                    <p className="text-white text-3xl mb-0">
                      {findCurrentJuzz?.meaning}{" "}
                      {toArabicNumber(findCurrentJuzz?.index)}
                    </p>
                  </div>
                </div>

                {/* Ayah Container */}
                <div className="container text-center px-4 py-3 bg-white rounded-lg position-relative flex flex-wrap justify-center gap-2 leading-relaxed ">
                  {uniqueSurahIds?.map((surahId) => {
                    const findSpecificSurah = surahs?.find(
                      (item) => item?._id === surahId
                    );
                    const ayatsForSurah = page?.ayats?.filter(
                      (a) => a?.surahId?._id === surahId
                    );

                    return (
                      <div key={surahId}>
                        {/* Surah Header */}
                        {ayatsForSurah[0]?.ayatIndex === 1 && (
                          <div
                            className="position-relative text-center"
                            ref={
                              findSpecificSurah?.index == surah
                                ? surahRef
                                : null
                            }
                          >
                            {/* <img
                            src="/images/frame.png"
                            className="img-fluid w-50"
                            alt="Surah Box"
                            style={{ marginBottom: "-22px" }}
                          /> */}
                            <h5
                              className="position-absolute top-50 start-50 translate-middle text-purple-outline"
                              style={{
                                fontSize: "45px",
                                whiteSpace: "nowrap",
                                marginTop: "-20px",
                              }}
                            >
                              {toArabicNumber(findSpecificSurah?.index)} -{" "}
                              {findSpecificSurah?.arabicName}
                            </h5>
                          </div>
                        )}

                        {/* Ayats */}
                        <div
                          className="container py-1 bg-white rounded-2 position-relative"
                          dir="rtl"
                          style={{
                            lineHeight: "1.5",
                            fontSize: `${calculatedFontSize}px`,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            textAlign: "justify",
                            textAlignLast: "center",
                          }}
                        >
                          {/* Bismillah */}
                          {ayatsForSurah[0]?.ayatIndex === 1 &&
                            findSpecificSurah?.index !== 9 && (
                              <p
                                className={`${
                                  scripts === "67ff8621845b885742c9fa48"
                                    ? "font-IndoPak"
                                    : "font-UthmanicScript"
                                } ${
                                  playingAyahIndex?.surahId === surahId &&
                                  playingAyahIndex?.index === -1
                                    ? "highlighted-ayat p-0"
                                    : ""
                                }`}
                              >
                                {textBasedOnScript(bismillah, scripts)}
                              </p>
                            )}

                          {ayatsForSurah?.map((ayah, index) => {
                            if (ayah.rukuEnd) {
                              rukuCounter += 1;
                            }

                            // Ruku ayah count logic
                            let ayahsInRuku = 0;
                            let rukuInParah = 0;

                            if (ayah.rukuEnd) {
                              const startAyatId = ayah?.rukuEnd?.startAyat;
                              const endAyatId = ayah?.rukuEnd?.endAyat;
                              const totalRukuInParah = ayats?.find(
                                (item) => item?.rukuEnd
                              );

                              if (totalRukuInParah?.rukuEnd?.rukuNo > 1) {
                                const rukuParah =
                                  ayah?.rukuEnd?.rukuNo -
                                  totalRukuInParah?.rukuEnd?.rukuNo;
                                rukuInParah = rukuParah > 0 ? rukuParah : 1; // Ensure rukuInParah is never zero
                              } else {
                                rukuInParah = ayah?.rukuEnd?.rukuNo || 1; // Default to 1 if rukuNo is zero or undefined
                              }

                              // Find the start and end indices of the Ayats by their IDs
                              const startIndex = ayats.findIndex(
                                (item) => item._id === startAyatId
                              );
                              const endIndex = ayats.findIndex(
                                (item) => item._id === endAyatId
                              );

                              // If both start and end indices are found and valid
                              if (
                                startIndex !== -1 &&
                                endIndex !== -1 &&
                                endIndex >= startIndex
                              ) {
                                // Slice the array to get Ayats between startIndex and endIndex (inclusive)
                                const ayatsInRuku = ayats.slice(
                                  startIndex,
                                  endIndex + 1
                                );

                                // Count the number of Ayats between the start and end indices
                                const ayahsInRukuCount = ayatsInRuku.length;

                                // console.log(
                                //   `Number of Ayats between ${startAyatId} and ${endAyatId}: ${ayahsInRukuCount}`
                                // );
                                ayahsInRuku = ayahsInRukuCount;
                              } else {
                                console.log("Invalid start or end Ayat IDs.");
                              }
                            }

                            const globalAyahIndex = ayats.findIndex(
                              (a) => a._id === ayah._id
                            );

                            return (
                              <span key={ayah._id} className="inline">
                                {activeAyahId === ayah?._id && (
                                  <div className="relative inline">
                                    <div
                                      className="absolute start-100 -top-4 left-auto transform -translate-y-1/2 flex items-center gap-2 justify-center bg-[#CFF7E0] rounded px-3 py-2"
                                      style={{
                                        transform: "translate(0, -50%)",
                                        top: "-15px",
                                      }}
                                    >
                                      {!toggleBtn ? (
                                        <Play
                                          className="text-black"
                                          size={25}
                                          onClick={() => {
                                            setToggleBtn(true);
                                            playingAudio(globalAyahIndex);
                                            setActiveAyahId(null);
                                          }}
                                        />
                                      ) : (
                                        <Pause
                                          className="text-black"
                                          size={25}
                                          onClick={() => {
                                            setToggleBtn(false);
                                            playingAudio(globalAyahIndex);
                                          }}
                                        />
                                      )}
                                      <div className="d-flex align-items-center gap-1">
                                        {repeatCount[globalAyahIndex] ===
                                        100 ? (
                                          <Infinity
                                            color={
                                              repeatCount[globalAyahIndex] > 1
                                                ? "#e5ce2c"
                                                : "black"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                              onRepeat(globalAyahIndex)
                                            }
                                          />
                                        ) : (
                                          <RefreshCw
                                            size={25}
                                            className="text-black cursor-pointer"
                                            color={
                                              repeatCount[globalAyahIndex] > 1
                                                ? "#e5ce2c"
                                                : "black"
                                            }
                                            onClick={() => {
                                              // console.log(
                                              //   `📝 Repeating ayah at globalAyahIndex: ${globalAyahIndex}`
                                              // );
                                              onRepeat(globalAyahIndex);
                                            }}
                                          />
                                        )}
                                        <span
                                          className=" position-absolute text-black"
                                          style={{
                                            left: "59px",
                                            fontSize: "11px",
                                            top: "13px",
                                            display:
                                              repeatCount[globalAyahIndex] ===
                                              100
                                                ? "none"
                                                : "block",
                                          }}
                                        >
                                          {repeatCount[globalAyahIndex]}
                                        </span>
                                      </div>
                                      <Bookmark
                                        size={25}
                                        fill={
                                          tempBookmarkedIds.includes(
                                            ayah._id
                                          ) || isBookmarked(ayah._id)
                                            ? "#e5ce2c"
                                            : "#C8C8C8"
                                        }
                                        className="cursor-pointer text-black"
                                        onClick={() => {
                                          if (
                                            isBookmarked(ayah._id) &&
                                            !tempBookmarkedIds.includes(
                                              ayah._id
                                            )
                                          ) {
                                            deleteBookmark(ayah._id);
                                          } else {
                                            handleBookmarkClick(ayah);
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}

                                <span
                                  ref={(el) =>
                                    (ayahRefs.current[globalAyahIndex] = el)
                                  }
                                  className={`inline px-1 py-0.5

                                   ${
                                     playingAyahIndex?.index === globalAyahIndex
                                       ? "bg-[#6FCA9D] text-white"
                                       : ""
                                   } 
                                ${
                                  String(
                                    `${ayah.surahId?.index} : ${ayah.ayatIndex}`
                                  ) === String(highlightedVerse)
                                    ? "bg-[#6FCA9D] text-white"
                                    : ""
                                }  ${
                                    activeAyahId === ayah?._id
                                      ? "bg-[#6FCA9D]"
                                      : ""
                                  }`}
                                  onClick={() => handleAudioBox(ayah?._id)}
                                >
                                  <span
                                    className={` cursor-pointer ${
                                      scripts === "67ff8621845b885742c9fa48"
                                        ? "font-IndoPak"
                                        : scripts === englishScript
                                        ? ""
                                        : "font-UthmanicScript"
                                    }`}
                                    style={{
                                      paddingRight: "5px",
                                    }}
                                  >
                                    {textBasedOnScriptForAyat(
                                      ayah,
                                      scripts
                                    )?.replace(/—/g, " ")}
                                  </span>

                                  {/* Ayah Number with optional Ruku mark */}
                                  <span className="position-relative mx-2 font-UthmanicAyat text-center">
                                    {scripts === englishScript
                                      ? `(${ayah?.ayatIndex})`
                                      : toArabicNumber(ayah?.ayatIndex)}

                                    {ayah?.rukuEnd ? (
                                      <span
                                        className="position-absolute"
                                        style={{
                                          top:
                                            scripts === englishScript
                                              ? "-3px"
                                              : "-2px",
                                          left:
                                            scripts === englishScript
                                              ? "14px"
                                              : "10px",
                                          fontSize: "15px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        ع
                                      </span>
                                    ) : null}
                                  </span>

                                  {/* Hizb Markers */}
                                  {ayah._id === findArbah && (
                                    <span
                                      ref={(el) =>
                                        (hizbRefs.current[findArbah] = el)
                                      }
                                      className={`${
                                        ayah?.rukuEnd && ayah._id === findArbah
                                          ? "hizb-cont  hizb-cont-normal-right"
                                          : "hizb-cont hizb-cont-normal"
                                      }`}
                                    >
                                      الربع
                                    </span>
                                  )}
                                  {ayah._id === findNisf && (
                                    <span
                                      ref={(el) =>
                                        (hizbRefs.current[findNisf] = el)
                                      }
                                      className={`${
                                        ayah?.rukuEnd && ayah._id === findNisf
                                          ? "hizb-cont  hizb-cont-normal-right"
                                          : "hizb-cont hizb-cont-normal"
                                      }`}
                                    >
                                      النصف
                                    </span>
                                  )}
                                  {ayah._id === findSalasa && (
                                    <span
                                      ref={(el) =>
                                        (hizbRefs.current[findSalasa] = el)
                                      }
                                      className={`${
                                        ayah?.rukuEnd && ayah._id === findSalasa
                                          ? "hizb-cont  hizb-cont-normal-right"
                                          : "hizb-cont hizb-cont-normal"
                                      }`}
                                    >
                                      الثلاثة
                                    </span>
                                  )}
                                </span>

                                {/* Ruku Marker */}
                                {ayah?.rukuEnd ? (
                                  <span
                                    className="hizb-cont2"
                                    ref={(el) => {
                                      if (
                                        el &&
                                        ayah?.rukuEnd?.rukuNo !== undefined
                                      ) {
                                        rukuRef.current[ayah.rukuEnd.rukuNo] =
                                          el;
                                      }
                                    }}
                                  >
                                    <span
                                      style={{ transform: "rotate(-91deg)" }}
                                    >
                                      <span
                                        style={{
                                          position: "absolute",
                                          fontSize: "18px",
                                          left: "28%",
                                          top: 0,
                                        }}
                                      >
                                        {toArabicNumber(
                                          ayah.rukuEnd.rukuInSurah
                                        )}
                                      </span>
                                      <span
                                        style={{
                                          position: "absolute",
                                          fontSize: "18px",
                                          bottom: "19px",
                                          left: "17px",
                                        }}
                                      >
                                        {toArabicNumber(ayahsInRuku)}
                                      </span>
                                      <span
                                        style={{
                                          position: "absolute",
                                          fontSize: "18px",
                                          left: "15px",
                                          bottom: -4,
                                        }}
                                      >
                                        {toArabicNumber(rukuCounter)}
                                      </span>
                                      <span className="">ع</span>
                                    </span>
                                  </span>
                                ) : null}
                                {ayah?.sajdaNo && (
                                  <span
                                    ref={(el) =>
                                      (hizbRefs.current[findNisf] = el)
                                    }
                                    className={`${
                                      ayah?.rukuEnd && ayah._id === findNisf
                                        ? "hizb-cont  hizb-cont-normal-right"
                                        : "hizb-cont hizb-cont-normal"
                                    }`}
                                  >
                                    النصف
                                  </span>
                                )}
                                {ayah._id === findSalasa && (
                                  <span
                                    ref={(el) =>
                                      (hizbRefs.current[findSalasa] = el)
                                    }
                                    className={`${
                                      ayah?.rukuEnd && ayah._id === findSalasa
                                        ? "hizb-cont  hizb-cont-normal-right"
                                        : "hizb-cont hizb-cont-normal"
                                    }`}
                                  >
                                    الثلاثة
                                  </span>
                                )}

                                {/* {ayah?.rukuEnd ? (
                                <span
                                  className="hizb-cont2"
                                  ref={(el) => {
                                    if (
                                      el &&
                                      ayah?.rukuEnd?.rukuNo !== undefined
                                    ) {
                                      rukuRef.current[ayah.rukuEnd.rukuNo] = el;
                                    }
                                  }}
                                >
                                  <span style={{ transform: "rotate(-91deg)" }}>
                                    <span
                                      style={{
                                        position: "absolute",
                                        fontSize: "18px",
                                        left: "28%",
                                        top: 0,
                                      }}
                                    >
                                      {toArabicNumber(ayah.rukuEnd.rukuInSurah)}
                                    </span>
                                    <span
                                      style={{
                                        position: "absolute",
                                        fontSize: "18px",
                                        bottom: "19px",
                                        left: "17px",
                                      }}
                                    >
                                      {toArabicNumber(ayahsInRuku)}
                                    </span>
                                    <span
                                      style={{
                                        position: "absolute",
                                        fontSize: "18px",
                                        left: "15px",
                                        bottom: -4,
                                      }}
                                    >
                                      {toArabicNumber(rukuCounter)}
                                    </span>
                                    <span>ع</span>
                                  </span>
                                </span>
                              ) : null}
                              {ayah?.sajdaNo && (
                                <span
                                  className={`${
                                    (ayah?.rukuEnd && ayah?.sajdaNo) ||
                                    ayah._id === findArbah ||
                                    ayah._id === findNisf ||
                                    ayah._id === findSalasa
                                      ? "sajda  sajda-right"
                                      : "sajda"
                                  }`}
                                  style={{
                                    position: "absolute",
                                    fontSize: "20px",
                                    transform: "rotate(-90deg)",
                                    right: "-76px",
                                  }}
                                >
                                  سَجْدَة {toArabicNumber(ayah?.sajdaNo)}
                                </span>
                              )} */}
                              </span>
                            );
                          })}
                        </div>
                        {/* Ayats */}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          type !== "juzz" && (
            <div className="mt-2 flex gap-2 flex-wrap flex-row-reverse ml-auto">
              <div
                className="container text-center px-4 py-3 bg-white rounded-lg   relative"
                dir={scripts === "67fde5c131fdd14db9aa6836" ? "ltr" : "rtl"}
                style={{
                  lineHeight: "1.5",
                  fontSize: `${calculatedFontSize}px`,
                  whiteSpace: "normal", // allow normal wrapping
                  wordBreak: "break-word", // allow words to break naturally
                  overflowWrap: "break-word", // prevent overflow
                }}
              >
                <div className="w-full  flex flex-row-reverse justify-between">
                  {/* PLAY BUTTON LEFT */}
                  <div>
                    <Button
                      className="flex gap-2 px-4 py-2"
                      onClick={() => playingAudio()}
                      disabled={loader}
                    >
                      {isPlaying ? (
                        <Pause className="text-gray-400" size={18} />
                      ) : (
                        <Play className="text-gray-400" size={18} />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* BOOKMARK RIGHT */}
                    {profile && (
                      <Bookmark
                        size={25}
                        fill={isBookmarked2 ? "#e5ce2c" : "#C8C8C8"}
                        className="cursor-pointer"
                        onClick={handleBookMark}
                      />
                    )}

                    {/* HEART ICON */}
                    {profile ? (
                      profile?.memorizedSurahs?.includes(id) ? (
                        <Heart
                          size={25}
                          fill="#FF0000"
                          className="cursor-pointer"
                          onClick={() => handleModalOpen("unmemorized")}
                        />
                      ) : (
                        <Heart
                          size={25}
                          fill="#C8C8C8"
                          className="cursor-pointer"
                          onClick={() => handleModalOpen("memorized")}
                        />
                      )
                    ) : null}
                  </div>
                </div>

                {!checkSurah9 && (
                  <div
                    className={`w-full ${
                      scripts === "67fde5c131fdd14db9aa6836"
                        ? ""
                        : scripts === "67ff8621845b885742c9fa48"
                        ? "font-IndoPak "
                        : "font-UthmanicScript "
                    } ${
                      playingAyahIndex === "bismillah"
                        ? "highlighted-ayat p-0 "
                        : ""
                    }`}
                  >
                    <p>{textBasedOnScript(bismillah, scripts)}</p>
                  </div>
                )}

                {ayats?.map((ayah, index) => {
                  let ayahsInRuku = 0;

                  if (ayah.rukuEnd) {
                    const startAyatId = ayah?.rukuEnd?.startAyat;
                    const endAyatId = ayah?.rukuEnd?.endAyat;

                    const startIndex = ayats.findIndex(
                      (item) => item._id === startAyatId
                    );
                    const endIndex = ayats.findIndex(
                      (item) => item._id === endAyatId
                    );

                    if (
                      startIndex !== -1 &&
                      endIndex !== -1 &&
                      endIndex >= startIndex
                    ) {
                      const ayatsInRuku = ayats.slice(startIndex, endIndex + 1);
                      const ayahsInRukuCount = ayatsInRuku.length;
                      ayahsInRuku = ayahsInRukuCount;
                    } else {
                      console.log("Invalid start or end Ayat IDs.");
                      return 0;
                    }
                  }

                  return (
                    <div key={ayah._id} className="inline">
                      <span className="relative">
                        {activeAyahId === ayah._id && (
                          <div
                            className="cursor-pointer absolute end-0 flex items-center gap-2 justify-center bg-purple-200 rounded px-3 py-2"
                            style={{
                              transform: "translate(0, -50%)",
                              top: "-20px",
                            }}
                          >
                            {!toggleBtn ? (
                              <Play
                                className="text-white"
                                size={25}
                                onClick={() => {
                                  setToggleBtn(true);
                                  playingAudio(
                                    index + (bismillah?.audio ? 1 : 0)
                                  );
                                  setActiveAyahId(null);
                                }}
                              />
                            ) : (
                              <Pause
                                className="text-white"
                                size={25}
                                onClick={() => {
                                  setToggleBtn(false);
                                  playingAudio(
                                    index + (bismillah?.audio ? 1 : 0)
                                  );
                                }}
                              />
                            )}
                            <div className="flex items-center gap-1">
                              {repeatCount[playingAyahIndex] === 100 ? (
                                <Infinity
                                  color={
                                    repeatCount[playingAyahIndex] > 1
                                      ? "#e5ce2c"
                                      : "white"
                                  }
                                  className="cursor-pointer"
                                  onClick={() => onRepeat(playingAyahIndex)}
                                />
                              ) : (
                                <RefreshCw
                                  size={25}
                                  color={
                                    repeatCount[playingAyahIndex] > 1
                                      ? "#e5ce2c"
                                      : "white"
                                  }
                                  className="cursor-pointer"
                                  onClick={() => onRepeat(playingAyahIndex)}
                                />
                              )}
                              <div
                                className="absolute text-white"
                                style={{
                                  left: "59px",
                                  fontSize: "11px",
                                  top: "13px",
                                  display:
                                    repeatCount[playingAyahIndex] === 100
                                      ? "none"
                                      : "block",
                                }}
                              >
                                {repeatCount[playingAyahIndex]}
                              </div>
                            </div>
                            <Bookmark
                              size={25}
                              fill={
                                tempBookmarkedIds.includes(ayah._id) ||
                                isBookmarked(ayah._id)
                                  ? "#e5ce2c"
                                  : "#C8C8C8"
                              }
                              className="cursor-pointer text-white"
                              onClick={() => {
                                if (
                                  isBookmarked(ayah._id) &&
                                  !tempBookmarkedIds.includes(ayah._id)
                                ) {
                                  deleteBookmark(ayah._id);
                                } else {
                                  handleBookmarkClick(ayah);
                                }
                              }}
                            />
                          </div>
                        )}
                      </span>

                      <span
                        ref={(el) => (ayahRefs.current[index] = el)}
                        className={`${
                          playingAyahIndex === index ? "highlighted-ayat" : ""
                        } ${
                          String(ayah.ayatIndex) === String(highlightedVerse)
                            ? "bg-[#3DB47D] text-white"
                            : ""
                        } ${activeAyahId === ayah?._id ? "bg-purple-200" : ""}`}
                        onClick={() => handleAudioBox(ayah?._id)}
                        style={{
                          display: "inline",
                        }}
                      >
                        <span
                          dir="ltr"
                          className={`cursor-pointer ${
                            scripts === "67fde5c131fdd14db9aa6836"
                              ? ""
                              : scripts === "67ff8621845b885742c9fa48"
                              ? "font-IndoPak"
                              : "font-UthmanicScript"
                          }`}
                        >
                          {textBasedOnScriptForAyat(ayah, scripts)
                            ?.replace("\\n", " ")
                            ?.replace(/—/g, " ")}
                        </span>
                        <span className="relative mx-2 font-UthmanicAyat">
                          {scripts === "67fde5c131fdd14db9aa6836"
                            ? `(${ayah?.ayatIndex})`
                            : toArabicNumber(ayah?.ayatIndex)}
                          <span
                            className="absolute"
                            style={{
                              top: -2,
                              left: 10,
                              fontSize: "15px",
                              fontWeight: "bold",
                            }}
                          >
                            {ayah?.rukuEnd?.rukuNo && " ع "}
                          </span>
                        </span>

                        {ayah?.rukuEnd?.rukuNo && (
                          <span
                            className="hizb-cont2 absolute "
                            style={{
                              right:
                                window.innerWidth >= 1024 ? "-36px" : "0px",
                            }}
                            ref={(el) => {
                              if (el && ayah?.rukuEnd?.rukuNo !== undefined) {
                                rukuRef.current[ayah.rukuEnd.rukuNo] = el;
                              }
                            }}
                          >
                            <span style={{ transform: "rotate(-91deg)" }}>
                              <span
                                style={{
                                  position: "absolute",
                                  fontSize: "18px",
                                  left: "28%",
                                  top: 0,
                                }}
                              >
                                {ayah?.rukuEnd?.rukuNo &&
                                  toArabicNumber(ayah?.rukuEnd?.rukuInSurah)}
                              </span>
                              <span
                                style={{
                                  position: "absolute",
                                  fontSize: "18px",
                                  bottom: "19px",
                                  left: "17px",
                                }}
                              >
                                {ayah?.rukuEnd?.rukuNo &&
                                  toArabicNumber(ayahsInRuku)}
                              </span>
                              <span>{ayah?.rukuEnd?.rukuNo && " ع "}</span>
                            </span>
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default ArabicTabContent;
