import React from "react";

const Button = ({
   children,
   onClick,
   disabled,
   className,
   variant = "primary",
}) => {
   const baseClasses =
      "py-3 px-6 rounded-full font-medium transition-all duration-300";

   const variantClasses = {
      primary: "bg-gradient-to-r from-purple-500 to-teal-400 text-white",
      secondary: "bg-gradient-to-r from-teal-400 to-purple-500 text-white",
      outline:
         "bg-transparent border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white",
      text: "bg-transparent text-purple-500 hover:text-teal-400",
   };

   return (
      <button
         onClick={onClick}
         disabled={disabled}
         className={`${baseClasses} ${variantClasses[variant]} ${className} ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
         }`}>
         {children}
      </button>
   );
};

export default Button;
