import React from "react";

const CardsGrid = ({ items = [], renderItem, className = "" }) => {
  return (
    <div
      className={`mt-10 grid gap-4 md:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 px-4 md:px-6 lg:px-8 ${className}`}
    >
      {items.map((item, idx) => (
        <div key={`${item?.id || item?.number || idx}`}>
          {renderItem ? renderItem(item) : null}
        </div>
      ))}
    </div>
  );
};

export default CardsGrid;
