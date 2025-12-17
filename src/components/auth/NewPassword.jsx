import React, { useState } from "react";
import Input from "../Input";
import toast from "react-hot-toast";
import { changePassword, setNewPassword } from "@/reducers/apiSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaLock } from "react-icons/fa";

const NewPassword = ({ handleModalType, path, closeModal, data }) => {
  const { t } = useTranslation('common');
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [cofirmPassword, setCofirmPassword] = useState("");
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      if (password !== cofirmPassword) {
        toast.error("Password and Confirm Password doesn't match.");
        return;
      }
      if (password.length < 8) {
        toast.error("Password must be 8 characters");
        return;
      }
      if (currentPassword === password) {
        toast.error("Current password and New password can't be same");
        return;
      }
      if (data?.type === "forgot") {
        const payload = {
          email: data?.email,
          userId: data?._id,
          type: "forgot",
          password: password,
          confirmPassword: cofirmPassword,
        };
        const response = await dispatch(setNewPassword(payload)).unwrap();
        setLoad(false);
        handleModalType("login", "new-password");
      }
      if (path === "profile-detail") {
        const payload = {
          existingPassword: currentPassword,
          newPassword: password,
          confirmNewPassword: cofirmPassword,
        };
        const response = await dispatch(changePassword(payload)).unwrap();
        closeModal();
      }
    } catch (error) {
      setLoad(false);
      console.log(error);
    }
  };
  console.log("path", path);
  console.log("object", data);
  return (
  <form onSubmit={handleSubmit} className="relative flex flex-col gap-3">

  {path === "profile-detail" && (
    <Input
      type="password"
      value={currentPassword}
      required
      placeholder={t("CurrentPassword")}
      icon={<FaLock className="text-green-500" />}
      onChange={(e) => setCurrentPassword(e.target.value)}
    />
  )}

  <Input
    type="password"
    value={password}
    required
    placeholder={t("NewPassword")}
    icon={<FaLock className="text-green-500" />}
    onChange={(e) => setPassword(e.target.value)}
  />

  <Input
    type="password"
    value={cofirmPassword}
    required
    placeholder={t("ConfirmNewPassword")}
    icon={<FaLock className="text-green-500" />}
    onChange={(e) => setCofirmPassword(e.target.value)}
  />

  {/* Submit Button */}
  <div className="flex justify-center mt-6">
    <button
      type="submit"
      disabled={!password || !cofirmPassword || load}
      className="
        w-32 py-3
        bg-white text-green-500 font-bold text-lg
        rounded-full
        border-t border-b-4 border-green-500
        shadow-md
        transition
        hover:bg-gray-50
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      {t("NEXT")}
    </button>
  </div>
</form>

  );
};

export default NewPassword;
