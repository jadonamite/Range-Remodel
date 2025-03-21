import React from "react";

const SeedPhraseInput = ({
   index,
   value,
   onChange,
   isFocused,
   onFocus,
   showText,
   onShowText,
   onHideText,
}) => {
   return (
      <div className="relative">
         <div className="flex items-center">
            <span className="text-gray-500 text-sm mr-2">{index + 1}.</span>
            <div className="relative flex-1">
               <input
                  type={showText ? "text" : "password"}
                  value={value}
                  onChange={(e) => onChange(index, e.target.value)}
                  onFocus={() => onFocus(index)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-2 py-1 w-full focus:border-purple-500 focus:outline-none"
                  autoComplete="off"
               />
               <button
                  type="button"
                  className="absolute right-2 top-1 text-gray-400 hover:text-white"
                  onMouseDown={() => onShowText(index)}
                  onMouseUp={() => onHideText(index)}
                  onMouseLeave={() => onHideText(index)}>
                  {showText ? (
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                     </svg>
                  ) : (
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                     </svg>
                  )}
               </button>
            </div>
         </div>
      </div>
   );
};

export default SeedPhraseInput;
