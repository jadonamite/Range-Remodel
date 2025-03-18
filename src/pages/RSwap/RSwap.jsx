import React, { useState } from "react";
import {
   ArrowRight,
   RefreshCw,
   Settings,
   ChevronDown,
   Plus,
   ExternalLink,
} from "lucide-react";

const SwapBridgeApp = () => {
   const [activeTab, setActiveTab] = useState("swap");
   const [fromToken, setFromToken] = useState({
      name: "Ethereum",
      symbol: "ETH",
      icon: "◊",
      balance: "0.0854",
      value: "$165.38",
   });
   const [toToken, setToToken] = useState({
      name: "USD Coin",
      symbol: "USDC",
      icon: "$",
      balance: "0.00",
      value: "$0.00",
   });
   const [fromAmount, setFromAmount] = useState("");
   const [toAmount, setToAmount] = useState("");

   const networks = [
      { name: "Ethereum", color: "#627EEA" },
      { name: "Polygon", color: "#8247E5" },
      { name: "Arbitrum", color: "#28A0F0" },
      { name: "Optimism", color: "#FF0420" },
      { name: "Base", color: "#0052FF" },
   ];

   const [fromNetwork, setFromNetwork] = useState(networks[0]);
   const [toNetwork, setToNetwork] = useState(networks[1]);

   return (
      <div className="flex flex-col h-screen bg-gray-100">
         {/* Header */}
         <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-3">
               <div className="text-2xl font-bold">SwapBridge</div>
               <div className="bg-white/20 rounded-full px-3 py-1 text-xs">
                  Connected 135ms
               </div>
            </div>
            <div className="flex items-center space-x-4">
               <div className="bg-white/20 rounded-full p-2">
                  <RefreshCw size={16} />
               </div>
               <div className="bg-white/20 rounded-full p-2">
                  <Settings size={16} />
               </div>
               <div className="bg-white/20 rounded-full px-3 py-1 flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                  0xBA8504....2e4193aa
               </div>
            </div>
         </div>

         {/* Main content */}
         <div className="flex-1 p-6 max-w-xl mx-auto w-full">
            {/* Tab selector */}
            <div className="bg-white rounded-lg shadow-md p-1 flex mb-6">
               <button
                  className={`flex-1 py-3 rounded-md ${
                     activeTab === "swap"
                        ? "bg-blue-500 text-white"
                        : "text-gray-700"
                  }`}
                  onClick={() => setActiveTab("swap")}>
                  Swap
               </button>
               <button
                  className={`flex-1 py-3 rounded-md ${
                     activeTab === "bridge"
                        ? "bg-blue-500 text-white"
                        : "text-gray-700"
                  }`}
                  onClick={() => setActiveTab("bridge")}>
                  Bridge
               </button>
            </div>

            {/* Swap/Bridge card */}
            <div className="bg-white rounded-lg shadow-md p-6">
               <h2 className="text-lg font-semibold mb-4">
                  {activeTab === "swap" ? "Swap Tokens" : "Bridge Assets"}
               </h2>

               {/* From section */}
               <div className="bg-gray-50 rounded-lg p-4 mb-2">
                  <div className="flex justify-between mb-2">
                     <span className="text-gray-500 text-sm">From</span>
                     <span className="text-gray-500 text-sm">
                        Balance: {fromToken.balance} {fromToken.symbol}
                     </span>
                  </div>

                  <div className="flex items-center">
                     <input
                        type="text"
                        className="bg-transparent text-2xl outline-none flex-1"
                        placeholder="0.0"
                        value={fromAmount}
                        onChange={(e) => setFromAmount(e.target.value)}
                     />

                     <button className="flex items-center bg-gray-200 rounded-lg px-3 py-2 ml-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                           {fromToken.icon}
                        </div>
                        <span>{fromToken.symbol}</span>
                        <ChevronDown size={16} className="ml-2" />
                     </button>
                  </div>

                  {activeTab === "bridge" && (
                     <div className="mt-2 flex items-center">
                        <div className="flex items-center bg-gray-200 rounded-lg px-3 py-1">
                           <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                 backgroundColor: fromNetwork.color,
                              }}></div>
                           <span className="ml-2 text-sm">
                              {fromNetwork.name}
                           </span>
                           <ChevronDown size={14} className="ml-2" />
                        </div>
                     </div>
                  )}
               </div>

               {/* Switch button */}
               <div className="flex justify-center -my-3 relative z-10">
                  <button className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-full shadow-lg">
                     {activeTab === "swap" ? (
                        <RefreshCw size={16} className="text-white" />
                     ) : (
                        <ArrowRight size={16} className="text-white" />
                     )}
                  </button>
               </div>

               {/* To section */}
               <div className="bg-gray-50 rounded-lg p-4 mt-2 mb-4">
                  <div className="flex justify-between mb-2">
                     <span className="text-gray-500 text-sm">To</span>
                     <span className="text-gray-500 text-sm">
                        Balance: {toToken.balance} {toToken.symbol}
                     </span>
                  </div>

                  <div className="flex items-center">
                     <input
                        type="text"
                        className="bg-transparent text-2xl outline-none flex-1"
                        placeholder="0.0"
                        value={toAmount}
                        onChange={(e) => setToAmount(e.target.value)}
                     />

                     <button className="flex items-center bg-gray-200 rounded-lg px-3 py-2 ml-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                           {toToken.icon}
                        </div>
                        <span>{toToken.symbol}</span>
                        <ChevronDown size={16} className="ml-2" />
                     </button>
                  </div>

                  {activeTab === "bridge" && (
                     <div className="mt-2 flex items-center">
                        <div className="flex items-center bg-gray-200 rounded-lg px-3 py-1">
                           <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                 backgroundColor: toNetwork.color,
                              }}></div>
                           <span className="ml-2 text-sm">
                              {toNetwork.name}
                           </span>
                           <ChevronDown size={14} className="ml-2" />
                        </div>
                     </div>
                  )}
               </div>

               {/* Info box */}
               <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-600">Rate</span>
                     <span className="text-gray-900">1 ETH = 1,850 USDC</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                     <span className="text-gray-600">Fee</span>
                     <span className="text-gray-900">0.05% (~$0.08)</span>
                  </div>
                  {activeTab === "bridge" && (
                     <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Estimated Time</span>
                        <span className="text-gray-900">~15 minutes</span>
                     </div>
                  )}
               </div>

               {/* Submit button */}
               <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium">
                  {activeTab === "swap" ? "Swap Tokens" : "Bridge Assets"}
               </button>
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Activity</h2>
                  <button className="text-blue-500 text-sm flex items-center">
                     View All <ExternalLink size={14} className="ml-1" />
                  </button>
               </div>

               <div className="text-center py-8 text-gray-500">
                  No transactions yet.
               </div>
            </div>
         </div>

         {/* Footer */}
         <div className="bg-white p-4 border-t border-gray-200">
            <div className="flex justify-between items-center max-w-xl mx-auto">
               <div className="text-gray-500 text-sm">
                  Total Balance: $165.30
               </div>
               <div className="flex space-x-4">
                  <button className="text-orange-500 flex items-center text-sm">
                     <span className="mr-1">SEND</span>
                  </button>
                  <button className="text-green-500 flex items-center text-sm">
                     <span className="mr-1">RECEIVE</span>
                  </button>
                  <button className="text-blue-500 flex items-center text-sm">
                     <span className="mr-1">BUY</span>
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default SwapBridgeApp;
