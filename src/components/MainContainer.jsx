import React from "react";

const MainContainer = ({ children, className = "", isColor = true }) => {
  return (
    <div
      className={`${
        isColor ? "bg-white/90 shadow-xl p-6 my-8 min-h-[90vh]" : "mt-0"
      } backdrop-blur-sm rounded-2xl mx-auto w-full md:w-[80%] ${className}`}
    >
      {children}
    </div>
  );
};

export default MainContainer;
