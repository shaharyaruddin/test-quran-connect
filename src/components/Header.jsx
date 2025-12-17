"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, UserRound, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, setIsModalOpen, LogoutUser } from "@/reducers/apiSlice"; // ✅ make sure LogoutUser exists
import Signup from "./auth/Signup";
import Modal from "./Modal";
import Login from "./auth/Login";
import Otp from "./auth/Otp";
import ForgotPassword from "./auth/ForgotPassword";
import NewPassword from "./auth/NewPassword";
import ProfileDetails from "./auth/ProfileDetails";
import BookMarkModal from "./BookMarkModal";
import GetStarted from "./GetStarted";
import { t } from "i18next";
import IconBadge from "./IconBadge";
import { CgProfile } from "react-icons/cg";

const Header = () => {
  const [modalType, setModalType] = useState("");
  const [path, setPath] = useState("");
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpenState] = useState(false); // renamed to avoid conflict
  const profile = useSelector((state) => state.api.user);
  const bookmarkAyah =
    useSelector((state) => state.api.bookMarkAyah)?.length || 0;
  const bookmarkSurah =
    useSelector((state) => state.api.bookMarkSurah)?.length || 0;
  const bookmarkCount = bookmarkAyah + bookmarkSurah;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // ✅ Open Modal
  const handleModalOpen = (type, path = "", data = null) => {
    setModalType(type);
    setPath(path);
    setData(data);
    setIsModalOpenState(true);
    dispatch(setIsModalOpen(true));
  };

  // ✅ Close Modal
  const handleModalClose = () => {
    setIsModalOpenState(false);
    setTimeout(() => {
      setModalType("");
      setPath("");
      setData(null);
      dispatch(setIsModalOpen(false));
    }, 300);
  };

  // Change modal content dynamically
  const handleModalType = (type, path = "", data = null) => {
    setModalType(type);
    setPath(path);
    setData(data);
  };

  //  Logout handler
  const logout = async () => {
    try {
      await dispatch(LogoutUser()).unwrap(); // assuming LogoutUser clears user & token
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <>
      {/* Header Layout */}
      <div className="flex items-center justify-between w-full mb-6 px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Quran Connect Logo"
              width={150}
              height={48}
              className="h-8 sm:h-10 md:h-12 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          {/* If user is logged in → show Logout */}
          {profile ? (
            <>
              <button
                onClick={logout}
                className="flex font-amiri items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">{t("Logout")}</span>
              </button>

              {/* PROFILE SETTTING */}

              <button
                onClick={() => handleModalOpen("profile")}
                className="flex font-amiri items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
              >
                <CgProfile size={20} />
              </button>

              <IconBadge
                icon={<Bookmark size={22} />} // use icon, not icon2
                count={bookmarkCount || 0}
                onClick={() => handleModalOpen("bookmarkedItems")}
              />
            </>
          ) : (
            <>
              {/* Not logged in → show Bookmark & User icons */}
              <button
                onClick={() => handleModalOpen("signup", "header")}
                className="relative font-amiri p-2 hover:bg-gray-100 rounded-full transition"
              >
                <Bookmark size={25} />
                {bookmarkCount > 0 && (
                  <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full px-1">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              <button
                className="p-2 font-amiri hover:bg-gray-100 rounded-full transition"
                onClick={() => handleModalOpen("get-started", "header")}
              >
                <UserRound size={25} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal - Only shows when isModalOpen is true */}
      {isModalOpen && modalType && (
        <Modal
          title={
            modalType === "login"
              ? t("Login")
              : modalType === "signup"
              ? t("CreateAccount")
              : modalType === "get-started"
              ? t("GetStarted")
              : modalType === "otp"
              ? t("EnterOTP")
              : modalType === "bookmarkedItems"
              ? t("bookMark")
              : modalType === "profile"
              ? t("Profile")
              : ""
          }
          description={
            modalType === "login"
              ? t("LoginText")
              : modalType === "signup"
              ? t("CreateAccountText")
              : modalType === "otp"
              ? t("OTPText")
              : ""
          }
          isOpen={isModalOpen}
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
          {modalType === "otp" && (
            <Otp
              handleModalType={handleModalType}
              path={path}
              closeModal={handleModalClose}
              data={data}
            />
          )}
          {modalType === "new-password" && (
            <NewPassword
              handleModalType={handleModalType}
              path={path}
              closeModal={handleModalClose}
              data={data}
            />
          )}
          {modalType === "profile" && (
            <ProfileDetails
              handleModalType={handleModalType}
              closeModal={handleModalClose}
              profile={profile}
            />
          )}
          {modalType === "bookmarkedItems" && (
            <BookMarkModal
              closeModal={handleModalClose}
              handleModalType={handleModalType}
            />
          )}

          {modalType === "get-started" && (
            <GetStarted handleModalType={handleModalType} />
          )}
        </Modal>
      )}
    </>
  );
};

export default Header;
