// pages/CreateWalletPage.jsx

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";

const CreateWalletPage = () => {
   const [password, setPassword] = useState("");
   const { createWallet } = useContext(WalletContext);
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();
      const success = await createWallet(password);
      if (success) {
         navigate("/backup");
      } else {
         alert("Failed to create wallet.");
      }
   };

   return (
      <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4">Create New Wallet</h1>
         <form onSubmit={handleSubmit} className="space-y-4">
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
               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
               Create Wallet
            </button>
         </form>
      </div>
   );
};

export default CreateWalletPage;
