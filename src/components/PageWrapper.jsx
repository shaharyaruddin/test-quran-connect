import React from "react";
import Header from "./_Header";
import Footer from "./Footer";

const PageWrapper = ({ children, iconSize = false }) => {
  return (
    <div>
      <Header iconSize={iconSize} />
      {children}
      <Footer />
    </div>
  );
};

export default PageWrapper;
