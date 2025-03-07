// pages/WalletPage.jsx

import React, { useContext, useState } from "react";
import { WalletContext } from "../../context/WalletContext";
import { Link } from "react-router-dom";
import "./WalletPage.css";

const WalletPage = () => {
   const { address, balance, transactions, assets } = useContext(WalletContext);
   const [totalBalance, setTotalBalance] = useState("$289.89");
   const [changeAmount, setChangeAmount] = useState("+$3.714");
   const [changePercent, setChangePercent] = useState("+12.38%");

   // Sample assets data
   const walletAssets = assets || [
      {
         name: "Ethereum",
         symbol: "ETH",
         amount: "0.1 WETH",
         value: "$259.33",
         change: "$2.12",
         changePercent: "+14.45%",
         icon: "ethereum",
      },
      {
         name: "MAGA (Trump)",
         symbol: "MAGA",
         amount: "459 MAGA",
         value: "$14.06",
         change: "$2.12",
         changePercent: "+14.45%",
         icon: "ethereum",
      },
      {
         name: "USDC",
         symbol: "USDC",
         amount: "16.5 USDC",
         value: "$16.50",
         change: "$0.02",
         changePercent: "+0.02%",
         icon: "ethereum",
      },
   ];

   // Sample transaction data
   const walletTransactions = transactions || [
      {
         type: "Send",
         address: "0x49E/fa...D77638",
         amount: "0.05 ETH",
         icon: "ethereum",
      },
      {
         type: "Send",
         address: "0x49E/fa...D77638",
         amount: "103.50 USDC",
         icon: "ethereum",
      },
      {
         type: "Send",
         address: "0x49E/fa...D77638",
         amount: "0.12 ETH",
         icon: "ethereum",
      },
      {
         type: "Recieve",
         address: "0xD07f3...D77638",
         amount: "120 USDC",
         icon: "ethereum",
      },
   ];

   const truncatedAddress = address ? address : "0xA33de0....aD77638";

   return (
      <div className="bg-gray-100 min-h-screen">
         <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-12">
               <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                  <div className="bg-purple-500 rounded-full w-12 h-12"></div>
               </div>

               <div className="flex-grow"></div>

               <div className="border rounded-full flex items-center p-1 pr-4">
                  <div className="border-r px-2 py-1">
                     <span className="text-xs text-gray-600">Account 1</span>
                  </div>
                  <div className="px-3">
                     <span className="text-sm">{truncatedAddress}</span>
                  </div>
                  <button className="ml-2">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <rect
                           x="9"
                           y="9"
                           width="13"
                           height="13"
                           rx="2"
                           ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                     </svg>
                  </button>
               </div>
            </div>

            <div className="mb-8">
               <div className="flex items-center mb-2">
                  <h2 className="text-xl font-medium text-gray-700">
                     Total Balance
                  </h2>
                  <svg
                     className="ml-2"
                     xmlns="http://www.w3.org/2000/svg"
                     width="20"
                     height="20"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round">
                     <circle cx="12" cy="12" r="10"></circle>
                     <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                     <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
               </div>

               <div className="flex items-center">
                  <h1 className="text-4xl font-bold">{totalBalance}</h1>
                  <svg
                     className="ml-2"
                     xmlns="http://www.w3.org/2000/svg"
                     width="20"
                     height="20"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round">
                     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                     <circle cx="12" cy="12" r="3"></circle>
                  </svg>
               </div>

               <div className="text-sm">
                  <span className="text-gray-600">({changeAmount})</span>
                  <span className="text-green-500 ml-1">{changePercent}</span>
               </div>
            </div>

            <div className="flex mb-8 space-x-3">
               <button className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="20"
                     height="20"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round">
                     <line x1="22" y1="2" x2="11" y2="13"></line>
                     <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
               </button>

               <button className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="20"
                     height="20"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round">
                     <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"></rect>
                     <circle cx="8.5" cy="8.5" r="1.5"></circle>
                     <polygon points="21 15 16 10 5 21"></polygon>
                  </svg>
               </button>

               <button className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="20"
                     height="20"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round">
                     <line x1="12" y1="1" x2="12" y2="23"></line>
                     <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
               </button>

               <button className="flex-grow h-12 bg-gradient-to-r from-purple-700 to-teal-500 rounded-full text-white font-bold flex items-center justify-center">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="20"
                     height="20"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     className="mr-2">
                     <path d="M21 4v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4"></path>
                     <polyline points="16 4 16 1 8 1 8 4"></polyline>
                     <line x1="12" y1="11" x2="12" y2="17"></line>
                     <line x1="9" y1="14" x2="15" y2="14"></line>
                  </svg>
                  EXCHANGE
               </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div>
                  <h2 className="text-lg font-medium text-gray-700 mb-4">
                     Assets
                  </h2>
                  <div className="space-y-3">
                     {walletAssets.map((asset, index) => (
                        <div
                           key={index}
                           className="border rounded-lg p-3 flex items-center justify-between">
                           <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                 <span className="text-blue-500 text-sm">
                                    Ξ
                                 </span>
                              </div>
                              <div>
                                 <p className="font-medium">{asset.name}</p>
                                 <p className="text-xs text-gray-500">
                                    {asset.amount}
                                 </p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="font-medium">{asset.value}</p>
                              <p className="text-xs text-green-500">
                                 {asset.change}{" "}
                                 <span>({asset.changePercent})</span>
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div>
                  <h2 className="text-lg font-medium text-gray-700 mb-4">
                     Activity
                  </h2>
                  <div className="space-y-3">
                     {walletTransactions.map((tx, index) => (
                        <div
                           key={index}
                           className="border-b pb-3 flex items-center justify-between">
                           <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                 <span className="text-blue-500 text-sm">
                                    Ξ
                                 </span>
                              </div>
                              <div>
                                 <p className="font-medium">{tx.type}</p>
                                 <p className="text-xs text-gray-500">
                                    {tx.address}
                                 </p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="font-medium">{tx.amount}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default WalletPage;
