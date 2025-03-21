import React from "react";

const Loading = ({ message = "Loading..." }) => {
   return (
      <div className="full-background">
         <div className="o-container py-8 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-white text-lg">{message}</p>
         </div>
      </div>
   );
};

export default Loading;
