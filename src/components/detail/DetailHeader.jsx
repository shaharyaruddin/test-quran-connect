import React from "react";

const DetailHeader = ({ number, englishName, arabicName, data, type }) => {
  // console.log("header data", data);

  return (
    <div className="mt-2 px-4 bg-white rounded-lg py-2">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Left: number */}
        <div className="flex items-center">
          <span className="text-[30px]  font-medium text-[#2372B9] font-calsans">
            {data?.index && type === "surah"
              ? `Surah No ${String(data.index).padStart(2, "0")}`
              : data?.index}
          </span>
        </div>
        {/* Center: English name */}
        <div className="text-center">
          <h2 className="text-[30px] font-medium text-[#39BA92] font-calsans">
            {data?.name}
          </h2>
        </div>
        {/* Right: Arabic name */}
        <div className="flex justify-end">
          <div className="text-[32px] font-semibold text-[#2372B9] font-amiri">
            {data?.arabicName || data?.meaning}
          </div>
        </div>
      </div>
      {/* <div className="mt-2 h-[6px] bg-gray-200 rounded-full" /> */}
    </div>
  );
};

export default DetailHeader;
