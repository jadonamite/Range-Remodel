import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { WalletContext } from "../context/WalletContext";
import { ethers } from "ethers";
import "./pages.css";

const BackupPage = () => {
   const { wallet } = useContext(WalletContext);
   const [mnemonic, setMnemonic] = useState([]);
   const navigate = useNavigate();

   // For testing purposes - remove in production
   useEffect(() => {
      // If wallet data isn't available, use sample data for development
      if (!wallet || !wallet.mnemonic || !wallet.mnemonic.phrase) {
         console.log("Using sample mnemonic for development");
         const samplePhrase =
            "cloud sun hope love morning got word phrase test apple orange banana";
         setMnemonic(samplePhrase.split(" "));
      } else {
         // Real implementation
         setMnemonic(wallet.mnemonic.phrase.split(" "));
      }
   }, [wallet]);

   const handleConfirm = () => {
      navigate("/wallet");
   };

   // Function to render the mnemonic words in three columns
   const renderMnemonicList = () => {
      const third = Math.ceil(mnemonic.length / 3);
      const firstThird = mnemonic.slice(0, third);
      const secondThird = mnemonic.slice(third, third * 2);
      const lastThird = mnemonic.slice(third * 2);

      return (
         <div className="grid grid-cols-3 gap-5">
            <ul>
               {firstThird.map((word, index) => (
                  <li key={index} className="mb-4">
                     {`${index + 1}. ${word}`}
                  </li>
               ))}
            </ul>
            <ul>
               {secondThird.map((word, index) => (
                  <li key={index} className="mb-4">
                     {`${index + third + 1}. ${word}`}
                  </li>
               ))}
            </ul>
            <ul>
               {lastThird.map((word, index) => (
                  <li key={index} className="mb-4">
                     {`${index + third * 2 + 1}. ${word}`}
                  </li>
               ))}
            </ul>
         </div>
      );
   };

   return (
      <div className="full-background">
         <div className="o-container">
            <div className="text">
               <h1 className="text-xl font-bold mb-4">Backup Your Wallet</h1>
               <p className="text-sm">
                  Please write down your recovery phrase and store it in a safe
                  place.
               </p>
            </div>
            <div className="mnemonic-display">
               {mnemonic.length > 0 ? (
                  renderMnemonicList()
               ) : (
                  <p>Loading mnemonic phrase...</p>
               )}
            </div>
            <div className="btn-container">
               <button onClick={handleConfirm} className="primary-btn">
                  Confirm Backup
               </button>
            </div>
         </div>
      </div>
   );
};

export default BackupPage;
