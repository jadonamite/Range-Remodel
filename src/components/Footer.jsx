// components/Footer.jsx

import React from "react";

const Footer = () => {
   return (
      <footer className="bg-gray-800 text-white p-4">
         <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} Range Wallet</p>
         </div>
      </footer>
   );
};

export default Footer;
