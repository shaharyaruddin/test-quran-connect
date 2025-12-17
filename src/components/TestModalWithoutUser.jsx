import React, { useState } from "react";
import Button from "./Button";
import Modal from "./Modal"; // Import the shared Modal
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { useTranslation } from "react-i18next";
import ForgotPassword from "./auth/ForgotPassword";

const TestModalWithoutUser = () => {
  const { t } = useTranslation("common");
  const [modalType, setModalType] = useState(""); // "login" | "signup"
  const [path, setPath] = useState("");
  const [data, setData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Open Modal (using same logic as Header)
  const handleModalOpen = (type, path = "") => {
    setModalType(type);
    setPath(path);
    setIsOpen(true);
  };

  // Close Modal
  const handleModalClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setModalType("");
      setPath("");
      setData(null);
    }, 300);
  };

  // Switch modal type
  const handleModalType = (type, path = "", data = null) => {
    setModalType(type);
    setPath(path);
    setData(data);
  };

  return (
    <>
      {/* ===== Card Section ===== */}
      <div className="flex justify-center items-center p-6">
        <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-2xl p-10 text-center w-full transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(35,114,185,0.5)]">
          <h3 className="text-3xl font-extrabold text-[#2372B9] mb-3 tracking-wide">
            {t("LoginToTrackYourProgress")}
          </h3>

          <p className="text-gray-600 mb-8 text-base leading-relaxed max-w-md mx-auto">
            {/* TRANSLATION NOT WORKING ON PROD */}
            {/* {t("LoginToTrackYourProgressText")} */}
            To access more Surahs and take tests to track your progress, please
            log into your account.
          </p>

          <div className="flex flex-col items-center space-y-5">
            {/* Login Button */}
            <Button
              onClick={() => handleModalOpen("login", "test")}
              className="bg-[#3DB47D] hover:bg-[#34a06f] text-white font-semibold px-8 py-3 rounded-xl shadow-lg w-fit transition-all duration-300 hover:scale-105"
            >
              {t("Login")}
            </Button>

            <p className="text-gray-700 font-semibold text-sm">
              {/* TRANSLATION NOT WORKING ON PROD */}
              {/* {t("DonthaveanAccount")} */}
              Don't have an Account?
            </p>

            {/* Signup Button */}
            <Button
              onClick={() => handleModalOpen("signup", "test")}
              className="bg-[#2372B9] hover:bg-[#1f65a6] text-white font-semibold px-8 py-3 rounded-xl w-fit transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {t("Signup")}
            </Button>
          </div>
        </div>
      </div>

      {/* ===== Reusable Modal ===== */}
      {isOpen && modalType && (
        // <Modal
        //   title={
        //     modalType === "login"
        //       ? t("Login")
        //       : modalType === "signup"
        //       ? t("CreateAccount")
        //       : ""
        //   }
        //   description={
        //     modalType === "login"
        //       ? t("LoginText")
        //       : modalType === "signup"
        //       ? t("CreateAccountText")
        //       : ""
        //   }
        //   isOpen={isOpen}
        //   closeModal={handleModalClose}
        // >
        <Modal
          title={
            modalType === "login"
              ? t("Login")
              : modalType === "signup"
              ? t("CreateAccount")
              : t("ForgotPassword")
          }
          description={
            modalType === "login"
              ? t("LoginText")
              : modalType === "signup"
              ? t("CreateAccountText")
              : t("ForgotPasswordText")
          }
          isOpen={isOpen}
          closeModal={handleModalClose}
        >
          {modalType === "login" && (
            <Login
              handleModalType={handleModalType}
              path={path}
              closeModal={handleModalClose}
              data={data}
            />
          )}
          {modalType === "signup" && (
            <Signup
              handleModalType={handleModalType}
              path={path}
              closeModal={handleModalClose}
              data={data}
            />
          )}
          {modalType === "forgot-password" && (
            <ForgotPassword
              handleModalType={handleModalType}
              path={path}
              closeModal={handleModalClose}
              data={data}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default TestModalWithoutUser;
