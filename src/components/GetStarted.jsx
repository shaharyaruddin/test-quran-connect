import React from "react";
import { useTranslation } from "react-i18next";

const GetStarted = ({ handleModalType }) => {

    const { t } = useTranslation("common");
  

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      <form className="flex flex-col gap-3 w-full max-w-md items-center">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-[#2372B9] text-center">
          Login To Track Your Progress
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-center text-sm leading-relaxed">
          To access more Surahs and take tests to track your progress, please
          log into your account test
        </p>

        {/* Login Button */}
        <button
          type="button"
          onClick={() => handleModalType("login")}
          className="w-32 bg-white hover:bg-gray-50 text-[#3DB47D] font-bold text-xl py-3 rounded-full border-t-[1px] border-b-4 border-[#3DB47D] shadow-md transition duration-200 mx-auto"
        >
          {t("Login")}
        </button>

        {/* Sign Up Section */}
        <div className="text-center">
          <span className="text-gray-700 text-sm">Don't have an Account? </span>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => handleModalType("signup")}
              className="w-32 bg-white hover:bg-gray-50 text-[#3DB47D] font-bold text-xl py-3 rounded-full border-t-[1px] border-b-4 border-[#3DB47D] shadow-md transition duration-200 mx-auto"
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GetStarted;
