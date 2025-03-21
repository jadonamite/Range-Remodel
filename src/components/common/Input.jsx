import React, { useState } from "react";

const Input = ({
   label,
   type = "text",
   value,
   onChange,
   placeholder,
   error,
   showPasswordToggle = false,
   valid = false,
   name,
}) => {
   const [showPassword, setShowPassword] = useState(false);

   const inputType = type === "password" && showPassword ? "text" : type;

   return (
      <div className="mb-4">
         {label && <label className="block text-gray-300 mb-2">{label}</label>}
         <div className="relative">
            <input
               type={inputType}
               value={value}
               onChange={onChange}
               placeholder={placeholder}
               name={name}
               className={`bg-gray-800 border ${
                  error
                     ? "border-red-500"
                     : valid
                     ? "border-green-500"
                     : "border-gray-700"
               } 
                      text-white rounded-lg px-4 py-3 w-full focus:border-purple-500 focus:outline-none`}
            />
            {showPasswordToggle && (
               <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
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
                           d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                     </svg>
                  ) : (
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
            )}
            {valid && (
               <div className="absolute right-3 top-3">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="h-6 w-6 text-green-500"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                     />
                  </svg>
               </div>
            )}
         </div>
         {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
   );
};

export default Input;
