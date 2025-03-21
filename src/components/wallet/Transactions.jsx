// src/components/wallet/Transactions.jsx
import React from "react";
import { useWallet } from "../../context/WalletContext";

const Transactions = () => {
   const { transactions } = useWallet();

   return (
      <div className="mb-6">
         <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
         {transactions && transactions.length > 0 ? (
            <div className="space-y-4">
               {transactions.map((tx, index) => (
                  <div
                     key={index}
                     className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                     <div>
                        <p className="font-semibold">
                           {tx.type} to/from {tx.address}
                        </p>
                        <p className="text-gray-400 text-sm">
                           {new Date(tx.timestamp).toLocaleString()}
                        </p>
                     </div>
                     <div className="text-right">
                        <p className="font-semibold">{tx.amount}</p>
                        <a
                           href={`${
                              tx.network === "Scroll Sepolia"
                                 ? "https://sepolia.scrollscan.com"
                                 : "#"
                           }${tx.txHash}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-purple-500 text-sm">
                           View Tx
                        </a>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <p className="text-gray-400">No transactions found.</p>
         )}
      </div>
   );
};

export default Transactions;
