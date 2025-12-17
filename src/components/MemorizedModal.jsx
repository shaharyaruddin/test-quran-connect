import React from "react";
import Button from "./Button";
import { Check, X } from "lucide-react";

const MemorizedModal = ({
  icon,
  description,
  handleModalClose,
  handleSurah,
}) => {
  return (
    <div className="text-center py-4">
      <div className="mb-4">
        <img src={icon} width={100} />
      </div>
      <p className="text-white fs-4 text-center morningRanbow">{description}</p>
      <div
        className="d-flex position-absolute justify-content-around gap-3"
        style={{ bottom: "-40px", right: 0, left: 0 }}
      >
        <Button variant="primary" onClick={handleModalClose}>
          <X strokeWidth="6px" size={30} />
        </Button>
        <Button variant="success" onClick={handleSurah}>
          <Check strokeWidth="6px" size={30} />
        </Button>
      </div>
    </div>
  );
};

export default MemorizedModal;
