import React from "react";

const items = [
  {
    key: "arabic",
    color: "#39BA92",
    label: "Arabic",
    iconSrc: "/icons/arabic.svg",
  },
  {
    key: "ayahs",
    color: "#2372B9",
    label: "Ayahs",
    iconSrc: "/icons/ayahs.svg",
  },
  {
    key: "words",
    color: "#39BA92",
    label: "Words",
    iconSrc: "/icons/words.svg",
  },
  {
    key: "lessons",
    color: "#2372B9",
    label: "Lessons",
    iconSrc: "/icons/lessons.svg",
  },
  { key: "quiz", color: "#39BA92", label: "Quiz", iconSrc: "/icons/quiz.svg" },
];

const DetailSidebar = ({ activeView = "arabic", onChangeView }) => {
  return (
    <div className="flex flex-row md:flex-col gap-3 mt-2">
      {items.map((it) => {
        const isActive = it.key === activeView;
        return (
          <button
            key={it.key}
            onClick={() => onChangeView?.(it.key)}
            className={`flex flex-col items-center justify-center w-full py-3 rounded-tl-[5px] rounded-bl-[5px] shadow-sm bg-white text-gray-700 transition-all duration-300 ease-in-out transform focus:scale-110 ${
              isActive
                ? "scale-110 shadow-md border-l-4 border-[#39BA92] bg-gray-200"
                : "scale-100"
            }`}
          >
            <img
              src={it.iconSrc}
              alt={it.label}
              width={isActive ? 40 : 35}
              className="transition-all duration-300"
            />
            <span
              className="text-[12px]  font-medium mt-1 font-calsans"
              style={{ color: it.color }}
            >
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DetailSidebar;
