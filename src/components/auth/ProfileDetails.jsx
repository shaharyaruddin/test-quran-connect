import React, { useEffect, useState } from "react";
import Input from "../Input";
import Button from "../Button";
import Dropdown from "../Dropdown";
import { countriesList } from "../../utils/Countries";
import { Check, Phone, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { editUserDetails } from "@/reducers/apiSlice";
import { useTranslation } from "react-i18next";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaGlobe,
  FaBirthdayCake,
} from "react-icons/fa";

const ProfileDetails = ({
  handleModalType,
  path,
  closeModal,
  data,
  openDeleteModal,
  profile,
}) => {
  const { t } = useTranslation("common");
  const [fullName, setFullName] = useState("");
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [dateOFBirth, setDateOFBirth] = useState("");
  const [load, setLoad] = useState(false);

  const dispatch = useDispatch();

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    const payload = {
      name: fullName,
      parentName: parentName,
      country: country,
      dob: dateOFBirth,
      phone: phone,
    };
    try {
      const response = await dispatch(editUserDetails(payload))?.unwrap();
      setLoad(false);
      closeModal();
    } catch (error) {
      setLoad(false);
      console.log("error in edit profile", error);
    }
  };
  useEffect(() => {
    if (profile?._id) {
      setFullName(profile?.name);
      setParentName(profile?.parentName);
      setEmail(profile?.email);
      setPhone(profile?.phone || "");
      setCountry(profile?.country);
      setDateOFBirth(profile?.dob);
    }
  }, [profile]);
  
  const handlePhoneChange = (e) => {
    let input = e.target.value;
    if (!input) {
      setPhone("");
      return;
    }
    input = input.replace(/[^0-9]/g, "");
    const formattedPhone = input.length > 0 ? `+${input}` : "+";
    setPhone(formattedPhone);
  };
  return (
   <form onSubmit={handleSubmit} className="d-flex justify-content-center">

  
    {/* Card */}
        <Input
          type="text"
          value={fullName}
          placeholder={t("ChildName")}
          required
icon={<FaUser className="text-success" />}
          onChange={(e) => setFullName(e.target.value)}
        />

        <Input
          type="text"
          value={parentName}
          required
          placeholder={t("ParentName")}
icon={<FaUser className="text-success" />}
          onChange={(e) => setParentName(e.target.value)}
          className="mt-3"
        />

        <Input
          type="email"
          value={email}
          required
          placeholder={t("Email")}
icon={<FaEnvelope className="text-success" />}
          disabled
          className="mt-3"

        />

        <Input
          type="tel"
          value={phone}
          required
          placeholder={t("PhoneNumber")}
icon={<FaPhoneAlt className="text-success" />}
          onChange={handlePhoneChange}
          className="mt-3"

        />

        <Dropdown
          value={country}
          required
          placeholder={t("Country")}
          options={countriesList.map((c) => ({
            value: c.code,
            label: c.name,
          }))}
icon={<FaGlobe className="text-success" />}
          onChange={handleCountryChange}
          className="mt-3"

        />

        <Input
          type="date"
          value={dateOFBirth}
          required
          placeholder="Date of Birth"
icon={<FaBirthdayCake className="text-success" />}
          onChange={(e) => setDateOFBirth(e.target.value)}
          className="mt-3"

        />

      {/* Change Password */}
<p
  className="text-center text-blue-600 text-sm mt-3 cursor-pointer"
  onClick={() => handleModalType("new-password", "profile-detail")}
>
  {t("ChangePassword")}?
</p>

{/* Action Buttons */}
<div className="flex justify-center gap-3 mt-3">
  <button
    type="button"
    onClick={closeModal}
    className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md border-2 border-gray-300 hover:bg-gray-50 transition"
  >
    <X strokeWidth="2.5" size={24} />
  </button>

  <button
    type="submit"
    disabled={load}
    className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 text-white shadow-md border  transition disabled:opacity-50"
  >
    <Check strokeWidth="2.5" size={24} />
  </button>
</div>

{/* Delete Account */}
<div className="text-center mt-4">
  <button
    type="button"
    onClick={() => openDeleteModal("delete-account")}
    disabled={load}
    className="px-4 py-2 rounded-full border border-white text-[#3DB47D] font-semibold shadow-sm hover:bg-red-50 transition disabled:opacity-50"
  >
    {t("DeleteAccount")}
  </button>
</div>

</form>

  );
};
export default ProfileDetails;
