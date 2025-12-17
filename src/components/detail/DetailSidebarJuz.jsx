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
];

const DetailSidebarJuz = ({ activeView, onChangeView }) => {
  return (
    <div className=" flex flex-row md:flex-col gap-3 mt-2">
      {items.map((it) => {
        const isActive = it.key === activeView;
        return (
          <button
            key={it.key}
            onClick={() => onChangeView?.(it.key)}
            className={`flex flex-col items-center w-full py-3 rounded-tl-[5px] rounded-bl-[5px] shadow-sm text-gray-700 transition-all focus:scale-110 focus:bg-gray-100 duration-300 ease-in-out transform
              ${
                isActive
                  ? "bg-gray-100 scale-105 shadow-md"
                  : "bg-white focus:bg-gray-50"
              }`}
          >
            <img src={it.iconSrc} alt={it.label} className="w-6 h-6" />
            <span
              className="text-[12px] font-medium mt-1 font-calsans"
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

export default DetailSidebarJuz;
