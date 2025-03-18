import React, { useState } from "react";
import { Wallet, PiggyBank, BarChart2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import SwapBridgeApp from "./RSwap/RSwap";
import SavingsPage from "./SavingsPage";
import CryptoPortfolio from "./CryptoPortfolio";

const AnimatedNavigation = () => {
   const [activePage, setActivePage] = useState("exchange");
   const [isTransitioning, setIsTransitioning] = useState(false);

   const handleNavClick = (page) => {
      if (activePage !== page && !isTransitioning) {
         setIsTransitioning(true);
         setActivePage(page);
         setTimeout(() => setIsTransitioning(false), 500);
      }
   };

   const pages = {
      exchange: {
         title: "Exchange",
         icon: Wallet,
         color: "bg-gradient-to-r from-blue-500 to-purple-500",
         content: <SwapBridgeApp />,
      },
      save: {
         title: "Save",
         icon: PiggyBank,
         color: "bg-gradient-to-r from-green-500 to-teal-500",
         content: <SavingsPage />,
      },
      portfolio: {
         title: "Portfolio",
         icon: BarChart2,
         color: "bg-gradient-to-r from-indigo-500 to-pink-500",
         content: <CryptoPortfolio />,
      },
   };

   return (
      <div className="h-screen bg-gray-100 flex flex-col">
         {/* Back button */}
         <div className="p-4 bg-white shadow-sm">
            <Link
               to="/wallet"
               className="flex items-center text-blue-500 font-medium">
               <ArrowLeft size={18} className="mr-1" />
               Back to Wallet
            </Link>
         </div>

         {/* Content area with scrolling enabled */}
         <div className="flex-1 overflow-y-auto">
            <div
               className={`w-full transition-transform duration-500 ease-in-out ${
                  isTransitioning ? "opacity-80" : ""
               }`}
               style={{
                  transform: `translateX(${isTransitioning ? "-5%" : "0"})`,
               }}>
               {pages[activePage].content}
            </div>
         </div>

         {/* Fixed navigation bar */}
         <div className="bg-white border-t border-gray-200 sticky bottom-0">
            <div className="max-w-md mx-auto flex">
               {Object.entries(pages).map(([key, page]) => {
                  const Icon = page.icon;
                  return (
                     <button
                        key={key}
                        className={`flex-1 py-4 flex flex-col items-center transition-colors duration-300 ${
                           activePage === key
                              ? "text-blue-500"
                              : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => handleNavClick(key)}>
                        <div
                           className={`w-12 h-1 rounded-full mb-1 ${
                              activePage === key ? page.color : "bg-transparent"
                           }`}></div>
                        <Icon
                           size={20}
                           className={
                              activePage === key
                                 ? "transform transition-transform duration-300 scale-110"
                                 : ""
                           }
                        />
                        <span className="text-xs mt-1">{page.title}</span>
                     </button>
                  );
               })}
            </div>
         </div>
      </div>
   );
};

export default AnimatedNavigation;
