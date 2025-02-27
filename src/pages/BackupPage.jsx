// pages/BackupPage.jsx

import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import { ethers } from "ethers";

const BackupPage = () => {
   const { wallet } = useContext(WalletContext);
   const [mnemonic, setMnemonic] = useState("");
   const navigate = useNavigate();

   useEffect(() => {
      if (wallet) {
         setMnemonic(wallet.mnemonic.phrase);
      }
   }, [wallet]);

   const handleConfirm = () => {
      navigate("/wallet");
   };

   return (
      <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4">Backup Your Wallet</h1>
         <p className="mb-4">
            Please write down your recovery phrase and store it in a safe place.
         </p>
         <div className="border p-4 mb-4">
            <p>{mnemonic}</p>
         </div>
         <button
            onClick={handleConfirm}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Confirm Backup
         </button>
      </div>
   );
};

export default BackupPage;
