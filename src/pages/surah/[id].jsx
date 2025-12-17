import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import InputSelect from "@/components/InputSelect";
import InputRange from "@/components/InputRange";
import TabButton from "@/components/TabButton";
import TabPane from "@/components/TabPane";
import ArabicTabContent from "@/components/ArabicTabContent";
import AyahsTabContent from "@/components/AyahsTabContent";
import LessonsTabContent from "@/components/LessonsTabContent";
import TestTabContent from "@/components/TestTabContent";
import { useRouter } from "next/router";
import PageWrapper from "@/components/PageWrapper";
import { useDispatch, useSelector } from "react-redux";
import {
  addBookMarkAyat,
  deleteBookMark,
  getAllBookMark,
  getAllJuzz,
  getAllReciter,
  getAyats,
  getChapterQuizDetails,
  getChaptersLesson,
  getChaptersRunningTranslation,
  getSurahDetails,
  getSurahDetailsGuest,
  getWordsBySurah,
  memorizeSurah,
  unMemorizeSurah,
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
import Modal from "@/components/Modal";
import MemorizedModal from "@/components/MemorizedModal";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { parse } from "cookie";
import Header from "@/components/Header";
import MainContainer from "@/components/MainContainer";
import DetailSidebar from "@/components/detail/DetailSidebar";
import DetailHeader from "@/components/detail/DetailHeader";
import WordsTabContent from "@/components/WordsTabContent";
import InputRangeNew from "@/components/InputRange2";
import AyahCardSkeleton from "@/components/AyahCardSkeleton";
import ArabicViewSkeleton from "@/components/ArabicViewSkeleton";
import WordsSkeleton from "@/components/WordsSkeleton";
import LessonsSkeleton from "@/components/LessonsSkeleton";
import TestSkeleton from "@/components/TestSkeleton";
import nextI18nextConfig from "../../../next-i18next.config";
import DetailHeaderSkeleton from "@/components/DetailHeaderSkeleton";

// export async function getServerSideProps({ req, params }) {
//   let cookies = {};

//   try {
//     const cookieHeader = req.headers.cookie || req.headers.Cookie || "";
//     if (cookieHeader) {
//       cookies = parse(cookieHeader);
//     }
//   } catch (error) {
//     console.error("Error parsing cookies:", error);
//   }

//   const lang = cookies.language || "en";
//   const { id } = params; // <-- dynamic id from URL

//   return {
//     props: {
//       id, // <-- pass id to the page component
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

const SurahDetail = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const [detail, setDetail] = useState("");
  const profile = useSelector((state) => state.api.user);
  const [ayats, setAyats] = useState([]);
  const [language, setLanguage] = useState("en");
  const [languageId, setLanguageId] = useState("");
  const [recitor, setRecitor] = useState([]);
  const [script, setScript] = useState("67fde59231fdd14db9aa6834");
  const [surahName, setSurahName] = useState("");
  const [currentVerse, setCurrentVerse] = useState("");
  const [loader, setLoader] = useState(true);
  const [loader2, setLoader2] = useState(true);
  const [allWords, setAllWords] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false); // Track if audio is playing
  const [playingAyahIndex, setPlayingAyahIndex] = useState(null); // Track current Ayah
  const [fontSize, setFontSize] = useState(50);
  const [lesson, setLesson] = useState("");
  const [runningTranslation, setRunningTranslation] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [volume, setVolume] = useState(true);
  const [translationVolume, setTranslationVolume] = useState(true);
  const [modalType, setModalType] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentView, setCurrentView] = useState("");
  const [currentRuku, setCurrentRuku] = useState();
  const [juzz, setJuzz] = useState([]);
  const [currentTab, setCurrentTab] = useState("arabic");
  const [currentRecitor, setCurrentRecitor] = useState(
    "680737820cb06ed90cfe8d4f"
  );

  const bismillah = useSelector((state) => state.api.bismillah);
  const translation = useSelector((state) => state.api.translation);
  const surahs = useSelector((state) => state.api.surahs);
  const getScripts = useSelector((state) => state.api.scripts);
  const juzzList = useSelector((state) => state.api.juzz);

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
    console.log(" repeatCountsRef updated to:", repeatCount);
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
        `Repeat count for ayah ${ayahIndex} updated to: ${newCount}`
      );
      return { ...prev, [ayahIndex]: newCount };
    });
  };

  const query = router.query;



  useEffect(() => {
    if (query?.tab === "arabic") {
      setCurrentTab("arabic");
    }
  }, [query]);

  const playArabicAyats = (startIndex = 0) => {
    if (!volume || !currentRecitor) return;

    if (isPlaying) {
      stopAudio();
      return;
    }

    if (!bismillah?.audio && ayats.length === 0) return;

    // Prepare audio array
    const audioArray = [];

    if (bismillah?.audio) {
      audioArray.push({ audio: bismillah.audio, id: "bismillah" });
    }

    ayats.forEach((ayat, i) => {
      const audioObj = ayat?.audios?.find(
        (audio) => audio.reciterId === currentRecitor
      );
      if (audioObj?.audioFile) {
        audioArray.push({ audio: audioObj.audioFile, id: i }); // use ayat index as id
      }
    });

    if (audioArray.length === 0) return;

    let currentIndex = startIndex;
    let currentRepeat = 1;

    const playNextAyah = () => {
      if (currentIndex >= audioArray.length || !volume) {
        setIsPlaying(false);
        setPlayingAyahIndex(null);
        return;
      }

      const currentItem = audioArray[currentIndex];

      setPlayingAyahIndex(currentItem.id); // can be "bismillah" or ayah index
      const audio = new Audio(currentItem.audio);
      currentAudioRef.current = audio;
      setIsPlaying(true);

      audio.play().catch((err) => {
        console.error("Play error:", err);
        currentIndex++;
        currentRepeat = 1;
        playNextAyah();
      });

      audio.onended = () => {
        handleRepeatOrNext();
      };

      audio.onerror = (err) => {
        console.error("Audio error:", err);
        currentIndex++;
        currentRepeat = 1;
        playNextAyah();
      };
    };

    const handleRepeatOrNext = () => {
      const currentItem = audioArray[currentIndex];
      const ayahId = currentItem.id;

      const repeatCount =
        typeof ayahId === "number" ? repeatCountsRef.current[ayahId] || 1 : 1;

      if (currentRepeat < repeatCount) {
        currentRepeat++;
        console.log(
          `🔁 Repeating ayah (${ayahId}): ${currentRepeat}/${repeatCount}`
        );
        playNextAyah();
      } else {
        currentRepeat = 1;
        currentIndex++;
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

    const allAudioData = [
      {
        arabicAudio: bismillah?.audio,
        translationText: textBasedOnLanguage(bismillah, language),
      },
      ...ayats.map((ayat, i) => ({
        arabicAudio: ayat?.audios?.find(
          (audio) => audio.reciterId === currentRecitor
        )?.audioFile,
        translationText: textBasedOnLanguage(ayat, language),
      })),
    ].filter((item) => item.arabicAudio || item.translationText);

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

      const { arabicAudio, translationText } = allAudioData[currentIndex];
      console.log(`🎧 Playing index ${currentIndex}`, {
        arabicAudio,
        translationText,
      });

      setPlayingAyahIndex(currentIndex - 1);

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
      // Get repeat count for the current ayah (default to 1 if not set)
      const repeatCountForCurrent =
        repeatCountsRef.current[currentIndex - 1] || 1;
      if (currentRepeat < repeatCountForCurrent) {
        currentRepeat++;
        console.log(
          `🔁 Repeating current ayah (${currentRepeat}/${repeatCountForCurrent})`
        );
        playNextAyah(); // Repeat current ayah
      } else {
        currentRepeat = 1;
        currentIndex++; // Move to next ayah
        console.log(`➡️ Moving to next ayah: ${currentIndex}`);
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

  const viewOptions = [
    { label: "In Surah", value: "inSurah" },
    { label: "In Juz", value: "inJuzz" },
  ];

  const getAllAyats = async () => {
    try {
      setLoader(true);
      const response = await dispatch(getAyats(id)).unwrap();
      setAyats(response?.data);
      setLoader(false);
    } catch (error) {
      console.log("error fetching in get ayats", error);
    }
  };

  const getWordList = async () => {
    try {
      const response = await dispatch(getWordsBySurah(id))?.unwrap();
      setAllWords(response?.data);
      setLoader2(false);
    } catch (error) {
      console.log("error getting word list-->", error);
    }
  };

  const getLesson = async () => {
    try {
      const response = await dispatch(getChaptersLesson(id))?.unwrap();
      setLesson(response?.data);
    } catch (error) {}
  };

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

  const getRunningTranslation = async () => {
    try {
      const response = await dispatch(
        getChaptersRunningTranslation({
          chapterId: id,
          languageId: languageId,
        })
      )?.unwrap();
      setRunningTranslation(response?.data);
    } catch (error) {
      console.log("error fetching running translations->", error);
    }
  };

  useEffect(() => {
    if (id && languageId) {
      getRunningTranslation();
    }
  }, [id, languageId]);

  const getQuizDetails = async () => {
    try {
      const response = await dispatch(getChapterQuizDetails(id))?.unwrap();
      setQuiz(response?.data);
    } catch (error) {
      console.log("error getting quiz details->", error);
    }
  };

  const getReciter = async () => {
    try {
      const response = await dispatch(getAllReciter())?.unwrap();
      setRecitor(response?.data);
    } catch (error) {
      console.log("error getting reciter-->", error);
    }
  };

  const fetchJuzzData = async () => {
    try {
      const response = await dispatch(getAllJuzz())?.unwrap();
      setJuzz(response?.data);
    } catch (error) {
      console.log("error fetching in surah detail", error);
    }
  };

  useEffect(() => {
    if (id) {
      getLesson();
      getWordList();
      getQuizDetails();
      getAllAyats();
      getReciter();
      fetchJuzzData();
      
    }
  }, [id ]);

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
          playingAudio={playArabicAyats}
          isPlaying={isPlaying}
          fontSize={fontSize}
          currentVerse={currentVerse}
          id={id}
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
          bismillah={bismillah}
          language={language}
          scripts={script}
          playingAyahIndex={playingAyahIndex}
          playingAudio={playArabicWithTranslationAyats} // Arabic + Translation
          fontSize={fontSize}
          currentVerse={currentVerse}
          id={id}
          setRepeatCount={setRepeatCount}
          repeatCount={repeatCount}
          onRepeat={handleAyahRepeat}
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
          id={id}
          loader={loader2}
          languageId={languageId}
        />
      ),
    },
    ...(lesson && [
      {
        label: t("Lessons"),
        imgSrc: "/images/icon-lessons.png",
        altText: "Lessons",
        component: (
          <LessonsTabContent
            lesson={lesson}
            runningTranslation={runningTranslation}
            language={languageId}
          />
        ),
      },
    ]),
    ...(quiz?.length > 1
      ? [
          {
            label: t("Test"),
            imgSrc: "/images/icon-test.png",
            altText: "Test",
            component: (
              <TestTabContent
                quiz={quiz}
                id={id}
                detail={detail}
                languageId={languageId}
              />
            ),
          },
        ]
      : []),
  ];

  const fetchSurahDetails = async () => {
    try {
      const response = await dispatch(
        profile ? getSurahDetails(id) : getSurahDetailsGuest(id)
      ).unwrap();
      setDetail(response?.data);
      setSurahName(response?.data?._id);
    } catch (error) {
      console.log("error fetching in surah detail", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSurahDetails();
    }
  }, [profile, id]);

  const handleLanguage = (e) => {
    const selectedLangId = e.target.value;
    const findObject = translation?.find(
      (item) => item?._id === selectedLangId
    );
    Cookies.set("languagedropdown", findObject?.code);
    setLanguage(findObject?.code); // e.g., "en"
    setLanguageId(findObject?._id); // e.g., "668ee3..."
  };

  const handleSurahs = (e) => {
    const selectedName = e.target.value;
    setSurahName(selectedName);
    // Find the selected surah and update the route
    const selectedSurah = surahs.find((surah) => surah._id === selectedName);
    if (selectedSurah) {
      router.push(`/surah/${selectedSurah?._id}`);
      setCurrentVerse("");
      stopAudio();
    }
  };

  const handleVerse = (e) => {
    const selectedVerse = e.target.value;
    setCurrentVerse(selectedVerse);
  };

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

  const handleScripts = (e) => {
    const value = e.target.value;
    setScript(value);
  };
  const bookmark = useSelector((state) => state.api.bookMarkSurah);
  const isBookmarked = bookmark.some(
    (item) => item.surahId === id && item.bookMarkType === "surah"
  );

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
      const bookmarkItem = bookmark.find(
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
    if (isBookmarked) {
      await handleDeleteBookmark();
    } else {
      await handleAddBookmark();
    }
  };

  const handleJuzz = (e) => {
    const selectedName = e.target.value;
    // Find the selected surah and update the route
    const selectedSurah = juzzList.find((surah) => surah._id === selectedName);
    if (selectedSurah) {
      router.push(`/juzz/${selectedSurah?._id}`);
    }
  };

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
    const getId = e.target.value;
    setCurrentRecitor(getId);
  };

  const findSurahJuzz = juzz?.find(
    (item) => item?.index === detail?.parahNumber
  );

  const handleView = (e) => {
    const value = e.target.value;
    setCurrentView(value);
    router.push(
      `/juzz/${findSurahJuzz?._id}?surah=${detail?.index}&juzzNo=${detail?.parahNumber}`
    );
  };

  const [activeTabLabel, setActiveTabLabel] = useState(MQJTabs[0].altText);

  const handleTabChange = (altText) => {
    setActiveTabLabel(altText);
    stopAudio();
    setCurrentVerse("");
  };

  const findAllRuku = ayats
    ?.filter((item) => item?.rukuEnd)
    ?.map((item) => ({
      ...item,
      rukuNo: item?.rukuEnd?.rukuNo,
    }));

  const handleNextSurah = () => {
    const nextSurah = detail?.index - 1;
    const findNextSurah = surahs?.find((item) => item?.index === nextSurah);
    router.push(`/surah/${findNextSurah?._id}`);
    setLoader(true);
  };
  const handlePreviousSurah = () => {
    const previousJuzz = detail?.index + 1;
    const findPreviousSurah = surahs?.find(
      (item) => item?.index === previousJuzz
    );
    router.push(`/surah/${findPreviousSurah?._id}`);
    setLoader(true);
  };

  console.log(">>>", currentTab);

  const [tab, setTab] = useState([
    { tab: "arabic" },
    { tab: "ayahs " },
    { tab: "words" },
    { tab: "lessons" },
    { tab: "quiz" },
  ]);

  console.log(">>>>", detail);

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
      <Head>
        <title>Surah {detail?.name} -Quran Connect</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center p-2 md:p-4">
        <div className="w-full">
          <div className="p-6 mx-auto w-full md:w-[80%] bg-white rounded-2xl -mt-10">
            <Header />

            {/* SURAH CONTROLS */}
            <div className="flex flex-wrap font-amiri items-center justify-center gap-4 lg:gap-10 w-full md:max-w-7xl mx-auto p-3 sm:p-4">
              {/* Verse */}
              <div className="w-full font-amiri sm:w-[48%] md:w-[45%] lg:w-auto">
                <InputSelect
                  label={t("Verse")}
                  optionLabel="ayatIndex"
                  options={ayats}
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
                  placeholder="dd"
                  options={findAllRuku}
                  value={currentRuku}
                  onChange={(e) => setCurrentRuku(e.target.value)}
                />
              </div>

              {/* Script */}
              <div className="w-full sm:w-[48%] md:w-[45%] lg:w-auto">
                <InputSelect
                  label={t("Script")}
                  optionLabel="name"
                  optionValue="_id"
                  options={getScripts}
                  onChange={handleScripts}
                />
              </div>

              {/* Reciter */}
              <div className="relative w-full sm:w-[48%] md:w-[45%] lg:w-auto">
                {/* Volume Control */}
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
                  label={t("Reciter")}
                  optionLabel="name"
                  optionValue="_id"
                  options={recitor}
                  value={currentRecitor}
                  onChange={handleRecitor}
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
                  value={languageId}
                  optionValue="_id"
                  optionLabel="name"
                  options={translation}
                  onChange={handleLanguage}
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
              <DetailSidebar onChangeView={(v) => setCurrentTab(v)} />
              <div className="flex flex-col h-[calc(85vh-320px)]">
                {loader ? (
                  <DetailHeaderSkeleton />
                ) : (
                  <DetailHeader type="surah" data={detail} />
                )}
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
                        playingAudio={playArabicAyats}
                        fontSize={fontSize}
                        currentVerse={currentVerse}
                        id={id}
                        setRepeatCount={setRepeatCount}
                        repeatCount={repeatCount}
                        onRepeat={handleAyahRepeat}
                        isPlaying={isPlaying}
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
                        bismillah={bismillah}
                        language={language}
                        scripts={script}
                        playingAyahIndex={playingAyahIndex}
                        playingAudio={playArabicWithTranslationAyats} // Arabic + Translation
                        fontSize={fontSize}
                        currentVerse={currentVerse}
                        id={id}
                        setRepeatCount={setRepeatCount}
                        repeatCount={repeatCount}
                        onRepeat={handleAyahRepeat}
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
                        id={id}
                        loader={loader2}
                        languageId={languageId}
                      />
                    )}
                  </>
                )}
                {currentTab === "lessons" && (
                  <>
                    {" "}
                    {loader ? (
                      <LessonsSkeleton />
                    ) : (
                      <LessonsTabContent
                        lesson={lesson}
                        runningTranslation={runningTranslation}
                        language={languageId}
                      />
                    )}
                  </>
                )}
                {currentTab === "quiz" && (
                  <>
                    {loader ? (
                      <TestSkeleton />
                    ) : (
                      <TestTabContent
                        quiz={quiz}
                        id={id}
                        detail={detail}
                        languageId={languageId}
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

export default SurahDetail;

// <PageWrapper iconSize={true}>
//       <div className="container position-relative">
//         <div className="bg-white rounded">
//           <div className="row g-0 flex-md-nowrap">
//             {/* First Section */}
//             <div className="col-md-5 border-end p-2">
//               <div className="py-2 px-2">
//                 {/* First Row: 3 items on desktop, 1 per row on mobile */}
//                 <div className="d-flex gap-2 mb-2 flex-md-nowrap flex-wrap">
//                   <div className="flex-md-1 w-100">
//                     <InputSelect
//                       label={t("Surahs")}
//                       optionLabel="mainName"
//                       optionValue="_id"
//                       options={surahs}
//                       value={surahName}
//                       onChange={handleSurahs}
//                     />
//                   </div>
//                   <div className="flex-md-1 w-100">
//                     <InputSelect
//                       label={t("Juz")}
//                       optionLabel="mainName"
//                       optionValue="_id"
//                       options={juzzList}
//                       onChange={handleJuzz}
//                     />
//                   </div>
//                 </div>
//                 {/* Second Row: 2 items on desktop, 1 per row on mobile */}
//                 <div className="d-flex gap-2 flex-md-nowrap flex-wrap">
//                   <div className="flex-md-1 w-100">
//                     <InputSelect
//                       label={t("Verse")}
//                       optionLabel="ayatIndex"
//                       options={ayats}
//                       value={currentVerse}
//                       onChange={handleVerse}
//                     />
//                   </div>
//                   <div className="flex-md-1 w-100">
//                     <InputSelect
//                       label={t("View")}
//                       optionLabel="label"
//                       optionValue="value"
//                       options={viewOptions}
//                       value={currentView}
//                       onChange={handleView}
//                     />
//                   </div>
//                   <InputSelect
//                     label={t("Ruku")}
//                     optionLabel="rukuNo"
//                     optionValue="rukuNo"
//                     placeholder="dd"
//                     options={findAllRuku}
//                     value={currentRuku}
//                     onChange={(e) => setCurrentRuku(e.target.value)}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Second Section - 2 inputs in column */}
//             <div className="col-md-3 border-end p-2">
//               <div className="d-flex flex-column gap-2 py-2 px-2">
//                 <div className="d-flex align-items-center gap-2">
//                   <div style={{ flex: "1" }}>
//                     <InputSelect
//                       label={t("Script")}
//                       optionLabel="name"
//                       options={getScripts}
//                       optionValue="_id"
//                       onChange={handleScripts}
//                     />
//                   </div>
//                   {volume ? (
//                     <Volume2 size={19} onClick={() => setVolume(false)} />
//                   ) : (
//                     <VolumeOff size={19} onClick={() => setVolume(true)} />
//                   )}
//                 </div>
//                 <div style={{ flex: "1" }}>
//                   <InputSelect
//                     label={t("Reciter")}
//                     optionLabel="name"
//                     optionValue="_id"
//                     options={recitor}
//                     onChange={handleRecitor}
//                     value={currentRecitor}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Third Section - Translation */}
//             <div className="col-md-2 border-end p-2">
//               <div className="d-flex flex-column gap-2 py-2 px-2">
//                 <div className="d-flex align-items-center gap-2">
//                   <p className="m-0" style={{ whiteSpace: "nowrap" }}>
//                     {t("Translation")}
//                   </p>
//                   {translationVolume ? (
//                     <Volume2
//                       size={19}
//                       onClick={() => setTranslationVolume(false)}
//                     />
//                   ) : (
//                     <VolumeOff
//                       size={19}
//                       onClick={() => setTranslationVolume(true)}
//                     />
//                   )}
//                 </div>
//                 <div style={{ flex: "1" }}>
//                   <InputSelect
//                     value={languageId}
//                     optionValue="_id"
//                     optionLabel="name"
//                     options={translation}
//                     onChange={handleLanguage}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Fourth Section - Range */}
//             <div className="col-md-2">
//               <div className="px-2">
//                 <InputRange
//                   labelStart="س"
//                   labelEnd="س"
//                   min={0}
//                   max={100}
//                   step={1}
//                   value={fontSize}
//                   onChange={handleFontSizeChange}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div
//           className="nav nav-tabs flex-row d-lg-none mt-2"
//           role="tablist"
//           aria-orientation="vertical"
//         >
//           {MQJTabs.map((tab) => (
//             <TabButton
//               key={tab.altText}
//               {...tab}
//               isActive={activeTabLabel === tab.altText}
//               onClick={() => handleTabChange(tab.altText)}
//             />
//           ))}
//         </div>
//         <div className="d-flex bs-tabs-purple-box">
//           <div
//             className="nav nav-tabs flex-column d-none d-lg-flex"
//             role="tablist"
//             aria-orientation="vertical"
//           >
//             {MQJTabs.map((tab) => (
//               <TabButton
//                 key={tab.altText}
//                 {...tab}
//                 isActive={activeTabLabel === tab.altText}
//                 onClick={() => handleTabChange(tab.altText)}
//               />
//             ))}
//           </div>
//           <div
//             id="v-pills-tabContent"
//             className="tab-content bg-gradient-purple w-100 rounded-bottom"
//           >
//             <div className="clearfix text-center text-light p-3 pb-0">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div className="d-flex justify-content-between align-items-center gap-2">
//                   {loader ? (
//                     <h2 className="text-white-outline m-0">Loading...</h2>
//                   ) : (
//                     <h2 className="text-white-outline m-0">
//                       {detail?.index} - {detail?.name}
//                     </h2>
//                   )}
//                   {activeTabLabel !== "Words" &&
//                     activeTabLabel !== "Lessons" &&
//                     activeTabLabel !== "Test" && (
//                       <Button
//                         className="btn btn-success"
//                         onClick={() => {
//                           activeTabLabel === "Arabic"
//                             ? playArabicAyats()
//                             : playArabicWithTranslationAyats();
//                         }}
//                         disabled={loader}
//                       >
//                         <span>
//                           {isPlaying ? (
//                             <Pause fill="white" />
//                           ) : (
//                             <Play fill="white" />
//                           )}
//                         </span>
//                       </Button>
//                     )}
//                 </div>
//                 {!loader && (
//                   <div className="d-flex align-items-center gap-1">
//                     <Bookmark
//                       size={35}
//                       fill={isBookmarked ? "#e5ce2c" : "#C8C8C8"}
//                       className="cursor-pointer"
//                       onClick={handleBookMark}
//                     />
//                     {profile ? (
//                       profile?.memorizedSurahs?.includes(id) ? (
//                         <Heart
//                           size={35}
//                           fill="#FF0000"
//                           className="cursor-pointer"
//                           onClick={() => handleModalOpen("unmemorized")}
//                         />
//                       ) : (
//                         <Heart
//                           size={35}
//                           fill="#C8C8C8"
//                           className="cursor-pointer"
//                           onClick={() => handleModalOpen("memorized")}
//                         />
//                       )
//                     ) : null}
//                     <h2 className="font-lalezar text-purple-outline m-0">
//                       {detail?.arabicName} -{" "}
//                       <span className="text-right rtl" dir="rtl">
//                         {toArabicNumber(detail?.index)}
//                       </span>
//                     </h2>
//                   </div>
//                 )}
//               </div>
//               <div className="text-start">
//                 {/* {detail?.index < 114 && !loader && activeTabLabel === 'Arabic' &&  (
//                   <Button variant="success" onClick={handlePreviousSurah}>
//                     Previous
//                   </Button>
//                 )} */}
//               </div>
//             </div>
//             {loader ? (
//               <AyatsLoader />
//             ) : (
//               MQJTabs.map((tab) =>
//                 tab.altText === activeTabLabel ? (
//                   <TabPane
//                     key={tab.altText}
//                     label={tab.altText}
//                     isActive={true}
//                   >
//                     <div className="p-3 d-flex gap-2 flex-wrap flex-row-reverse">
//                       {tab.component}
//                     </div>
//                   </TabPane>
//                 ) : null
//               )
//             )}
//             {/* {!loader && activeTabLabel === 'Arabic' && (
//               <div className="text-end">
//                 <Button variant="success" onClick={handleNextSurah}>
//                   Next
//                 </Button>
//               </div>
//             )} */}
//           </div>
//         </div>
//         <div
//           className="bg-gradient-purple p-1 rounded-circle cursor-pointer"
//           style={{
//             position: "fixed",
//             right: "80px",
//             bottom: "40px",
//             height: "40px",
//             width: "40px",
//             fontSize: "3rem",
//             zIndex: 999,
//             display: visible ? "flex" : "none",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <ArrowUp size={25} onClick={scrollToTop} color="white" />
//         </div>
//       </div>
//     </PageWrapper>
