import React from "react";
import Button from "../Button";
import { Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserAccount } from "@/reducers/apiSlice";
import { useTranslation } from "react-i18next";

const DeleteAccount = ({ closeModal }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.api.user);

  const handleDelete = async () => {
    const response = await dispatch(deleteUserAccount(profile))?.unwrap();
    closeModal();
  };
  return (
    <div className="text-center">
      <div className="mb-3">
        <img
          src="/images/mqj-warning-icon.svg"
          className="img-fluid"
          alt="Bottom Icon"
        />
      </div>
      <p className="text-center morningRanbow quiz-heading text-uppercase">
        {t('DeleteAccount')}
      </p>
      <p className="fs-5 text-white morningRanbow">
        {t('DeleteAccount1')}
      </p>
      <p className="fs-5 text-white morningRanbow">
        {t('DeleteAccount2')}
      </p>
      <div
        className="d-flex position-absolute justify-content-around gap-3"
        style={{ bottom: "-43px", right: 0, left: 0 }}
      >
        <Button variant="primary" onClick={() => closeModal()}>
          <X strokeWidth="6px" size={30} />
        </Button>
        <Button variant="success">
          <Check strokeWidth="6px" size={30} onClick={handleDelete} />
        </Button>
      </div>
    </div>
  );
};

export default DeleteAccount;
