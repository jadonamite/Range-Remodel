import React from "react";
import { Link } from "react-router-dom";
import "../../index.css";
import logo from "../../assets/logo.png";
import "./WalletCreated.css"; // Import the CSS file

const WalletCreated = () => {
   return (
      <div className="body full-background">
         <div className="o-container rounded-xl">
            <div className="px-8 py-10 text-center grid gap-6">
               <div className="flex justify-center mb-6">
                  <img src={logo} alt="" className="logo-animated" />
               </div>
               <div>
                  <h1 className="text-2xl font-bold text-white mb-4">
                     Congratulations
                  </h1>
                  <p className="text-gray-400 mb-8 mx-auto">
                     Your wallet has been added successfully
                  </p>
               </div>
               <div className="space-y-4 mt-10">
                  <Link to="/wallet" className="primary-btn">
                     Continue to Wallet
                  </Link>
                  <Link to="/Portfolio" className="tertiary-btn">
                     Check out your Portfolio
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default WalletCreated;
