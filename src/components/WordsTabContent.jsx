import {
  textBasedOnLanguage,
  textBasedOnLanguageForJuzz,
  toArabicNumber,
} from "@/utils/helper";
import ArabicWordsCard from "./ArabicWordsCard";
import { useSelector } from "react-redux";
import AyatsLoader from "./AyatsLoader";

const WordsTabContent = ({
  words,
  language,
  fontSize,
  bismillah,
  scripts,
  type,
  id,
  loader,
  ayats,
  languageId,
}) => {
  const surahs = useSelector((state) => state.api.surahs);

  const textBasedOnScriptForWord = (word, script) => {
    return word?.scripts?.find((s) => s?.scriptId === script)?.text || "";
  };

  const englishScript = "67fde5c131fdd14db9aa6836";

  const findCurrentSurah = surahs?.find((item) => item?._id === id);
  const checkSurah9 = findCurrentSurah?.index === 9;

  //fontSize
  const minFontSize = 10; // Minimum font size in pixels
  const maxFontSize = 80; // Maximum font size in pixels
  const sizeAdjustment = 5; // Add 5px to make it bigger

  let calculatedFontSize =
    minFontSize +
    (maxFontSize - minFontSize) * (fontSize / 100) +
    sizeAdjustment;
  const translationFontSize = calculatedFontSize / 2;

  const bismillahLanguage = (data, lang) => {
    const languageTranslation = data?.translations?.find(
      (item) => item.language === lang
    );
    return languageTranslation?.text;
  };

  console.log("languageIdddddddddd", languageId);
  console.log("fd", language);

  return (
    <>
      <div className="mt-2">
        <div className="flex flex-col gap-2 w-full" dir="rtl">
          <div className="flex flex-col w-full gap-2">
            {/* Word cards */}
            <div className="flex flex-col flex-wrap w-full gap-4">
              {loader ? (
                <AyatsLoader />
              ) : type === "juzz" ? (
                [
                  ...new Set(words && words?.map((option) => option?.surahId)),
                ]?.map((surahId) => {
                  const findSpecificSurah = surahs?.find(
                    (item) => item?._id === surahId
                  );

                  const chapterWords = words?.filter(
                    (word) => word?.surahId === surahId
                  );

                  const ayatsInSurah = ayats?.filter(
                    (a) => a?.surahId?._id === surahId
                  );

                  console.log("check>>>>>>>>>", ayatsInSurah[0]);

                  return (
                    <div key={surahId} className="px-3 py-0">
                      <div
                        className="flex justify-between items-center"
                        dir="ltr"
                      >
                        <h2 className="text-purple-outline mt-4">
                          {findSpecificSurah?.index}-{findSpecificSurah?.name}
                        </h2>
                        <h2 className="text-purple-outline mt-4 text-center">
                          {toArabicNumber(findSpecificSurah?.index)}-{" "}
                          {findSpecificSurah?.arabicName}
                        </h2>
                      </div>

                      <div className="flex gap-2 mb-2 w-full flex-grow">
                        {ayatsInSurah[0]?.ayatIndex === 1 &&
                          ayatsInSurah[0]?.surahId?.index !== 9 &&
                          bismillah?.words?.map((item, index) => (
                            <div className="w-full" key={index}>
                              <ArabicWordsCard
                                ayahWordArabic={textBasedOnScriptForWord(
                                  item,
                                  scripts
                                )}
                                ayahWordEnglish={bismillahLanguage(
                                  item,
                                  languageId
                                )}
                                fontSize={calculatedFontSize + 6}
                                script={scripts}
                              />
                            </div>
                          ))}
                      </div>

                      {/* Render words for this surah */}
                      <div
                        dir={scripts === englishScript ? "ltr" : "rtl"}
                        className="flex flex-wrap w-full gap-2 justify-between"
                      >
                        {chapterWords.map((item, index) => {
                          const currentAyatIndex = item?.ayat?.ayatIndex;
                          const nextItem = chapterWords[index + 1];
                          const nextAyatIndex = nextItem?.ayat?.ayatIndex;

                          const showAyahNumber =
                            currentAyatIndex !== nextAyatIndex;

                          return (
                            <div key={index} className="flex-auto">
                              <ArabicWordsCard
                                ayahWordArabic={textBasedOnScriptForWord(
                                  item,
                                  scripts
                                )?.replace(/—/g, " ")}
                                ayahWordEnglish={textBasedOnLanguageForJuzz(
                                  item,
                                  languageId
                                )}
                                fontSize={calculatedFontSize + 6}
                                script={scripts}
                                ayahNumber={toArabicNumber(
                                  showAyahNumber ? currentAyatIndex : ""
                                )}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  dir={scripts === englishScript ? "ltr" : ""}
                  className="flex flex-wrap w-full gap-2"
                >
                  <div
                    dir={scripts === englishScript ? "ltr" : ""}
                    className="flex w-full gap-2"
                  >
                    {!checkSurah9 &&
                      bismillah?.words?.map((item, index) => (
                        <div className="w-full" key={index}>
                          <ArabicWordsCard
                            ayahWordArabic={textBasedOnScriptForWord(
                              item,
                              scripts
                            )}
                            ayahWordEnglish={bismillahLanguage(
                              item,
                              languageId
                            )}
                            fontSize={calculatedFontSize + 4}
                            script={scripts}
                          />
                        </div>
                      ))}
                  </div>

                  <div
                    dir={scripts === englishScript ? "ltr" : ""}
                    className="flex flex-wrap w-full gap-2 justify-between"
                  >
                    {words?.map((item, index) => {
                      const currentAyatIndex = item?.ayatId?.ayatIndex;
                      const nextItem = words[index + 1];
                      const nextAyatIndex = nextItem?.ayatId?.ayatIndex;
                      const showAyahNumber = currentAyatIndex !== nextAyatIndex;

                      return (
                        <div key={index} className="flex-auto">
                          <ArabicWordsCard
                            ayahWordArabic={textBasedOnScriptForWord(
                              item,
                              scripts
                            )?.replace(/—/g, " ")}
                            ayahWordEnglish={textBasedOnLanguage(
                              item,
                              language
                            )}
                            fontSize={calculatedFontSize + 4}
                            script={scripts}
                            ayahNumber={toArabicNumber(
                              showAyahNumber ? currentAyatIndex : ""
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WordsTabContent;
