import React, { useState } from "react";
import {
  Check,
  ChevronsRight,
  CircleHelp,
  List,
  RotateCw,
  X,
} from "lucide-react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Button from "./Button";

const QuizProgress = ({
  result,
  detail,
  handleModalClose,
  handlePreview,
  setAnswer,
  setPreview,
}) => {
  console.log("result progress: ", result);

  const { t } = useTranslation("common");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(false);
  const surahs = useSelector((state) => state.api.surahs);

  const items = [
    { id: 1, range: "50-66" },
    { id: 2, range: "67-83" },
    { id: 3, range: "84-100" },
  ];

  const nextSurah = detail?.index - 1;
  const getNextSurah = surahs?.find((item) => item?.index === nextSurah);

  const   handleNextSurah = () => {
    router.push(`/surah/${getNextSurah?._id}?tab=arabic`);
  };

  const getProgressImage = (value) => {
    const percent = typeof value === "string" ? parseFloat(value) : value;

    if (percent >= 0 && percent < 25) return "/images/mqj-star-0.png";
    if (percent >= 25 && percent < 50) return "/images/mqj-star-25.png";
    if (percent >= 50 && percent < 75) return "/images/mqj-star-50.png";
    if (percent >= 75 && percent <= 100) return "/images/mqj-star-100.png";
    return "/images/mqj-star-0.png";
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {!activeTab ? (
        <div className="relative flex  flex-col items-center justify-center text-center w-full h-full">
          {/* Star Icon */}
          <div className="absolute z-50 -top-20 left-0 right-0 flex justify-center">
            <img
              src={getProgressImage(result?.score)}
              alt="Star Icon"
              className="w-40 z-[999px]"
            />
          </div>

          {/* Quiz Result */}
          <div className="text-center mt-6">
            <div className="flex items-center gap-2 justify-center">
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-[#076CB7] uppercase">
                {result?.result}
              </p>

              <CircleHelp
                size={20}
                onClick={() => setActiveTab(true)}
                className="cursor-pointer hover:text-blue-400"
              />
            </div>
            <p className="flex justify-center items-center gap-2 text-2xl text-gray-500 font-bold mt-1">
              {t("Score")}
              <span className="text-3xl font-bold text-[#3DB47D]">
                {result?.progress}
              </span>
            </p>
            <p className="text-lg text-[#3DB47D] font-semibold mt-1">
              Surah {detail?.index}. {detail?.name}
            </p>
          </div>

          {/* Surah Icon */}
          <div className="my-3">
            <img
              src={detail?.icon}
              alt="Surah Icon"
              className="w-28 h-28 object-cover mx-auto"
            />
          </div>

          {/* Bottom Decoration */}
          <div className="absolute bottom-3 right-2 opacity-20">
            <img
              src="/images/mqj-vector-5-icon.svg"
              alt="Bottom Icon"
              className="w-8"
            />
          </div>

          {/* Bottom Buttons */}
          <div className="z-50 absolute -bottom-26">
            <div className=" flex justify-center gap-4">
              <Button
                variant="primary"
                onClick={() => {
                  handleModalClose();
                  setAnswer([]);
                  setPreview(false);
                }}
                className="p-3 border rounded-full bg-white text-[#3DB47D] shadow-md"
              >
                <RotateCw size={26} strokeWidth={3} />
              </Button>

              <Button
                variant="primary"
                onClick={() => {
                  handleModalClose();
                  router.push("/");
                }}
                className="p-3 rounded-full bg-white text-[#3DB47D] shadow-md"
              >
                <List size={26} strokeWidth={3} />
              </Button>

              {parseFloat(result?.progress) >= 50 && (
                <Button
                  variant="success"
                  onClick={() => {
                    handleModalClose();
                    handleNextSurah();
                  }}
                  className="p-3 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-md"
                >
                  <ChevronsRight size={26} strokeWidth={3} />
                </Button>
              )}
            </div>
          </div>
          <div className="absolute -bottom-40">
            <Button
              variant="warning"
              onClick={handlePreview}
              className="border-3 cursor-pointer border-t-0 border-b-[#076CB7] text-[#076CB7] bg-white px-6 py-2 rounded-full font-semibold"
            >
              {t("ReviewAnswers")}
            </Button>
          </div>
        </div>
      ) : (
        // Review Tab
        <div className="relative w-full h-full text-center flex flex-col items-center justify-center">
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-4">
            {/* {t("ScoreOverview")} */}
            SCORE OVERVIEW
          </p>

          {/* Top Decoration */}
          <div className="absolute top-6 left-6 opacity-20">
            <img
              src="/images/mqj-vector-6-icon.svg"
              alt="Icon"
              className="w-8"
            />
          </div>

          {/* Pass/Fail Boxes */}
          <div className="flex flex-col gap-3 py-4 w-full">
            {/* Failed */}
            <div className="bg-white rounded-2xl px-4 py-3 mx-6 shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="bg-red-500 hover:bg-red-600 p-2 rounded-full text-white">
                  <X size={18} strokeWidth={5} />
                </button>
                <span className="text-lg font-semibold text-red-600">
                  {t("Failed")}
                </span>
              </div>
              <span className="text-red-600 font-semibold">0–49%</span>
            </div>

            {/* Pass */}
            <div className="bg-white rounded-2xl px-4 py-3 mx-6 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="bg-green-500 hover:bg-green-600 p-2 rounded-full text-white">
                    <Check size={18} strokeWidth={5} />
                  </button>
                  <span className="text-lg font-semibold text-green-700">
                    {t("Pass")}
                  </span>
                </div>
                <span className="text-green-700 font-semibold">50–100%</span>
              </div>

              {/* Stars Breakdown */}
              {items.map((starCount, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mt-2 ml-12"
                >
                  <div className="flex items-center gap-1">
                    {Array.from({ length: starCount.id }).map((_, i) => (
                      <img key={i} src="/images/star-1.svg" alt="star" />
                    ))}
                  </div>
                  <span className="text-black font-semibold">
                    {starCount.range}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Decoration */}
          <div className="absolute bottom-4 right-2 opacity-20">
            <img
              src="/images/mqj-vector-5-icon.svg"
              alt="Bottom Icon"
              className="w-8"
            />
          </div>

          {/* Close Button */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => setActiveTab(false)}
              className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-full"
            >
              <X size={26} strokeWidth={5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizProgress;
