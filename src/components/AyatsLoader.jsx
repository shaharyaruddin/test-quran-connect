import React from "react";

const AyatsLoader = () => {
  return (
    <div
      id="v-pills-tabContent"
      className="tab-content bg-gradient-purple w-100 rounded-bottom p-3 mt-3"
    >
      {/* Full Width Loader */}
      <div className="shimmer-loader large mx-auto" style={{opacity : 0.2}}></div>

      {/* Two Half-Width Loaders */}
      <div className="d-flex justify-content-between align-items-center mt-2 mx-auto" style={{width : '97.5%', opacity : 0.2}}>
        <div className="shimmer-loader half"></div>
        <div className="shimmer-loader half"></div>
      </div>

      {/* Three Third-Width Loaders */}
      <div className="d-flex justify-content-between mt-2 mx-auto" style={{width : '97.5%', opacity : 0.2}}>
        <div className="shimmer-loader third"></div>
        <div className="shimmer-loader third"></div>
        <div className="shimmer-loader third"></div>
      </div>

      {/* Single Centered Loader */}
      <div className="d-flex justify-content-center mt-2">
        <div className="shimmer-loader large" style={{opacity : 0.2}}></div>
      </div>

      {/* Three Third-Width Loaders Again */}
      {/* <div className="d-flex justify-content-between mt-2 mx-auto" style={{width : '97.5%', opacity : 0.2}}>
        <div className="shimmer-loader third"></div>
        <div className="shimmer-loader third"></div>
        <div className="shimmer-loader third"></div>
      </div> */}

      {/* Two Half-Width Loaders Again */}
      {/* <div className="d-flex justify-content-between align-items-center mt-2 mx-auto" style={{width : '97.5%', opacity : 0.2}}>
        <div className="shimmer-loader half"></div>
        <div className="shimmer-loader half"></div>
      </div> */}
    </div>
  );
};

export default AyatsLoader;
