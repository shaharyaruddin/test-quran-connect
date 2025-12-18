import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { useSelector } from "react-redux";
import MainContainer from "../components/MainContainer";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";
import CardsGrid from "../components/CardsGrid";
import SurahCard, { SurahCardSkeleton } from "../components/SurahCard";
import Head from "next/head";
import JuzCard from "../components/JuzCard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "../../next-i18next.config";
import { parse } from "cookie";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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


export default function Home() {
  const [activeTab, setActiveTab] = React.useState("Surah");

  // Get surahs data from Redux store
  const surahsData = useSelector((state) => state.api.surahs);

  console.log("surah Data", surahsData)


  console.log(surahsData, "surahData");
  const juzzData = useSelector((state) => state.api.juzz);

  // Transform API data to match SurahCard props
const items = React.useMemo(() => {
  if (!surahsData || !Array.isArray(surahsData)) return [];

  return surahsData?.map((surah) => ({
    number: surah?.index ?? "",
    titleEn: surah?.name ?? "",
    id: surah?._id ?? "",
    titleAr: surah?.arabicName ?? "",
    ayahsText: surah?.ayahsCount ? `${surah.ayahsCount} Ayahs` : "",
    questionsText: surah?.questionsCount ? `${surah.questionsCount} Questions` : "",
    thumbnail: surah?.icon || "/images/sample-image.png",
    star: surah?.score ?? 0,
  }));
}, [surahsData]);

  // Transform Juzz API data to match JuzCard props
  const juzItems = React.useMemo(() => {
    if (!juzzData || juzzData.length === 0) return [];

    return juzzData.map((juz) => ({
      number: juz._id,
      titleEn: juz.name,
      titleAr: juz.meaning,
      surahsText: `${juz.chapterIds?.length || 0} Surahs`,
      questionsText: "2 Quiz", // Hardcoded as not in API
      thumbnail: juz.icon || "/images/sample-image.png",
    }));
  }, [juzzData]);
  return (
    <>
      <Head>
        <title>Quran Connect</title>
      </Head>
      <div
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex items-center justify-center p-4`}
      >
        <div className="w-full">
          <MainContainer>
            <Header />
            test on vercel
            <TabNavigation activeTab={activeTab} onChange={setActiveTab} />
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 180px)" }}
            >
              {activeTab === "Surah" ? (
                items && items.length > 0 ? (
                  <CardsGrid
                    items={items}
                    renderItem={(item) => <SurahCard {...item} />}
                  />
                ) : (
                  <CardsGrid
                    items={Array.from({ length: 20 }).map((_, i) => ({
                      number: i + 1,
                    }))}
                    renderItem={() => <SurahCardSkeleton />}
                  />
                )
              ) : juzItems && juzItems.length > 0 ? (
                <CardsGrid
                  items={juzItems}
                  renderItem={(item) => <JuzCard {...item} />}
                />
              ) : (
                <CardsGrid
                  items={Array.from({ length: 20 }).map((_, i) => ({
                    number: i + 1,
                  }))}
                  renderItem={() => <SurahCardSkeleton />}
                />
              )}
            </div>
          </MainContainer>
        </div>
      </div>
    </>
  );
}
