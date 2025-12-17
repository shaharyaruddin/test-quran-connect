import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import InputSelect from "@/components/InputSelect";
import InputRange from "@/components/InputRange";
import TabButton from "@/components/TabButton";
import TabPane from "@/components/TabPane";
import ArabicTabContent from "@/components/ArabicTabContent";
import AyahsTabContent from "@/components/AyahsTabContent";
import WordsTabContent from "@/components/WordsTabContent";
import { useRouter } from "next/router";
import PageWrapper from "@/components/PageWrapper";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllJuzz,
  getAllReciter,
  getChaptersRunningTranslation,
  getJuzzByAyat,
  getProfile,
  getWordsByJuzz,
  getWordsBySurah,
  memorizeJuzz,
  unMemorizeJuzz,
} from "@/reducers/apiSlice";
import Cookies from "js-cookie";
import AyatsLoader from "@/components/AyatsLoader";
import Button from "@/components/Button";
import {
  ArrowUp,
  Bookmark,
  Heart,
  Pause,
  Play,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { toArabicNumber } from "../../utils/helper";
import { useTranslation } from "react-i18next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { parse } from "cookie";
import Modal from "@/components/Modal";
import MemorizedModal from "@/components/MemorizedModal";
import Header from "@/components/Header";
import MainContainer from "@/components/MainContainer";
import DetailSidebarJuz from "@/components/detail/DetailSidebarJuz";
import DetailHeader from "@/components/detail/DetailHeader";
import ArabicViewSkeleton from "@/components/ArabicViewSkeleton";
import WordsSkeleton from "@/components/WordsSkeleton";
import AyahCardSkeleton from "@/components/AyahCardSkeleton";
import InputRangeNew from "@/components/InputRange2";
import nextI18nextConfig from "../../../next-i18next.config";

// export async function getServerSideProps({ req }) {
//   const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
//   const lang = cookies.language || "en";

//   return {
//     props: {
//       ...(await serverSideTranslations(lang, ["common"])),
//     },
//   };
// }

export const config = {
  runtime: "nodejs",
};

export async function getServerSideProps({ req }) {
  const cookies = req?.headers?.cookie ? parse(req.headers.cookie) : {};
  const lang = cookies.language || "en";

  return {
    props: {
      ...(await serverSideTranslations(lang, ["common"], nextI18nextConfig)),
    },
  };
}

const JuzzDetail = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const { surah, juzzNo } = router.query;
  const [juzz, setJuzz] = useState([]);
  const profile = useSelector((state) => state.api.user);
  const [ayats, setAyats] = useState([]);
  const [language, setLanguage] = useState("en");
  const [script, setScript] = useState("67fde59231fdd14db9aa6834");
  const [surahName, setSurahName] = useState("");
  const [juzzName, setJuzzName] = useState("");
  const [currentVerse, setCurrentVerse] = useState("");
  const [hizb, setHizb] = useState("");
  const [loader, setLoader] = useState(true);
  const [loader2, setLoader2] = useState(true);
  const [allWords, setAllWords] = useState([]);
  const [recitor, setRecitor] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false); // Track if audio is playing
  const [playingAyahIndex, setPlayingAyahIndex] = useState(null); // Track current Ayah
  const [fontSize, setFontSize] = useState(50);
  const [runningTranslation, setRunningTranslation] = useState("");
  const [volume, setVolume] = useState(true);
  const [translationVolume, setTranslationVolume] = useState(true);
  const [ayatsLoaded, setayatsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("Arabic"); // Default tab
  const [modalType, setModalType] = useState("");
  const [languageIds, setLanguageId] = useState("");
  const [visible, setVisible] = useState(false);
  const [lines, setLines] = useState("normal");
  const [currentRuku, setCurrentRuku] = useState("");
  const [juzzNumber, setJuzzNumber] = useState("");
  const [currentTab, setCurrentTab] = useState("arabic");

  const [scriptName, setScriptName] = useState([]);
  const [currentRecitor, setCurrentRecitor] = useState(
    "680737820cb06ed90cfe8d4f"
  );
  const [juzzDetail, setJuzzDetail] = useState("");
  const bismillah = useSelector((state) => state.api.bismillah);
  const translation = useSelector((state) => state.api.translation);
  const surahs = useSelector((state) => state.api.surahs);
  const getScripts = useSelector((state) => state.api.scripts);
  const juzzList = useSelector((state) => state.api.juzz);

  const findJuzz = juzzList?.find((item) => item?._id === juzzName);
  // const juzzNumber = findJuzz?.index;

  useEffect(() => {
    const getFontSize = Cookies.get("fontSize");
    if (getFontSize) {
      setFontSize(getFontSize);
    }
  }, []);

  const handleFontSizeChange = (e) => {
    const sliderValue = Number(e.target.value);
    setFontSize(sliderValue);
    Cookies.set("fontSize", sliderValue);
  };

  // Playing Audio
  const currentAudioRef = useRef(null); // Persist audio instance across renders

  const textBasedOnLanguage = (data, lang) => {
    const languageTranslation = data?.translations?.find(
      (item) => item.language?.code === lang
    );
    return languageTranslation?.text;
  };

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setPlayingAyahIndex(null);
  };

  useEffect(() => {
    if (!volume) {
      stopAudio(); // Stop audio immediately if volume is turned off
    }
  }, [volume]);

  const [repeatCount, setRepeatCount] = useState({}); // e.g., { 0: 1, 1: 3, 2: 2 }
  const repeatCountsRef = useRef(repeatCount); // Ref to track latest repeatCounts

  useEffect(() => {
    repeatCountsRef.current = repeatCount;
    console.log("🔄 repeatCountsRef updated to:", repeatCount);
  }, [repeatCount]);

  const handleAyahRepeat = (ayahIndex) => {
    setRepeatCount((prev) => {
      const currentCount = prev[ayahIndex] || 1;
      // Cycle through [3, 5, 7, 1]
      let newCount;
      if (currentCount === 1) newCount = 3;
      else if (currentCount === 3) newCount = 5;
      else if (currentCount === 5) newCount = 7;
      else if (currentCount === 7) newCount = 100;
      else newCount; // Reset to 1 after 100
      console.log(
        `🔄 Repeat count for ayah ${ayahIndex} updated to: ${newCount}`
      );
      return { ...prev, [ayahIndex]: newCount };
    });
  };

  const playArabicAyats = (startIndex = 0) => {
    if (!volume || !currentRecitor) {
      console.warn("⚠️ No volume or reciter selected");
      return;
    }

    if (isPlaying) {
      console.log("⏹️ Stopping current audio");
      stopAudio();
      return;
    }

    const arabicAudioData = [];
    let currentSurahId = null;

    ayats.forEach((ayat, index) => {
      const surahId = ayat?.surahId?._id;

      // if (bismillah?.audio) {
      // if (ayat?.surahId?.index !== 9 && surahId !== currentSurahId) {
      if (
        bismillah?.audio &&
        surahId !== currentSurahId &&
        ayat?.ayatIndex === 1 &&
        ayat?.surahId?.index !== 9
      ) {
        arabicAudioData.push({
          type: "bismillah",
          audio: bismillah.audio,
          surahId,
          ayatIndex: -1,
        });
      }
      currentSurahId = surahId;
      // }

      const audioObj = ayat?.audios?.find(
        (audio) => audio.reciterId === currentRecitor
      );
      if (audioObj?.audioFile) {
        arabicAudioData.push({
          type: "ayat",
          audio: audioObj.audioFile,
          index,
          surahId,
          ayatIndex: index,
        });
      }
    });

    if (arabicAudioData.length === 0) {
      console.warn("⚠️ No audio data available");
      return;
    }

    let currentIndex = 0;
    if (startIndex > 0 && startIndex < ayats.length) {
      // Play specific ayah directly when selected
      currentIndex = arabicAudioData.findIndex(
        (data) => data.type === "ayat" && data.index === startIndex
      );
      if (currentIndex === -1) {
        console.warn("⚠️ Could not find ayah at index:", startIndex);
        currentIndex = 0; // Fallback to start
      }
    } else if (startIndex === 0 && arabicAudioData[0]?.type === "bismillah") {
      // Start with bismillah if available and not Surah 9
      currentIndex = 0;
    } else {
      // Fallback to first ayah if no bismillah or invalid startIndex
      currentIndex =
        arabicAudioData.findIndex((data) => data.type === "ayat") || 0;
    }

    let currentRepeat = 1;

    const playNextAyah = () => {
      if (currentIndex >= arabicAudioData.length || !volume) {
        console.log("✅ Finished all ayahs");
        setIsPlaying(false);
        setPlayingAyahIndex(null);
        return;
      }

      const currentAudioData = arabicAudioData[currentIndex];
      const playingAyahIndex = {
        surahId: currentAudioData.surahId,
        index: currentAudioData.ayatIndex,
      };
      console.log("📍 Setting playingAyahIndex:", playingAyahIndex);
      setPlayingAyahIndex(playingAyahIndex);

      const audio = new Audio(currentAudioData.audio);
      currentAudioRef.current = audio;
      setIsPlaying(true);

      audio
        .play()
        .then(() => {
          console.log(
            `🔊 Playing ${currentAudioData.type}:`,
            currentAudioData.audio
          );
        })
        .catch((err) => {
          console.error("❌ Play error:", err);
          handleRepeatOrNext();
        });

      audio.onended = () => {
        handleRepeatOrNext();
      };

      audio.onerror = (err) => {
        console.error("❌ Audio error:", err);
        handleRepeatOrNext();
      };
    };

    const handleRepeatOrNext = () => {
      const currentAudioData = arabicAudioData[currentIndex];
      const key =
        currentAudioData.type === "bismillah"
          ? currentAudioData.surahId
          : currentAudioData.index;
      const repeatCountForCurrent = repeatCountsRef.current[key] || 1;
      console.log(
        `🔄 Repeat count for ${currentAudioData.type} (key: ${key}): ${repeatCountForCurrent}`
      );

      if (currentRepeat < repeatCountForCurrent) {
        currentRepeat++;
        console.log(
          `🔁 Repeating ${currentAudioData.type} (${currentRepeat}/${repeatCountForCurrent})`
        );
        playNextAyah();
      } else {
        currentRepeat = 1;
        currentIndex++;
        console.log(`➡️ Moving to next: ${currentIndex}`);
        playNextAyah();
      }
    };

    playNextAyah();
  };

  useEffect(() => {
    if (!volume) {
      stopAudio(); //  Stop Arabic if volume is OFF during playback
    }
  }, [volume]);

  useEffect(() => {
    if (!translationVolume) {
      window.speechSynthesis.cancel(); // Stop translation if translationVolume is OFF
    }
  }, [translationVolume]);

  // Stop translation immediately when translationVolume changes
  const playArabicWithTranslationAyats = (startIndex = 0) => {
    console.log(
      "▶️ playArabicWithTranslationAyats called with startIndex:",
      startIndex
    );

    if (isPlaying) {
      console.log("⏹️ Stopping current audio first...");
      stopAudio();
      return;
    }

    if (!bismillah && ayats.length === 0) {
      console.warn("⚠️ No ayats or Bismillah found");
      return;
    }

    // Group ayats by surahId
    const groupedAyats = ayats.reduce((acc, ayat) => {
      const surahId = ayat.surahId._id;
      if (!acc[surahId]) {
        acc[surahId] = [];
      }
      acc[surahId].push(ayat);
      return acc;
    }, {});

    // Create audio data with Bismillah for each Surah
    const allAudioData = Object.keys(groupedAyats)
      .reduce((acc, surahId) => {
        const surahAyats = groupedAyats[surahId];
        const surahData = [
          ...(surahs.find((s) => s._id === surahId)?.index !== 9
            ? [
                {
                  arabicAudio: bismillah?.audio,
                  translationText: textBasedOnLanguage(bismillah, language),
                  isBismillah: true,
                  surahId,
                },
              ]
            : []),
          ...surahAyats.map((ayat) => ({
            arabicAudio: ayat?.audios?.find(
              (audio) => audio.reciterId === currentRecitor
            )?.audioFile,
            translationText: textBasedOnLanguage(ayat, language),
            isBismillah: false,
            surahId,
            ayatIndex: ayat.ayatIndex,
          })),
        ];
        return [...acc, ...surahData];
      }, [])
      .filter((item) => item.arabicAudio || item.translationText);

    console.log("🧾 All audio + translation data:", allAudioData);

    let currentIndex = startIndex;
    let currentRepeat = 1;

    const playNextAyah = () => {
      if (currentIndex >= allAudioData.length) {
        console.log("✅ Finished all ayahs with translation");
        setIsPlaying(false);
        setPlayingAyahIndex(null);
        return;
      }

      const { arabicAudio, translationText, isBismillah, surahId, ayatIndex } =
        allAudioData[currentIndex];
      console.log(`🎧 Playing index ${currentIndex}`, {
        arabicAudio,
        translationText,
        isBismillah,
        surahId,
        ayatIndex,
      });

      const ayahIndexInAyats = isBismillah
        ? -1
        : ayats.findIndex(
            (ayat) =>
              ayat.ayatIndex === ayatIndex && ayat.surahId._id === surahId
          );
      const playingAyahIndex = { surahId, index: ayahIndexInAyats };
      console.log("📍 Setting playingAyahIndex:", playingAyahIndex);
      setPlayingAyahIndex(playingAyahIndex);

      if (volume && arabicAudio) {
        const audio = new Audio(arabicAudio);
        currentAudioRef.current = audio;
        setIsPlaying(true);

        audio
          .play()
          .then(() => {
            console.log("🔊 Arabic audio started:", arabicAudio);
          })
          .catch((err) => {
            console.error("❌ Arabic audio play error:", err);
            currentRepeat = 1;
            currentIndex++;
            playNextAyah();
          });

        audio.onended = () => {
          if (translationVolume && translationText) {
            playTranslation(translationText);
          } else {
            handleRepeatOrNext();
          }
        };

        audio.onerror = (err) => {
          console.error("❌ Arabic audio error:", err);
          handleRepeatOrNext();
        };
      } else if (translationVolume && translationText) {
        console.log("🔁 No Arabic, playing translation only...");
        setIsPlaying(true);
        playTranslation(translationText);
      } else {
        console.warn("⚠️ Skipping ayah: No audio or translation");
        handleRepeatOrNext();
      }
    };

    const playTranslation = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;

      utterance.onend = () => {
        console.log("🗣️ Translation finished:", text);
        handleRepeatOrNext();
      };

      utterance.onerror = (err) => {
        console.error("❌ Translation speech error:", err);
        handleRepeatOrNext();
      };

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    };

    const handleRepeatOrNext = () => {
      // Use surahId for Bismillah, ayahIndexInAyats for ayahs
      const repeatCountForCurrent = allAudioData[currentIndex].isBismillah
        ? repeatCountsRef.current[allAudioData[currentIndex].surahId] || 1
        : repeatCountsRef.current[
            ayats.findIndex(
              (ayat) =>
                ayat.ayatIndex === allAudioData[currentIndex].ayatIndex &&
                ayat.surahId._id === allAudioData[currentIndex].surahId
            )
          ] || 1;
      console.log(`🔄 Repeat count for current: ${repeatCountForCurrent}`);
      if (currentRepeat < repeatCountForCurrent) {
        currentRepeat++;
        console.log(
          `🔁 Repeating current ${
            allAudioData[currentIndex].isBismillah ? "Bismillah" : "ayah"
          } (${currentRepeat}/${repeatCountForCurrent})`
        );
        playNextAyah();
      } else {
        currentRepeat = 1;
        currentIndex++;
        console.log(`➡️ Moving to next: ${currentIndex}`);
        playNextAyah();
      }
    };

    playNextAyah();
  };

  useEffect(() => {
    if (!translationVolume) {
      window.speechSynthesis.cancel(); //  Stop translation instantly when toggled OFF
    }

    if (isPlaying) {
      stopAudio();
      playArabicWithTranslationAyats();
    }
  }, [volume, translationVolume]); //

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  useEffect(() => {
    stopAudio(); // ✅ Stops both Arabic & translation audio when language changes
  }, [language]);

  const RukuOptions = [
    { label: "115", value: "115" },
    { label: "116", value: "116" },
    { label: "117", value: "117" },
    { label: "118", value: "118" },
  ];

  const HizbOptions = [
    { label: "Select Hizb" },
    { label: "الربع", value: "arbah" },
    { label: "النصف", value: "nisf" },
    { label: "الثلاثة", value: "salasa" },
  ];

  const LinesOptions = [
    { label: "Normal Quran", value: "normal" },
    { label: "15 Lines Quran", value: "15" },
  ];

  useEffect(() => {
    if (ayats.length === 0) {
      setLoader(true);
    }
  }, [loader]);

  console.log(juzzList);
  const findIndex = juzzList?.find((item) => item?._id === id);
  console.log("findIndex", script);

  const findScriptNmae = getScripts?.find((item) => item?._id === script);
  console.log("check script", findScriptNmae);

  const getAllJuzzAyats = async (languageId = languageIds) => {
    try {
      const payload = {
        id: findIndex?.index,
        languageId: languageId,
        type: findScriptNmae?.name,
      };
      const res = await dispatch(getJuzzByAyat(payload))?.unwrap();
      setAyats(res?.ayats);
      setJuzzDetail(res?.juzz);
      setJuzzNumber(res?.juzz?.index);
      setLoader(false);
      setayatsLoaded(true);
      setCurrentVerse("");
      setAllWords([]);
      console.log("res=>", res);
    } catch (error) {
      setLoader(false);

      console.log("error in getting juzz", error);
    }
  };

  const findScriptName = getScripts?.find((item) => item?._id === script);

  // const getWordList = async () => {
  //   try {
  //     let page = 1;
  //     const limit = 42;
  //     let hasMoreData = true;
  //     let allFetchedWords = [];

  //     while (hasMoreData) {
  //       const payload = {
  //         page: page,
  //         limit: limit,
  //         ...(findScriptName?.name == "Indo-Pak"
  //           ? { paraIndoPak: juzzNumber }
  //           : { paraUsmani: juzzNumber }),
  //       };
  //       const response = await dispatch(getWordsByJuzz(payload)).unwrap();
  //       console.log("find words", response?.data);
  //       if (response?.data && response.data.length > 0) {
  //         // Append new data to the existing array
  //         allFetchedWords = [...allFetchedWords, ...response.data];
  //         // Update state with the accumulated data
  //         setAllWords(allFetchedWords);
  //         page += 1; // Move to the next page
  //       } else {
  //         // No more data to fetch
  //         hasMoreData = false;
  //       }
  //     }
  //   } catch (error) {
  //     console.log("error getting word list-->", error);
  //   }
  // };

  // useEffect(() => {
  //   getWordList();
  // }, [juzzNumber]);

  // console.log('check current script name ', findScriptName?.name)
  // console.log((findScriptName?.name === "Indo-Pak"
  //   ? { paraIndoPak: juzzNumber }
  //   : { paraUsmani: juzzNumber }))

  // useEffect(() => {
  //   const abortController = new AbortController();

  //   const getWordList = async () => {
  //     try {
  //       let page = 1;
  //       const limit = 100;
  //       let hasMoreData = true;
  //       let allFetchedWords = [];
  //       // setLoader(true)

  //       while (hasMoreData) {
  //         const payload = {
  //           page: page,
  //           limit: limit,
  //           ...(findScriptName?.name === "Indo-Pak"
  //             ? { paraIndoPak: juzzNumber }
  //             : { paraUsmani: juzzNumber }),
  //         };

  //         console.log('check>>>> paylod', payload)
  //         console.log('che<<<<< paylod', (findScriptName?.name === "Indo-Pak"
  //           ? { paraIndoPak: juzzNumber }
  //           : { paraUsmani: juzzNumber }))

  //         const response = await dispatch(
  //           getWordsByJuzz({ payload, signal: abortController.signal })
  //         ).unwrap();

  //         if (response?.data && response.data.length > 0) {
  //           allFetchedWords = [...allFetchedWords, ...response.data];
  //           setAllWords(allFetchedWords);
  //           if (page == 1) {
  //             setLoader2(false)
  //           }
  //           page += 1;
  //         } else {
  //           hasMoreData = false;
  //         }
  //       }
  //     } catch (error) {
  //       if (error.name === "CanceledError") {
  //         console.log("API call was cancelled");
  //       } else {
  //         console.log("Error getting word list -->", error);
  //         setLoader2(false)
  //       }
  //     }
  //   };

  //   getWordList();

  //   return () => {
  //     abortController.abort(); // 👈 Cancel request on unmount or re-render
  //   };
  // }, [script, juzzNumber]);

  useEffect(() => {
    const abortController = new AbortController();

    const getWordList = async () => {
      try {
        let page = 1;
        const limit = 1000;
        let hasMoreData = true;
        const allFetchedWords = [];

        while (hasMoreData) {
          const payload = {
            page,
            limit,
            ...(findScriptName?.name === "Indo-Pak"
              ? { paraIndoPak: juzzNumber }
              : { paraUsmani: juzzNumber }),
            isNew: true,
          };

          const response = await dispatch(
            getWordsByJuzz({ payload, signal: abortController.signal })
          ).unwrap();

          const words = response?.data || [];

          if (words.length > 0) {
            allFetchedWords.push(...words);
            setAllWords([...allFetchedWords]);

            if (page === 1) {
              setLoader2(false);
            }

            page += 1;
          } else {
            hasMoreData = false;
          }
        }

        // In case no data is ever returned (edge case)
        if (page === 1) {
          setLoader2(false);
        }
      } catch (error) {
        if (error.name === "AbortError" || error.name === "CanceledError") {
          console.log("API call was cancelled");
        } else {
          console.error("Error getting word list -->", error);
          setLoader2(false);
        }
      }
    };
    if (ayatsLoaded) {
      getWordList();
    }

    return () => {
      abortController.abort();
    };
  }, [script, juzzNumber, ayatsLoaded]);

  // useEffect(() => {
  //   const abortController = new AbortController();

  //   const getWordList = async () => {
  //     try {
  //       let page = 1;
  //       const limit = 100;
  //       let hasMoreData = true;
  //       const allFetchedWords = [];
  //       let totalCount = 0;

  //       while (hasMoreData) {
  //         // if(page == 1){
  //         //   setLoader2(true)
  //         // }
  //         const payload = {
  //           page,
  //           limit,
  //           ...(findScriptName?.name === "Indo-Pak"
  //             ? { paraIndoPak: juzzNumber }
  //             : { paraUsmani: juzzNumber }),
  //         };

  //         const response = await dispatch(
  //           getWordsByJuzz({ payload, signal: abortController.signal })
  //         ).unwrap();

  //         const words = response?.data || [];

  //         if (page === 1) {
  //           totalCount = response?.totalCount || 0;
  //         }

  //         if (words.length > 0) {
  //           allFetchedWords.push(...words);
  //           setAllWords([...allFetchedWords]);

  //           if (allFetchedWords.length >= totalCount) {
  //             hasMoreData = false;
  //             setLoader2(false);
  //           }

  //           page += 1;
  //         } else {
  //           hasMoreData = false;
  //           // Even if no data is returned later, but we have some, stop loading
  //           if (allFetchedWords.length > 0) {
  //             setLoader2(false);
  //           }
  //         }
  //       }

  //       // Edge case: if no data at all
  //       if (allFetchedWords.length === 0) {
  //         setLoader2(false);
  //       }
  //     } catch (error) {
  //       if (error.name === "AbortError" || error.name === "CanceledError") {
  //         console.log("API call was cancelled");
  //       } else {
  //         console.error("Error getting word list -->", error);
  //         setLoader2(false);
  //       }
  //     }
  //   };

  //   getWordList();

  //   return () => {
  //     abortController.abort();
  //   };
  // }, [script, juzzNumber]);

  const getReciter = async () => {
    try {
      const response = await dispatch(getAllReciter())?.unwrap();
      setRecitor(response?.data);
    } catch (error) {
      console.log("error getting reciter-->", error);
    }
  };

  const getRunningTranslation = async () => {
    try {
      const response = await dispatch(
        getChaptersRunningTranslation({
          chapterId: id,
          languageId: "668ee3b5f5069cf20aa046f9",
        })
      )?.unwrap();
      setRunningTranslation(response?.data);
    } catch (error) {
      console.log("error fetching running translations->", error);
    }
  };

  useEffect(() => {
    if (id) {
      getRunningTranslation();
      getReciter();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getAllJuzzAyats();
    }
  }, [id, script]);

  const MQJTabs = [
    {
      label: t("Arabic"),
      imgSrc: "/images/icon-arabic.png",
      altText: "Arabic",
      component: (
        <ArabicTabContent
          ayats={ayats}
          bismillah={bismillah}
          scripts={script}
          playingAyahIndex={playingAyahIndex}
          playingAudio={playArabicAyats} // Only Arabic
          fontSize={fontSize}
          currentVerse={currentVerse}
          hizb={hizb}
          type="juzz"
          id={id}
          lines={lines}
          surah={surah}
          juzzNo={juzzNo}
          setRepeatCount={setRepeatCount}
          repeatCount={repeatCount}
          onRepeat={handleAyahRepeat}
          currentRuku={currentRuku}
          loader={loader}
        />
      ),
    },
    {
      label: t("Ayahs"),
      imgSrc: "/images/icon-ayahs.png",
      altText: "Ayahs",
      component: (
        <AyahsTabContent
          ayats={ayats}
          currentJuzzDetail={juzzDetail}
          bismillah={bismillah}
          language={language}
          scripts={script}
          playingAyahIndex={playingAyahIndex}
          playingAudio={playArabicWithTranslationAyats} // Arabic + Translation
          fontSize={fontSize}
          currentVerse={currentVerse}
          type="juzz"
          setRepeatCount={setRepeatCount}
          repeatCount={repeatCount}
          onRepeat={handleAyahRepeat}
          hizb={hizb}
          id={id}
          currentRuku={currentRuku}
          loader={loader}
        />
      ),
    },
    {
      label: t("Words"),
      imgSrc: "/images/icon-words.png",
      altText: "Words",
      component: (
        <WordsTabContent
          words={allWords}
          language={language}
          fontSize={fontSize}
          bismillah={bismillah}
          scripts={script}
          type="juzz"
          juzzNo={juzzNumber}
          loader={loader2}
          ayats={ayats}
          languageId={languageIds}
        />
      ),
    },
  ];

  const fetchJuzzData = async () => {
    try {
      const response = await dispatch(getAllJuzz())?.unwrap();
      setJuzz(response?.data);
      setJuzzName(id);
    } catch (error) {
      console.log("error fetching in surah detail", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJuzzData();
    }
  }, [profile, id]);

  useEffect(() => {
    const getValue = Cookies.get("languagedropdown");
    if (getValue && translation.length > 0) {
      const findObject = translation.find((item) => item.code === getValue);
      if (findObject) {
        setLanguage(findObject.code); // e.g., 'en'
        setLanguageId(findObject._id); // e.g., '668ee3b5...'
      }
    }
  }, [translation]);

  const handleLanguage = (e) => {
    const selectedLang = e.target.value;
    const check = translation?.find((item) => item?.code === selectedLang);
    const code = check?.code;
    Cookies.set("languagedropdown", code);
    setLanguage(selectedLang);
    setLanguageId(check?._id);
  };

  const handleSurahs = (e) => {
    const selectedName = e.target.value;
    setSurahName(selectedName);
    // Find the selected surah and update the route
    const selectedSurah = surahs.find((surah) => surah._id === selectedName);
    if (selectedSurah) {
      router.push(`/surah/${selectedSurah?._id}`);
      setCurrentVerse("");
    }
  };

  const handleJuzz = (e) => {
    const selectedName = e.target.value;
    setJuzzName(selectedName);
    const selectedJuz = juzz.find((juz) => juz._id === selectedName);
    if (selectedJuz) {
      router.push(`/juzz/${selectedJuz?._id}`);
      // router.replace(`/juzz/${selectedJuz._id}`, undefined, { shallow: true });
      // setJuzzNumber(selectedJuz?.index);
      setHizb("");
      stopAudio();
      setAllWords([]);
      setLoader2(true);
      setLoader(true);
    }
  };

  const handleVerse = (e) => {
    const selectedVerse = e.target.value;
    setCurrentVerse(selectedVerse);
  };

  const handleHizb = (e) => {
    const selectedHizb = e.target.value;
    setHizb(selectedHizb);
  };

  const handleScripts = (e) => {
    const value = e.target.value;
    setScript(value);
    setAllWords([]);
    setLoader2(true);
  };

  const findJuzzDetail = juzz?.find((item) => item?._id === id);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
  }, []);

  const handleRecitor = (e) => {
    console.log(e.target.value);
  };

  const handleLines = (e) => {
    const value = e.target.value;
    setLines(value);
  };

  const findSurahWithAyat = ayats?.map((item) => ({
    ...item,
    surahWithAyat: `${item?.surahId?.index} : ${item.ayatIndex}`,
  }));

  const findAllRuku = ayats
    ?.filter((item) => item?.rukuEnd)
    ?.map((item) => ({
      ...item,
      rukuNo: item?.rukuEnd?.rukuNo,
    }));

  const [activeTabLabel, setActiveTabLabel] = useState(MQJTabs[0].altText);
  const handleTabChange = (altText) => {
    setActiveTabLabel(altText);
    stopAudio();
    setCurrentVerse("");
    setCurrentRuku("");
  };

  // memorized juzz

  const handleModalOpen = (type, path) => {
    setModalType(type);
    if (path) {
      setPath(path);
    }

    const modalElement = document.getElementById("memorized-modal");
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  };

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
      const response = await dispatch(memorizeJuzz(id))?.unwrap();
      handleModalClose();
    } catch (error) {
      console.log("error in memorized surah", error);
    }
  };

  const handleUnMemorized = async () => {
    try {
      const response = await dispatch(unMemorizeJuzz(id))?.unwrap();
      handleModalClose();
    } catch (error) {
      console.log("error in unmemorized surah", error);
    }
  };

  const handleNextJuzz = () => {
    const nextJuzz = findJuzzDetail?.index + 1;
    const findNextJuzz = juzzList?.find((item) => item?.index === nextJuzz);
    router.push(`/juzz/${findNextJuzz?._id}`);
    setLoader(true);
  };
  const handlePreviousJuzz = () => {
    const nextJuzz = findJuzzDetail?.index - 1;
    const findNextJuzz = juzzList?.find((item) => item?.index === nextJuzz);
    router.push(`/juzz/${findNextJuzz?._id}`);
    setLoader(true);
  };

  return (
    <>
      <Modal id="memorized-modal" type="purple" hideClose>
        {modalType === "memorized" && (
          <MemorizedModal
            icon="/images/mqj-heart.svg"
            description={"Have you memorized this Juz?"}
            handleModalClose={handleModalClose}
            handleSurah={handleMemorized}
          />
        )}
        {modalType === "unmemorized" && (
          <MemorizedModal
            icon="/images/mqj-unmemorized-icon.svg"
            description={
              "Are you sure you want to unmark this juz as memorized?"
            }
            handleModalClose={handleModalClose}
            handleSurah={handleUnMemorized}
          />
        )}
      </Modal>
      <Head>
        <title>Juz {findJuzzDetail?.name} - My Quran Journey</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center p-2 md:p-4">
        <div className="w-full">
          <div className="p-6 mx-auto w-full md:w-[80%] bg-white rounded-2xl -mt-10">
            <Header />

            {/* JUZZ FILTERS */}

            <div className="flex flex-wrap items-center font-amiri justify-center gap-4 lg:gap-10 max-w-full md:max-w-7xl mx-auto p-3 sm:p-4">
              {/* Surah */}
              <div className="w-full sm:w-[48%] md:w-[45%] lg:w-auto">
                <InputSelect
                  label={t("Surahs")}
                  optionLabel="mainName"
                  optionValue="_id"
                  options={surahs}
                  value={surahName}
                  onChange={handleSurahs}
                />
              </div>

              {/* Juz */}
              <div className="w-full sm:w-[48%] md:w-[45%] lg:w-auto">
                <InputSelect
                  label={t("Juz")}
                  optionLabel="mainName"
                  optionValue="_id"
                  options={juzzList}
                  value={juzzName}
                  onChange={handleJuzz}
                />
              </div>

              {/* Hizb */}
              <div className="w-full sm:w-[48%] md:w-[45%] lg:w-auto">
                <InputSelect
                  label={t("Hizb")}
                  optionLabel="label"
                  optionValue="value"
                  options={HizbOptions}
                  value={hizb}
                  onChange={handleHizb}
                />
              </div>

              {/* Verse */}
              <div className="w-full sm:w-[48%] md:w-[45%] lg:w-auto">
                <InputSelect
                  label={t("Verse")}
                  optionLabel="surahWithAyat"
                  options={findSurahWithAyat}
                  value={currentVerse}
                  onChange={handleVerse}
                />
              </div>

              {/* Ruku */}
              <div className="w-full sm:w-[48%] md:w-[45%] lg:w-auto">
                <InputSelect
                  label={t("Ruku")}
                  optionLabel="rukuNo"
                  optionValue="rukuNo"
                  options={findAllRuku}
                  value={currentRuku}
                  onChange={(e) => setCurrentRuku(e.target.value)}
                />
              </div>

              {/* Script */}
              <div className="w-full sm:w-[48%] md:w-[45%] lg:w-auto relative">
                <div className="absolute top-2 right-3 flex items-center gap-2">
                  {volume ? (
                    <Volume2
                      size={18}
                      className="cursor-pointer"
                      onClick={() => setVolume(false)}
                    />
                  ) : (
                    <VolumeOff
                      size={18}
                      className="cursor-pointer"
                      onClick={() => setVolume(true)}
                    />
                  )}
                </div>
                <InputSelect
                  label={t("Script")}
                  optionLabel="name"
                  optionValue="_id"
                  options={getScripts}
                  onChange={handleScripts}
                />
              </div>

              {/* Reciter */}
              <div className="w-full sm:w-[48%] md:w-[45%] lg:w-auto">
                <InputSelect
                  label={t("Reciter")}
                  optionLabel="name"
                  optionValue="_id"
                  options={recitor}
                  onChange={handleRecitor}
                  value={currentRecitor}
                />
              </div>

              {/* Translation */}
              <div className="relative w-full sm:w-[48%] md:w-[45%] lg:w-auto">
                <div className="flex items-center justify-between mb-1">
                  <p className="m-0 whitespace-nowrap text-sm sm:text-base">
                    {t("Translation")}
                  </p>
                  {translationVolume ? (
                    <Volume2
                      size={18}
                      className="cursor-pointer"
                      onClick={() => setTranslationVolume(false)}
                    />
                  ) : (
                    <VolumeOff
                      size={18}
                      className="cursor-pointer"
                      onClick={() => setTranslationVolume(true)}
                    />
                  )}
                </div>
                <InputSelect
                  value={language}
                  optionValue="code"
                  optionLabel="name"
                  options={translation}
                  onChange={handleLanguage}
                />
              </div>

              {/* Lines */}
              <div className="w-full sm:w-[48%] md:w-[45%] lg:w-auto">
                <InputSelect
                  label={t("Lines")}
                  optionLabel="label"
                  optionValue="value"
                  options={LinesOptions}
                  onChange={handleLines}
                />
              </div>

              {/* Font Size */}
              <div className="flex items-center w-full sm:w-[48%] md:w-[45%] lg:w-auto">
                <InputRangeNew
                  labelStart="س"
                  labelEnd="س"
                  min={0}
                  max={100}
                  step={1}
                  value={fontSize}
                  onChange={handleFontSizeChange}
                />
              </div>
            </div>
          </div>
          <MainContainer isColor={false}>
            <div className="grid grid-cols-1 md:grid-cols-[72px_1fr] gap-2">
              <DetailSidebarJuz onChangeView={(v) => setCurrentTab(v)} />
              <div className="flex flex-col h-[calc(85vh-320px)]">
                <DetailHeader data={findJuzzDetail} />
                {currentTab === "arabic" && (
                  <>
                    {loader ? (
                      <ArabicViewSkeleton />
                    ) : (
                      <ArabicTabContent
                        ayats={ayats}
                        bismillah={bismillah}
                        scripts={script}
                        playingAyahIndex={playingAyahIndex}
                        playingAudio={playArabicAyats} // Only Arabic
                        fontSize={fontSize}
                        currentVerse={currentVerse}
                        hizb={hizb}
                        type="juzz"
                        id={id}
                        lines={lines}
                        surah={surah}
                        juzzNo={juzzNo}
                        setRepeatCount={setRepeatCount}
                        repeatCount={repeatCount}
                        onRepeat={handleAyahRepeat}
                        currentRuku={currentRuku}
                        loader={loader}
                      />
                    )}
                  </>
                )}
                {currentTab === "ayahs" && (
                  <>
                    {loader ? (
                      <AyahCardSkeleton />
                    ) : (
                      <AyahsTabContent
                        ayats={ayats}
                        currentJuzzDetail={juzzDetail}
                        bismillah={bismillah}
                        language={language}
                        scripts={script}
                        playingAyahIndex={playingAyahIndex}
                        playingAudio={playArabicWithTranslationAyats} // Arabic + Translation
                        fontSize={fontSize}
                        currentVerse={currentVerse}
                        type="juzz"
                        setRepeatCount={setRepeatCount}
                        repeatCount={repeatCount}
                        onRepeat={handleAyahRepeat}
                        hizb={hizb}
                        id={id}
                        currentRuku={currentRuku}
                        loader={loader}
                      />
                    )}
                  </>
                )}
                {currentTab === "words" && (
                  <>
                    {loader ? (
                      <WordsSkeleton />
                    ) : (
                      <WordsTabContent
                        words={allWords}
                        language={language}
                        fontSize={fontSize}
                        bismillah={bismillah}
                        scripts={script}
                        type="juzz"
                        juzzNo={juzzNumber}
                        loader={loader2}
                        ayats={ayats}
                        languageId={languageIds}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </MainContainer>
        </div>
      </div>
    </>
  );
};

export default JuzzDetail;
