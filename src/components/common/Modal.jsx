import React from "react";

const Modal = ({ children, title, onBack, showBack = true }) => {
   return (
      <div className="full-background">
         <div className="o-container py-8">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-md mx-auto">
               <div className="flex items-center mb-6">
                  {showBack && (
                     <button
                        onClick={onBack}
                        className="text-gray-400 hover:text-white mr-4">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           className="h-6 w-6"
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke="currentColor">
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                           />
                        </svg>
                     </button>
                  )}
                  {title && (
                     <h2 className="text-xl font-bold text-white">{title}</h2>
                  )}
               </div>
               {children}
            </div>
         </div>
      </div>
   );
};

export default Modal;
