import React from "react";

const Button2 = ({
  text = "Next",
  onClick,
  className = "",
  type = "button",
  disabled,
  icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-white text-[#3DB47D] font-semibold px-8 py-2 rounded-full shadow-[0_4px_0_0_#3DB47D] transition-all duration-200 ${className}`}
    >
      <span className="text-lg flex items-center">
        {text}
        {icon && icon}
      </span>
    </button>
  );
};

export default Button2;
