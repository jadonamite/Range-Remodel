// pages/WalletPage.jsx

import React, { useContext } from "react";
import { WalletContext } from "../context/WalletContext";
import { Link } from "react-router-dom";

const WalletPage = () => {
   const { address, balance, transactions } = useContext(WalletContext);

   return (
      <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4">Wallet</h1>
         <div className="mb-4">
            <p>Address: {address}</p>
            <p>Balance: {balance} ETH</p>
         </div>
         <div className="mb-4">
            <h2 className="text-lg font-bold">Transactions</h2>
            <ul>
               {transactions.map((tx, index) => (
                  <li key={index}>{/* Display transaction details */}</li>
               ))}
            </ul>
         </div>
         <div className="flex space-x-4">
            <Link
               to="/send"
               className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
               Send
            </Link>
            <Link
               to="/receive"
               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
               Receive
            </Link>
         </div>
      </div>
   );
};

export default WalletPage;
