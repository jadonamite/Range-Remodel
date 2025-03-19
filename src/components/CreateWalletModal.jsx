import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";
import LoadingSpinner from "./LoadingSpinner";

const CreateWalletModal = ({ onClose, onCreateSuccess }) => {
   const { createWallet, loading } = useWallet();
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [error, setError] = useState("");

   const handleCreate = async () => {
      if (password !== confirmPassword) {
         setError("Passwords do not match!");
         return;
      }
      const result = await createWallet(password);
      if (result.success) {
         // pass seed phrase to parent
         onCreateSuccess(result.mnemonic);
      } else {
         setError(result.error);
      }
   };

   return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
         <div className="bg-[#1f2937] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create a New Wallet</h2>

            <input
               type="password"
               placeholder="Enter password"
               className="w-full p-2 mb-2 rounded bg-gray-800 border border-gray-600 text-white"
               onChange={(e) => setPassword(e.target.value)}
            />
            <input
               type="password"
               placeholder="Confirm password"
               className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-600 text-white"
               onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading.wallet && <LoadingSpinner message="Creating wallet..." />}

            <div className="flex justify-end space-x-2">
               <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">
                  Cancel
               </button>
               <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white">
                  Create
               </button>
            </div>
         </div>
      </div>
   );
};

export default CreateWalletModal;
