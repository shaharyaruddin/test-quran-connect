import React from "react";

const TABS = ["Surah", "Juz"];

const TabNavigation = ({ activeTab = "Surah", onChange }) => {
  const handleClick = (tab) => {
    if (tab !== activeTab) onChange?.(tab);
  };

  const activeIndex = TABS.indexOf(activeTab);

  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      {/* Tabs Row - centered exactly above the bar */}
      <div className="mx-auto w-[88%] md:w-[72%] grid grid-cols-2 place-items-center mb-3 select-none">
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => handleClick(tab)}
              className={`text-xl md:text-2xl font-amiri font-bold transition-colors duration-200 ${
                isActive ? "text-[#39BA92]" : "text-gray-700"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Pill Progress Bar */}
      <div className="mx-auto w-[88%] md:w-[72%] h-3 bg-gray-200 rounded-full relative overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full w-1/2 bg-[#39BA92] rounded-full transition-transform duration-300`}
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
      </div>
    </div>
  );
};

export default TabNavigation;
