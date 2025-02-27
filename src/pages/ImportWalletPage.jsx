// pages/ImportWalletPage.jsx

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";

const ImportWalletPage = () => {
   const [recoveryPhrase, setRecoveryPhrase] = useState("");
   const [password, setPassword] = useState("");
   const { importWallet } = useContext(WalletContext);
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();
      const success = await importWallet(recoveryPhrase, password);
      if (success) {
         navigate("/backup");
      } else {
         alert("Failed to import wallet.");
      }
   };

   return (
      <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4">Import Wallet</h1>
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label className="block">Recovery Phrase:</label>
               <textarea
                  value={recoveryPhrase}
                  onChange={(e) => setRecoveryPhrase(e.target.value)}
                  className="border p-2 w-full"
               />
            </div>
            <div>
               <label className="block">Password:</label>
               <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 w-full"
               />
            </div>
            <button
               type="submit"
               className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
               Import
            </button>
         </form>
      </div>
   );
};

export default ImportWalletPage;
