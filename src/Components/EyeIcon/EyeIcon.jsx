// EyeIcon.jsx
import React from "react";

const EyeIcon = ({ isVisible, toggleVisibility }) => (
   <div
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
      onClick={toggleVisibility}>
      {isVisible ? (
         <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
         </svg>
      ) : (
         <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 12c4-8 11-8 11-8s1 2.09 2.51 4.63" />
            <line x1="2" y1="2" x2="22" y2="22" />
         </svg>
      )}
   </div>
);

export default EyeIcon;
