import React from "react";
import Button from "./Button";
import { X } from "lucide-react";

const HeaderButtonModal = ({ title, description, imagePath, closeModal }) => {
  return (
    <>
      <div className="position-relative py-4 px-0 ">
        <div
          className="position-absolute"
          style={{
            bottom: "98%",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={imagePath}
            className="img-fluid"
            alt="Star Icon"
            width={100}
          />
        </div>
        <div
          className=" position-absolute"
          style={{
            top: -25,
            left: -10,
            opacity: 0.2,
          }}
        >
          <img
            src="/images/mqj-vector-6-icon.svg"
            className="img-fluid"
            alt="Bottom Icon"
            width={30}
          />
        </div>
        <p className="text-center morningRanbow quiz-heading text-uppercase">
          {title}
        </p>
        <p className="text-white fs-4 text-center morningRanbow">
          {description}
        </p>
      </div>
      <div
        className=" position-absolute"
        style={{
          bottom: 10,
          right: 8,
          opacity: 0.2,
        }}
      >
        <img
          src="/images/mqj-vector-5-icon.svg"
          className="img-fluid"
          alt="Bottom Icon"
          width={30}
        />
      </div>
      <div
        className="d-flex position-absolute justify-content-center "
        style={{ bottom: "-40px", right: 0, left: 0 }}
      >
        <Button variant="primary" onClick={() => closeModal()}>
          <X strokeWidth="6px" size={30} />
        </Button>
      </div>
    </>
  );
};

export default HeaderButtonModal;
