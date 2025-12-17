import React, { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import { useDispatch } from "react-redux";
import { LoginUser } from "@/reducers/apiSlice";
import { useTranslation } from "react-i18next";

const Login = ({ handleModalType, closeModal }) => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);

  const [errors, setErrors] = useState({});

  // ---------------- VALIDATION ----------------
  const validateFields = () => {
    let newErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SUBMIT HANDLER ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoad(true);
    try {
      const payload = { email, password };
      const response = await dispatch(LoginUser(payload)).unwrap();
      setLoad(false);

      if (!response?.data?.isVerified) {
        handleModalType("otp", "login", response?.data);
      } else {
        closeModal();
      }
    } catch (error) {
      setLoad(false);
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">

      {/* EMAIL */}
      <Input
        type="email"
        value={email}
        placeholder={t("Email")}
        icon={<img src="/images/email.png" width={20} />}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
      )}

      {/* PASSWORD */}
      <div className="py-3">
        <Input
          type="password"
          value={password}
          placeholder={t("Password")}
          icon={<img src="/images/password.png" width={20} />}
          rightIcon="fal fa-eye"
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* BUTTON */}
      <div className="w-full flex justify-center items-center mt-4 absolute left-1/2 transform -translate-x-1/2 -bottom-20">
        <Button
          variant="primary"
          text={load ? "Loading..." : "Login"}
          type="submit"
          disabled={load}
          className="
            h-12 px-8 
            bg-white text-[#00C4B4] font-bold text-lg 
            rounded-full border-b-4 border-[#00C4B4]
            shadow-inner shadow-black/5 hover:shadow-md 
            transition-shadow cursor-pointer select-none 
            flex items-center justify-center
          "
        />
      </div>
    </form>
  );
};

export default Login;
