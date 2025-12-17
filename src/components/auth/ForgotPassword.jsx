import React, { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import { useDispatch } from "react-redux";
import { forgotPasswordOtp } from "@/reducers/apiSlice";
import { useTranslation } from "react-i18next";

const ForgotPassword = ({ handleModalType, path, closeModal, data }) => {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState("");
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      const payload = {
        email: email,
      };
      const response = await dispatch(forgotPasswordOtp(payload)).unwrap();
      setLoad(false);
      handleModalType("otp", "forgot-password", response?.data);
    } catch (rejectedValueOrSerializedError) {
      setLoad(false);
      console.log(rejectedValueOrSerializedError);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={email}
        required={true}
        placeholder={t('Email')}
        icon={<img src="/images/mqj-envelop-icon.svg" width={20} />}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div
        className="text-center position-absolute start-50 translate-middle"
        style={{ bottom: "-66px" }}
      >
        <Button
          variant="primary"
          text={t('Next')}
          type="submit"
          className="btn-lg p-3"
          disabled={load}
        />
      </div>
    </form>
  );
};

export default ForgotPassword;
