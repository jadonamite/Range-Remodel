import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WalletContext } from "../../context/WalletContext.jsx";
import PasswordPrompt from "../../Components/Password/PasswordPrompt.jsx";
import "./ConnectWallet.css";
import "../../index.css";
import logo from "../../assets/logo.png";

const ConnectWallet = () => {
   const { loadWallet } = useContext(WalletContext);
   const navigate = useNavigate();
   const [walletExists, setWalletExists] = useState(false);

   useEffect(() => {
      const checkWallet = async () => {
         const walletData = localStorage.getItem("scrollWallet");
         if (walletData) {
            setWalletExists(true);
         } else {
            setWalletExists(false);
         }
      };
      checkWallet();
   }, []);

   const handleConnect = async (password) => {
      try {
         const success = await loadWallet(password);
         if (success) {
            navigate("/wallet");
         } else {
            throw new Error("Incorrect password");
         }
      } catch (error) {
         // Error is handled in PasswordPrompt
         throw error;
      }
   };

   const handleClearStorage = () => {
      localStorage.removeItem("scrollWallet");
      setWalletExists(false);
   };

   return (
      <div className="body full-background">
         <div className="o-container rounded-xl">
            <div className="px-8 py-10 text-center grid gap-6">
               <div className="flex justify-center mb-6">
                  <img src={logo} alt="" />
               </div>
               <div>
                  <h1 className="text-2xl font-bold text-white mb-4">
                     Connect to your Wallet
                  </h1>

                  <p className="text-gray-400 mb-8 text-sm mx-auto">
                     Connect an existing wallet or create a new one.
                  </p>
               </div>

               <div className="space-y-4 mt-10">
                  {walletExists && (
                     <>
                        <PasswordPrompt onConnect={handleConnect} />
                        <button
                           onClick={handleClearStorage}
                           className="text-xs">
                           Forgotten Password
                        </button>
                     </>
                  )}

                  {!walletExists && (
                     <>
                        <Link to="/create" className="primary-btn">
                           Create Wallet
                        </Link>

                        <Link to="/import" className="tertiary-btn">
                           Import Existing Wallet
                        </Link>
                     </>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default ConnectWallet;
