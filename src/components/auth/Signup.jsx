import React, { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import { SignUpUser } from "@/reducers/apiSlice";
import { useDispatch } from "react-redux";
import Dropdown from "../Dropdown";
import { countriesList } from "../../utils/Countries";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Signup = ({ handleModalType }) => {
  const { t } = useTranslation("common");

  const [childName, setchildName] = useState("");
  const [parentName, setParentName] = useState("");
  const [country, setCountry] = useState("");
  const [dateOFBirth, setDateOFBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [load, setLoad] = useState(false);

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  // ---------------- VALIDATION FUNCTION ----------------
  const validateFields = () => {
    let newErrors = {};

    if (!childName.trim()) newErrors.childName = "Child name is required";
    else if (/\d/.test(childName))
      newErrors.childName = "Name cannot contain numbers";

    if (!parentName.trim()) newErrors.parentName = "Parent name is required";
    else if (/\d/.test(parentName))
      newErrors.parentName = "Name cannot contain numbers";

    if (!country) newErrors.country = "Please select a country";

    if (!dateOFBirth) newErrors.dob = "Date of Birth is required";
    else if (new Date(dateOFBirth) > new Date())
      newErrors.dob = "Date of Birth cannot be in the future";

    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm password";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ---------------- FORM SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoad(true);

    try {
      const payload = {
        email,
        password,
        parentName,
        country,
        confirmPassword,
        name: childName,
        dob: dateOFBirth,
        device: "web",
      };

      const response = await dispatch(SignUpUser(payload)).unwrap();
      setLoad(false);
      handleModalType("otp", "signup", response?.data);
    } catch (error) {
      setLoad(false);
      console.log(error);
      toast.error("Signup failed");
    }
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative">

      {/* CHILD NAME */}
      <Input
        type="text"
        value={childName}
        placeholder={t("ChildName")}
        required
        icon={<img src="/images/user.png" width={20} />}
        onChange={(e) => setchildName(e.target.value)}
      />
      {errors.childName && (
        <p className="text-red-500 text-sm">{errors.childName}</p>
      )}

      {/* PARENT NAME */}
      <Input
        type="text"
        value={parentName}
        placeholder={t("ParentName")}
        required
        icon={<img src="/images/user.png" width={20} />}
        onChange={(e) => setParentName(e.target.value)}
      />
      {errors.parentName && (
        <p className="text-red-500 text-sm">{errors.parentName}</p>
      )}

      {/* COUNTRY */}
      <Dropdown
        value={country}
        required
        placeholder={t("Country")}
        options={countriesList.map((country) => ({
          value: country.code,
          label: country.name,
        }))}
        icon={<img src="/images/country.png" width={20} />}
        onChange={handleCountryChange}
        className="w-full"
      />
      {errors.country && (
        <p className="text-red-500 text-sm">{errors.country}</p>
      )}

      {/* DOB */}
      <Input
        type="date"
        value={dateOFBirth}
        required
        placeholder="Date of Birth"
        icon={<img src="/images/date.png" width={20} />}
        onChange={(e) => setDateOFBirth(e.target.value)}
      />
      {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}

      {/* EMAIL */}
      <Input
        type="email"
        value={email}
        required
        placeholder={t("Email")}
        icon={<img src="/images/email.png" width={20} />}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      {/* PASSWORD */}
      <Input
        type="password"
        value={password}
        required
        placeholder={t("Password")}
        icon={<img src="/images/password.png" width={20} />}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password}</p>
      )}

      {/* CONFIRM PASSWORD */}
      <Input
        type="password"
        value={confirmPassword}
        required
        placeholder={t("Confirm Password")}
        icon={<img src="/images/password.png" width={20} />}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {errors.confirmPassword && (
        <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
      )}

      {/* SUBMIT BUTTON */}
      <div className="w-full flex justify-center items-center mt-4 absolute left-1/2 transform -translate-x-1/2 -bottom-26">
        <Button
          variant="primary"
          text={load ? "Loading..." : "Signup"}
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

export default Signup;
