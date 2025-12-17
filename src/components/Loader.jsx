import { Bookmark } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="card h-100 surah-card-shimmer mt-2">
      <div className="card-img-top">
        <img
          src="/images/icon-star-0.png"
          className="img-fluid"
          alt="Star Icon"
          width={83}
          style={{
            marginTop: "-37px",
          }}
        />
      </div>
      <div
        className="card-body mb-2"
        style={{
          height: "40px",
        }}
      >
        <h5>&nbsp;</h5>
      </div>
      <div className="card-img-bottom">
        <div className="card-numbers">&nbsp;</div>
      </div>
      <div
        className="position-absolute"
        style={{
          bottom: -25,
          left: "3px",
        }}
      >
        <img
          src="/images/mqj-heart-icon.svg"
          className="img-fluid"
          alt="Star Icon"
        />
      </div>
      <div
        className="position-absolute"
        style={{
          bottom: -25,
          right: 0,
          transform: "rotate(-16deg)",
          right: "3px",
        }}
      >
        <Bookmark size={27} fill="#C8C8C8" className="cursor-pointer" />
      </div>
    </div>
  );
};

export default Loader;
