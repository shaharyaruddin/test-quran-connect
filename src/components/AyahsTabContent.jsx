import { useEffect, useRef, useState } from "react";
import {
  textBasedOnLanguage,
  textBasedOnScript,
  textBasedOnScriptForAyat,
  toArabicNumber,
} from "../utils/helper";
import ArabicAyahsCard from "./ArabicAyahsCard";
import { useDispatch, useSelector } from "react-redux";
import { addBookMarkAyat, getAllBookMark } from "@/reducers/apiSlice";
import AyatsLoader from "./AyatsLoader";

const AyahsTabContent = ({
  ayats,
  bismillah,
  language,
  scripts,
  fontSize,
  playingAyahIndex,
  playingAudio,
  currentVerse,
  type,
  id,
  setRepeatCount,
  repeatCount,
  onRepeat,
  hizb,
  currentRuku,
  loader,
  currentJuzzDetail,
}) => {
  const dispatch = useDispatch();
  const [scrollTrigger, setScrollTrigger] = useState(null);
  const [highlightedVerse, setHighlightedVerse] = useState(null); // New state for temporary highlight
  const ayahRefs = useRef([]);
  const surahs = useSelector((state) => state.api.surahs);
  const juzzList = useSelector((state) => state.api.juzz);

  const [tempBookmarkedIds, setTempBookmarkedIds] = useState([]);
  const [selectedAyats, setSelectedAyats] = useState([]);
  const timeoutRef = useRef(null);
  const selectedAyatsRef = useRef([]);
  const hizbRefs = useRef({}); // Refs for Hizb markers
  const rukuRef = useRef({});

  //Find Hizb
  const findCurrentJuzz = juzzList?.find((item) => item?._id === id);
  const findArbah = findCurrentJuzz?.hisb?.arbah;
  const findNisf = findCurrentJuzz?.hisb?.nisf;
  const findSalasa = findCurrentJuzz?.hisb?.salasa;

  const currentScript = scripts === "67fde59231fdd14db9aa6834";

  const hizbMap = {
    arbah: findArbah,
    nisf: findNisf,
    salasa: findSalasa,
  };
  const hizbId = hizbMap[hizb] || null;

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
      }
    }
  }, [scrollTrigger, ayats, findArbah, findNisf, findSalasa]);

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

  const englishScript = "67fde5c131fdd14db9aa6836";

  useEffect(() => {
    ayahRefs.current = Array(ayats?.length).fill(null);
  }, [ayats]);

  // Trigger scroll and temporary highlight when currentVerse changes
  useEffect(() => {
    if (currentVerse) {
      setScrollTrigger(currentVerse);
      setHighlightedVerse(currentVerse); // Set the verse to be highlighted

      // Remove highlight after 4 seconds
      const timer = setTimeout(() => {
        setHighlightedVerse(null);
      }, 3000);

      // Cleanup timer on unmount or if currentVerse changes again
      return () => clearTimeout(timer);
    }
  }, [currentVerse]);

  // Perform scroll when scrollTrigger updates
  useEffect(() => {
    if (scrollTrigger && ayahRefs.current.length === ayats.length) {
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
  }, [scrollTrigger, ayats]);
  useEffect(() => {
    if (playingAyahIndex !== null && ayahRefs.current[playingAyahIndex]) {
      ayahRefs.current[playingAyahIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [playingAyahIndex]);

  const findCurrentSurah = surahs?.find((item) => item?._id === id);
  const checkSurah9 = findCurrentSurah?.index === 9;

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

    console.log(
      "📌 Selected Ayat Indexes (Sorted):",
      sorted.map((a) => a.ayatIndex)
    );
    console.log("✅ Are Ayats Sequential?", isSequential);

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
    // setTempBookmarkedIds([]);
  };

  const bismillahRefs = useRef({}); // Separate ref for Bismillah per Surah

  // Scrolling logic
  useEffect(() => {
    if (!playingAyahIndex) return;

    const { surahId, index } = playingAyahIndex;
    if (index === -1) {
      // Scroll to Bismillah
      const bismillahElement = bismillahRefs.current[surahId];
      if (bismillahElement) {
        bismillahElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        console.log(`📜 Scrolling to Bismillah for Surah ${surahId}`);
      } else {
        console.warn(`⚠️ Bismillah ref for Surah ${surahId} is undefined`);
      }
    } else {
      // Scroll to ayah
      const ayahElement = ayahRefs.current[index];
      if (ayahElement) {
        ayahElement.scrollIntoView({ behavior: "smooth", block: "center" });
        console.log(
          `📜 Scrolling to Ayah at index ${index} for Surah ${surahId}`
        );
      } else {
        console.warn(`⚠️ Ayah ref at index ${index} is undefined`);
      }
    }
  }, [playingAyahIndex]);

  //fontSize
  const minFontSize = 10; // Minimum font size in pixels
  const maxFontSize = 50; // Maximum font size in pixels
  const sizeAdjustment = 5; // Add 5px to make it bigger

  let calculatedFontSize =
    minFontSize +
    (maxFontSize - minFontSize) * (fontSize / 100) +
    sizeAdjustment;
  const translationFontSize = calculatedFontSize / 2;

  console.log("check curent script", scripts);
  console.log("check ayats", ayats);
  console.log("curent juzzzzzzzzzzzzz", currentJuzzDetail);

  useEffect(() => {
    if (ayats) {
    }
  });

  const filteredAyats = currentScript
    ? ayats?.filter((ayah) => {
        const chapterIndex = ayah?.surahId?.index;
        const ayahIndex = ayah?.ayatIndex;

        return (
          chapterIndex >= currentJuzzDetail?.startingChapterUsmani &&
          chapterIndex <= currentJuzzDetail?.endingChapterUsmani &&
          ((chapterIndex === currentJuzzDetail?.startingChapterUsmani &&
            ayahIndex >= currentJuzzDetail?.startingAyatUsmani) ||
            (chapterIndex === currentJuzzDetail?.endingChapterUsmani &&
              ayahIndex <= currentJuzzDetail?.endingAyatUsmani) ||
            (chapterIndex > currentJuzzDetail?.startingChapterUsmani &&
              chapterIndex < currentJuzzDetail?.endingChapterUsmani))
        );
      })
    : ayats;

  return (
    <>
      {loader ? (
        <AyatsLoader />
      ) : type === "juzz" ? (
        // [...new Set(ayats?.map((option) => option?.surahId?._id))]?.map(
        //   (surahId) => {
        //     const findSpecificSurah = surahs?.find(
        //       (item) => item?._id === surahId
        //     );
        [...new Set(filteredAyats?.map((a) => a?.surahId?._id))]?.map(
          (surahId) => {
            const findSpecificSurah = surahs?.find(
              (item) => item?._id === surahId
            );
            const surahAyats = filteredAyats?.filter(
              (a) => a?.surahId?._id === surahId
            );
            return (
              <>
                <div className="flex  justify-between items-center px-4">
                  <h2 className="font-size-16  text-purple-outline mt-4">
                    {findSpecificSurah?.index}-{findSpecificSurah?.name}
                  </h2>
                  <h2 className="font-size-16  text-purple-outline mt-4">
                    {toArabicNumber(findSpecificSurah?.index)} -{" "}
                    {findSpecificSurah?.arabicName}
                  </h2>
                </div>

                <div
                  className="p-3 flex  flex-wrap flex-row-reverse  gap-2 sm:flex-row sm:gap-3"
                  style={{ marginTop: "-12px" }}
                >
                  {/* //Bismillah Logic */}
                  {ayats?.filter(
                    (option) => option?.surahId?._id === surahId
                  )[0]?.ayatIndex === 1 &&
                    findSpecificSurah?.index !== 9 && (
                      <div className="flex grow w-full">
                        {ayats?.filter(
                          (option) => option?.surahId?._id === surahId
                        )[0]?.ayatIndex === 1 &&
                          findSpecificSurah?.index !== 9 && (
                            <div className="flex justify-center items-center bg-white rounded-md w-full my-3 px-2 sm:px-6 text-center">
                              <ArabicAyahsCard
                                ref={(el) =>
                                  (bismillahRefs.current[surahId] = el)
                                }
                                BismillahTextArabic={textBasedOnScript(
                                  bismillah,
                                  scripts
                                )}
                                BismillahTextEnglish={textBasedOnLanguage(
                                  bismillah,
                                  language
                                )}
                                isPlaying={
                                  playingAyahIndex?.surahId === surahId &&
                                  playingAyahIndex?.index === -1
                                }
                                onPlay={() => {
                                  let startIndex = 0;
                                  for (let i = 0; i < ayats.length; i++) {
                                    if (ayats[i].surahId._id === surahId) break;
                                    if (
                                      i === 0 ||
                                      ayats[i].surahId._id !==
                                        ayats[i - 1].surahId._id
                                    ) {
                                      const surah = surahs.find(
                                        (s) => s._id === ayats[i].surahId._id
                                      );
                                      if (surah?.index !== 9) startIndex++;
                                    }
                                    startIndex++;
                                  }
                                  console.log(
                                    `📍 Bismillah startIndex for Surah ${surahId}:`,
                                    startIndex
                                  );
                                  playingAudio(startIndex);
                                }}
                                fontSize={fontSize}
                                script={scripts}
                                setRepeatCount={setRepeatCount}
                                repeatCount={repeatCount[surahId]} // Use surahId as key
                                onRepeat={() => onRepeat(surahId)} // Pass surahId
                              />
                            </div>
                          )}
                      </div>
                    )}

                  <div className="flex flex-col sm:flex-row-reverse flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
                    {surahAyats.map((ayah, index) => {
                      if (ayah?.surahId?._id !== surahId) return null;
                      return (
                        <div key={ayah._id} className="grow">
                          <ArabicAyahsCard
                            ref={(el) => (ayahRefs.current[index] = el)}
                            key={index}
                            ayahText={textBasedOnScriptForAyat(
                              ayah,
                              scripts
                            )?.replace(/—/g, " ")}
                            ayahNumber={toArabicNumber(ayah?.ayatIndex)}
                            ayahEnglish={textBasedOnLanguage(ayah, language)}
                            isPlaying={
                              playingAyahIndex?.surahId === surahId &&
                              playingAyahIndex?.index === index
                            }
                            onPlay={() => {
                              let startIndex = 0;
                              for (let i = 0; i <= index; i++) {
                                if (
                                  i === 0 ||
                                  ayats[i].surahId._id !==
                                    ayats[i - 1].surahId._id
                                ) {
                                  const surah = surahs.find(
                                    (s) => s._id === ayats[i].surahId._id
                                  );
                                  if (surah?.index !== 9) startIndex++;
                                }
                                startIndex++;
                              }
                              console.log(
                                `📍 Ayah startIndex for index ${index} (Surah ${surahId}, Ayat ${ayah.ayatIndex}):`,
                                startIndex - 1
                              );
                              playingAudio(startIndex - 1);
                            }}
                            fontSize={fontSize}
                            script={scripts}
                            isSelected={
                              String(
                                `${ayah.surahId?.index} : ${ayah.ayatIndex}`
                              ) === String(highlightedVerse)
                            }
                            onBookmark={() => handleBookmarkClick(ayah)}
                            tempBookmarkedIds={tempBookmarkedIds}
                            ayatId={ayah._id}
                            index={index}
                            setRepeatCount={setRepeatCount}
                            repeatCount={repeatCount[index]}
                            onRepeat={() => onRepeat(index)}
                            setTempBookmarkedIds={setTempBookmarkedIds}
                          />

                          {ayah._id === findArbah && (
                            <div
                              ref={(el) => (hizbRefs.current[findArbah] = el)}
                              style={{ height: "0px", width: "100%" }}
                            />
                          )}

                          {ayah._id === findNisf && (
                            <div
                              ref={(el) => (hizbRefs.current[findNisf] = el)}
                              style={{ height: "0px", width: "100%" }}
                            />
                          )}

                          {ayah._id === findSalasa && (
                            <div
                              ref={(el) => (hizbRefs.current[findSalasa] = el)}
                              style={{ height: "0px", width: "100%" }}
                            />
                          )}

                          {ayah?.rukuEnd ? (
                            <span
                              ref={(el) => {
                                if (el && ayah?.rukuEnd?.rukuNo !== undefined) {
                                  rukuRef.current[ayah.rukuEnd.rukuNo] = el;
                                }
                              }}
                              style={{
                                gap: 0,
                                height: "0px",
                                width: "100%",
                                display: "block",
                              }}
                            />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          }
        )
      ) : (
        // <div
        //   dir={scripts === englishScript ? "rtl" : ""}
        //   className="mt-2 flex flex-col gap-2"
        // >
        //   <div
        //     className="container text-center px-4 py-3 bg-white rounded-2 relative"
        //     dir={scripts === "67fde5c131fdd14db9aa6836" ? "ltr" : "rtl"}
        //     style={{
        //       lineHeight: "1.5",
        //       fontSize: `${calculatedFontSize}px`,
        //       whiteSpace: "normal", // allow normal wrapping
        //       wordBreak: "break-word", // allow words to break naturally
        //       overflowWrap: "break-word", // prevent overflow
        //     }}
        //   >
        //     {!checkSurah9 && (
        //       <div className="w-full">
        //         <ArabicAyahsCard
        //           BismillahTextArabic={textBasedOnScript(bismillah, scripts)}
        //           BismillahTextEnglish={textBasedOnLanguage(
        //             bismillah,
        //             language
        //           )}
        //           isPlaying={playingAyahIndex === -1}
        //           onPlay={() => playingAudio(0)} // Play from Bismillah
        //           fontSize={calculatedFontSize + 4}
        //           script={scripts}
        //           setRepeatCount={setRepeatCount}
        //           repeatCount={repeatCount[-1]}
        //           onRepeat={() => onRepeat(-1)}
        //         />
        //       </div>
        //     )}

        //     {ayats?.map((ayah, index) => (
        //       <div key={ayah._id} className="w-full ">
        //         <ArabicAyahsCard
        //           ref={(el) => (ayahRefs.current[index] = el)}
        //           ayahText={textBasedOnScriptForAyat(ayah, scripts)
        //             ?.replace("\\n", " ")
        //             ?.replace(/—/g, " ")}
        //           ayahNumber={
        //             scripts === englishScript
        //               ? `(${ayah?.ayatIndex})`
        //               : toArabicNumber(ayah?.ayatIndex)
        //           }
        //           ayahEnglish={textBasedOnLanguage(ayah, language)}
        //           isPlaying={playingAyahIndex === index}
        //           onPlay={playingAudio}
        //           fontSize={calculatedFontSize + 4}
        //           script={scripts}
        //           isSelected={
        //             String(ayah.ayatIndex) === String(highlightedVerse)
        //           }
        //           onBookmark={() => handleBookmarkClick(ayah)}
        //           tempBookmarkedIds={tempBookmarkedIds}
        //           ayatId={ayah._id}
        //           currentAyah={ayah}
        //           index={index}
        //           setRepeatCount={setRepeatCount}
        //           repeatCount={repeatCount[index]}
        //           onRepeat={() => onRepeat(index)}
        //         />
        //       </div>
        //     ))}
        //   </div>
        // </div>
        <div
          dir={scripts === englishScript ? "rtl" : ""}
          className="mt-2 flex flex-col gap-2"
        >
          <div
            className="container text-center py-3 rounded-2 relative"
            dir={scripts === "67fde5c131fdd14db9aa6836" ? "ltr" : "rtl"}
            style={{
              lineHeight: "1.5",
              fontSize: `${calculatedFontSize}px`,
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {/* Bismillah Row (Always Single Row) */}
            {!checkSurah9 && (
              <div className="w-full bg-white mb-2">
                <ArabicAyahsCard
                  BismillahTextArabic={textBasedOnScript(bismillah, scripts)}
                  BismillahTextEnglish={textBasedOnLanguage(
                    bismillah,
                    language
                  )}
                  isPlaying={playingAyahIndex === -1}
                  onPlay={() => playingAudio(0)}
                  fontSize={calculatedFontSize + 4}
                  script={scripts}
                  setRepeatCount={setRepeatCount}
                  repeatCount={repeatCount[-1]}
                  onRepeat={() => onRepeat(-1)}
                />
              </div>
            )}

            {/* Ayats Flex-Wrap Layout */}
            <div className="flex flex-wrap gap-2 justify-center w-full">
              {ayats?.map((ayah, index) => (
                <div key={ayah._id} className="grow">
                  <ArabicAyahsCard
                    ref={(el) => (ayahRefs.current[index] = el)}
                    ayahText={textBasedOnScriptForAyat(ayah, scripts)
                      ?.replace("\\n", " ")
                      ?.replace(/—/g, " ")}
                    ayahNumber={
                      scripts === englishScript
                        ? `(${ayah?.ayatIndex})`
                        : toArabicNumber(ayah?.ayatIndex)
                    }
                    ayahEnglish={textBasedOnLanguage(ayah, language)}
                    isPlaying={playingAyahIndex === index}
                    onPlay={playingAudio}
                    fontSize={calculatedFontSize + 4}
                    script={scripts}
                    isSelected={
                      String(ayah.ayatIndex) === String(highlightedVerse)
                    }
                    onBookmark={() => handleBookmarkClick(ayah)}
                    tempBookmarkedIds={tempBookmarkedIds}
                    ayatId={ayah._id}
                    currentAyah={ayah}
                    index={index}
                    setRepeatCount={setRepeatCount}
                    repeatCount={repeatCount[index]}
                    onRepeat={() => onRepeat(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AyahsTabContent;
