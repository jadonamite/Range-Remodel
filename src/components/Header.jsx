// components/Header.jsx

import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
   return (
      <header className="bg-gray-800 text-white p-4">
         <nav className="container mx-auto">
            <ul className="flex space-x-4">
               <li>
                  <Link to="/">Home</Link>
               </li>
               <li>
                  <Link to="/wallet">Wallet</Link>
               </li>
            </ul>
         </nav>
      </header>
   );
};

export default Header;
