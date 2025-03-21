// src/components/wallet/Dashboard.jsx
import React from "react";
import { useWallet } from "../../context/WalletContext";
import Assets from "./Assets";
import Transactions from "./Transactions";
import Button from "../common/Button";

const Dashboard = () => {
   const { address, balance, disconnectWallet } = useWallet();

   const handleLogout = () => {
      disconnectWallet();
      // Additional navigation logic can be added if necessary
   };

   return (
      <div className="full-background">
         <div className="o-container py-8">
            <div className="mb-6">
               <h1 className="text-2xl font-bold mb-2">Wallet Dashboard</h1>
               <p className="text-gray-300 mb-1">
                  <span className="font-semibold">Address:</span> {address}
               </p>
               <p className="text-gray-300">
                  <span className="font-semibold">Balance:</span> {balance} ETH
               </p>
            </div>
            <Assets />
            <Transactions />
            <div className="mt-6">
               <Button onClick={handleLogout} variant="outline">
                  Logout
               </Button>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
