import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import "../../index.css";
import logo from "../../assets/logo.png";

const HomePage = () => {
   return (
      <div className="body full-background">
         <div className="max-w-md w-full mx-4">
            <div className="container rounded-xl">
               <div className="px-8 py-10 text-center">
                  <div className="flex justify-center mb-6">
                     <img src={logo} alt="" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-4">
                     Your Crypto, Your Rules
                  </h1>

                  <p className="text-gray-400 mb-8 text-sm">
                     Create a new Wallet or Import an existing wallet using your
                     seedphrase
                  </p>

                  <div className="space-y-4">
                     <Link to="/create" className="primary-btn">
                        Create Wallet
                     </Link>

                     <Link to="/import" className="secondary-btn">
                        Import Existing Wallet
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default HomePage;
