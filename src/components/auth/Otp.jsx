import React, { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import { useDispatch } from "react-redux";
import { verifyOtp } from "@/reducers/apiSlice";
import { useTranslation } from "react-i18next";

const Otp = ({ handleModalType, path, closeModal, data }) => {
  const { t } = useTranslation("common");
  const [otp, setOtp] = useState("");
  const [load, setLoad] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      const payload = {
        email: data?.email,
        otpCode: otp,
        _id: data?._id,
        type:
          path === "signup" ? "signup" : path === "login" ? "signup" : "forgot",
      };
      const response = await dispatch(verifyOtp(payload)).unwrap();
      setLoad(false);
      if (path === "signup" || path === "login") {
        closeModal();
      } else {
        handleModalType("new-password", "otp", data);
      }
    } catch (error) {
      setLoad(false);
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className=" w-50 m-auto otp-input">
        <Input
          value={otp}
          maxLength={6}
          required={true}
          type="text"
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>
      {/* <div
        className="text-center position-absolute start-50 translate-middle"
        style={{ bottom: "-66px" }}
      >
        <Button
          variant="primary"
          text={t("Next")}
          type="submit"
          className="btn-lg p-3"
          disabled={load}
        />
      </div> */}

      <div className="w-full flex justify-center items-center mt-4 absolute left-1/2 transform -translate-x-1/2 -bottom-20">
        <Button
          variant="primary"
          text="Next"
          type="submit"
          disabled={!otp}
          className={`
      h-12 px-8 
      bg-white text-[#00C4B4] font-bold text-lg 
      rounded-full border-b-4 border-[#00C4B4]
      shadow-inner shadow-black/5 hover:shadow-md 
      transition-shadow cursor-pointer select-none 
      flex items-center justify-center 
    `}
        />
      </div>
    </form>
  );
};

export default Otp;
