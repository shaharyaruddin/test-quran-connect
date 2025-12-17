import React from "react";
import { createPortal } from "react-dom";

const Modal = ({
  id,
  title,
  description,
  children,
  closeModal,
  isOpen = false, // New prop to control modal visibility
  type = "normal", // "normal" or "blue"
  hideClose = false,
  className = "",
  image = "", // Image on top
  buttonText = "Close",
  headingClass = "text-blue-600 text-2xl font-bold",
  link = "#", // optional link for button
}) => {
  if (!isOpen) return null; // Don't render modal if not open

  const modalContent = (
    <div
      id={id}
      aria-hidden="true"
      tabIndex="-1"
      className={`fixed inset-0 flex items-center justify-center z-30 bg-black/50 ${className}`}
    >
      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-white border-8 border-l-[#3DB47D] border-t-[#3DB47D] border-[#2372B9] rounded-3xl shadow-lg relative">
          {/* Top Image/Badge */}
          {image && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <img
                src={image}
                alt="modal-top"
                className="w-16 h-16 rounded-full border-4 border-white shadow-md"
              />
            </div>
          )}

          {/* Close Button */}
          {!hideClose && (
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 z-50 focus:outline-none"
              onClick={closeModal}
            >
              <img src="/images/mqj-close-icon.svg" width={20} alt="Close" />
            </button>
          )}

          {/* Content */}
          <div className={`pt-12 pb-6 px-6 text-center`}>
            <div className="absolute left-[42%] -top-38 z-30 ">
              <img className="w-20 h-24" src="/images/banner.png" alt="" />
            </div>
            <div className="absolute z-10 -top-24 left-1/2 transform -translate-x-1/2 curved-rectangle-2" />
            <div className=" absolute -top-12 left-1/2 transform -translate-x-1/2 curved-rectangle">
              {title && <h2 className={headingClass}>{title}</h2>}
            </div>

            {/* {description && <p className="text-gray-600 mt-2">{description}</p>} */}

            {title && (
              <p className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 text-2xl font-bold text-white mt-2 uppercase">
                {title}
              </p>
            )}

            <div className="mt-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
  return createPortal(modalContent, document.body);
};

export default Modal;
