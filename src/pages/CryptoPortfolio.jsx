import React, { useState } from "react";
import {
   Wallet,
   BarChart3,
   Layers,
   History,
   Zap,
   ChevronDown,
   ArrowUpRight,
   ArrowDownRight,
} from "lucide-react";
import { motion } from "framer-motion";

const CryptoPortfolio = () => {
   const [activeTab, setActiveTab] = useState("assets");
   const [expandedAsset, setExpandedAsset] = useState(null);

   const tabs = [
      { id: "assets", label: "Assets", icon: <Layers size={16} /> },
      { id: "market", label: "Market", icon: <BarChart3 size={16} /> },
      { id: "dapps", label: "DApps", icon: <Zap size={16} /> },
      { id: "history", label: "History", icon: <History size={16} /> },
   ];

   const assets = [
      {
         name: "Bitcoin",
         symbol: "BTC",
         value: 2841.5,
         amount: 0.042,
         change: 3.2,
         color: "#F7931A",
      },
      {
         name: "Ethereum",
         symbol: "ETH",
         value: 1684.28,
         amount: 0.85,
         change: -1.8,
         color: "#627EEA",
      },
      {
         name: "Solana",
         symbol: "SOL",
         value: 498.3,
         amount: 4.2,
         change: 5.4,
         color: "#00FFA3",
      },
      {
         name: "Cardano",
         symbol: "ADA",
         value: 12.72,
         amount: 12.4,
         change: 0.8,
         color: "#0033AD",
      },
      {
         name: "Polkadot",
         symbol: "DOT",
         value: 846.3,
         amount: 62.3,
         change: -2.7,
         color: "#E6007A",
      },
   ];

   const recentDapps = [
      {
         name: "Uniswap",
         logo: "U",
         color: "#FF007A",
         lastUsed: "2h ago",
         transactions: 12,
      },
      {
         name: "Aave",
         logo: "A",
         color: "#B6509E",
         lastUsed: "1d ago",
         transactions: 8,
      },
      {
         name: "OpenSea",
         logo: "O",
         color: "#2081E2",
         lastUsed: "3d ago",
         transactions: 5,
      },
      {
         name: "Compound",
         logo: "C",
         color: "#00D395",
         lastUsed: "1w ago",
         transactions: 3,
      },
   ];

   const marketData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      datasets: [
         [10, 15, 13, 20, 18, 25, 24, 30, 32],
         [8, 10, 12, 15, 13, 18, 16, 20, 22],
      ],
   };

   const walletAddress = "0xBa6EC7ab88b098defB751B7401B5f6d83aa";
   const shortWalletAddress = `${walletAddress.substring(
      0,
      6
   )}...${walletAddress.substring(walletAddress.length - 4)}`;

   const totalBalance = assets.reduce((sum, asset) => sum + asset.value, 0);
   const totalAssetsCount = assets.length;

   const toggleAssetExpand = (index) => {
      setExpandedAsset(expandedAsset === index ? null : index);
   };

   return (
      <div className="bg-gray-900 text-white min-h-screen p-4 md:p-6 lg:p-8">
         <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
               <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl md:text-3xl font-bold text-white">
                  My Portfolio
               </motion.h1>

               <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center bg-gray-800 p-4 rounded-xl w-full md:w-auto">
                  <Wallet size={24} className="text-blue-400 mr-4" />
                  <div>
                     <p className="text-gray-400 text-xs md:text-sm">
                        {shortWalletAddress}
                     </p>
                     <h2 className="text-xl md:text-2xl font-bold">
                        ${totalBalance.toLocaleString()}
                     </h2>
                  </div>
               </motion.div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
               {[
                  {
                     label: "Total Assets",
                     value: totalAssetsCount,
                     change: "+2 this month",
                     icon: <ArrowUpRight size={16} />,
                     color: "text-green-400",
                  },
                  {
                     label: "Portfolio Growth",
                     value: "+18.4%",
                     change: "+5.2% from last week",
                     icon: <ArrowUpRight size={16} />,
                     color: "text-green-400",
                  },
                  {
                     label: "DApps Used",
                     value: "12",
                     change: "Last 30 days",
                     icon: null,
                     color: "text-blue-400",
                  },
                  {
                     label: "Gas Spent",
                     value: "$124.82",
                     change: "-12.3% from last month",
                     icon: <ArrowDownRight size={16} />,
                     color: "text-red-400",
                  },
               ].map((stat, index) => (
                  <motion.div
                     key={index}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: 0.1 * index }}
                     className="bg-gray-800 p-4 md:p-6 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer"
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}>
                     <p className="text-gray-400 text-xs md:text-sm">
                        {stat.label}
                     </p>
                     <h3 className="text-xl md:text-2xl font-bold mt-1">
                        {stat.value}
                     </h3>
                     <p
                        className={`${stat.color} text-xs md:text-sm mt-2 flex items-center`}>
                        {stat.icon && <span className="mr-1">{stat.icon}</span>}
                        {stat.change}
                     </p>
                  </motion.div>
               ))}
            </div>

            {/* Tabs */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.4 }}
               className="flex overflow-x-auto mb-6 bg-gray-800 p-1 rounded-xl">
               {tabs.map((tab, index) => (
                  <motion.button
                     key={tab.id}
                     className={`flex items-center px-4 md:px-6 py-3 rounded-lg text-sm font-medium whitespace-nowrap ${
                        activeTab === tab.id
                           ? "bg-blue-600 text-white"
                           : "text-gray-400 hover:text-white"
                     }`}
                     onClick={() => setActiveTab(tab.id)}
                     whileHover={{
                        backgroundColor:
                           activeTab === tab.id
                              ? "#3b82f6"
                              : "rgba(255,255,255,0.1)",
                     }}
                     whileTap={{ scale: 0.95 }}>
                     {tab.icon}
                     <span className="ml-2">{tab.label}</span>
                  </motion.button>
               ))}
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
               {/* Assets List */}
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="lg:col-span-1">
                  <div className="bg-gray-800 rounded-xl p-4 md:p-6">
                     <h3 className="text-lg font-semibold mb-4">Your Assets</h3>
                     <div className="space-y-3">
                        {assets.map((asset, index) => (
                           <motion.div
                              key={index}
                              className="bg-gray-700 rounded-lg overflow-hidden"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                              whileHover={{ scale: 1.01 }}>
                              <div
                                 className="flex items-center justify-between p-4 cursor-pointer"
                                 onClick={() => toggleAssetExpand(index)}>
                                 <div className="flex items-center">
                                    <div
                                       className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                       style={{ backgroundColor: asset.color }}>
                                       {asset.symbol.charAt(0)}
                                    </div>
                                    <div>
                                       <h4 className="font-medium">
                                          {asset.name}
                                       </h4>
                                       <p className="text-xs text-gray-400">
                                          {asset.amount} {asset.symbol}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="text-right flex items-center">
                                    <div>
                                       <p className="font-bold">
                                          ${asset.value.toLocaleString()}
                                       </p>
                                       <p
                                          className={`text-xs ${
                                             asset.change > 0
                                                ? "text-green-400"
                                                : "text-red-400"
                                          }`}>
                                          {asset.change > 0 ? "+" : ""}
                                          {asset.change}%
                                       </p>
                                    </div>
                                    <ChevronDown
                                       size={16}
                                       className={`ml-2 transition-transform ${
                                          expandedAsset === index
                                             ? "rotate-180"
                                             : ""
                                       }`}
                                    />
                                 </div>
                              </div>

                              {expandedAsset === index && (
                                 <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-gray-800 p-4 border-t border-gray-700">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                       <div>
                                          <p className="text-gray-400">
                                             24h Change
                                          </p>
                                          <p
                                             className={`font-medium ${
                                                asset.change > 0
                                                   ? "text-green-400"
                                                   : "text-red-400"
                                             }`}>
                                             {asset.change > 0 ? "+" : ""}
                                             {asset.change}%
                                          </p>
                                       </div>
                                       <div>
                                          <p className="text-gray-400">
                                             7d Change
                                          </p>
                                          <p
                                             className={`font-medium ${
                                                Math.random() > 0.5
                                                   ? "text-green-400"
                                                   : "text-red-400"
                                             }`}>
                                             {Math.random() > 0.5 ? "+" : "-"}
                                             {(Math.random() * 10).toFixed(1)}%
                                          </p>
                                       </div>
                                       <div>
                                          <p className="text-gray-400">Price</p>
                                          <p className="font-medium">
                                             $
                                             {(
                                                asset.value / asset.amount
                                             ).toFixed(2)}
                                          </p>
                                       </div>
                                       <div>
                                          <p className="text-gray-400">
                                             Portfolio %
                                          </p>
                                          <p className="font-medium">
                                             {(
                                                (asset.value / totalBalance) *
                                                100
                                             ).toFixed(1)}
                                             %
                                          </p>
                                       </div>
                                    </div>
                                    <div className="flex mt-4 gap-2">
                                       <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors">
                                          Buy
                                       </button>
                                       <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg text-sm transition-colors">
                                          Sell
                                       </button>
                                    </div>
                                 </motion.div>
                              )}
                           </motion.div>
                        ))}
                     </div>
                  </div>
               </motion.div>

               {/* Charts and Stats */}
               <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="lg:col-span-2 space-y-4 md:space-y-6">
                  {/* Line Chart */}
                  <div className="bg-gray-800 rounded-xl p-4 md:p-6">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Market Trend</h3>
                        <div className="flex items-center space-x-4">
                           <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                              <span className="text-xs text-gray-400">
                                 Bitcoin
                              </span>
                           </div>
                           <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
                              <span className="text-xs text-gray-400">
                                 Ethereum
                              </span>
                           </div>
                        </div>
                     </div>

                     <div className="h-48 md:h-64 relative">
                        <svg
                           viewBox="0 0 100 50"
                           className="w-full h-full overflow-visible">
                           {/* Grid lines */}
                           <line
                              x1="0"
                              y1="0"
                              x2="100"
                              y2="0"
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="0.5"
                           />
                           <line
                              x1="0"
                              y1="12.5"
                              x2="100"
                              y2="12.5"
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="0.5"
                           />
                           <line
                              x1="0"
                              y1="25"
                              x2="100"
                              y2="25"
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="0.5"
                           />
                           <line
                              x1="0"
                              y1="37.5"
                              x2="100"
                              y2="37.5"
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="0.5"
                           />
                           <line
                              x1="0"
                              y1="50"
                              x2="100"
                              y2="50"
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="0.5"
                           />

                           {/* Bitcoin line */}
                           <motion.path
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 1 }}
                              transition={{ duration: 1.5, ease: "easeInOut" }}
                              d={`M${marketData.datasets[0]
                                 .map(
                                    (point, i) =>
                                       `${
                                          i *
                                          (100 /
                                             (marketData.datasets[0].length -
                                                1))
                                       },${50 - point}`
                                 )
                                 .join(" L")}`}
                              fill="none"
                              stroke="#60A5FA"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                           />

                           {/* Ethereum line */}
                           <motion.path
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 1 }}
                              transition={{
                                 duration: 1.5,
                                 delay: 0.5,
                                 ease: "easeInOut",
                              }}
                              d={`M${marketData.datasets[1]
                                 .map(
                                    (point, i) =>
                                       `${
                                          i *
                                          (100 /
                                             (marketData.datasets[1].length -
                                                1))
                                       },${50 - point}`
                                 )
                                 .join(" L")}`}
                              fill="none"
                              stroke="#C084FC"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                           />

                           {/* Gradient for Bitcoin */}
                           <linearGradient
                              id="blueGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1">
                              <stop
                                 offset="0%"
                                 stopColor="#60A5FA"
                                 stopOpacity="0.2"
                              />
                              <stop
                                 offset="100%"
                                 stopColor="#60A5FA"
                                 stopOpacity="0"
                              />
                           </linearGradient>

                           {/* Area fill for Bitcoin */}
                           <motion.path
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 1, delay: 1 }}
                              d={`M${marketData.datasets[0]
                                 .map(
                                    (point, i) =>
                                       `${
                                          i *
                                          (100 /
                                             (marketData.datasets[0].length -
                                                1))
                                       },${50 - point}`
                                 )
                                 .join(" L")} L100,50 L0,50 Z`}
                              fill="url(#blueGradient)"
                           />
                        </svg>

                        {/* X-axis labels */}
                        <div className="flex justify-between mt-2">
                           {marketData.labels.map((label, index) => (
                              <div
                                 key={index}
                                 className="text-xs text-gray-400">
                                 {label}
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Pie Chart and DApps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                     <div className="bg-gray-800 rounded-xl p-4 md:p-6">
                        <h3 className="text-lg font-semibold mb-4">
                           Portfolio Distribution
                        </h3>
                        <div className="relative h-48 flex items-center justify-center">
                           <motion.svg
                              width="100%"
                              height="100%"
                              viewBox="0 0 100 100"
                              initial={{ rotate: -90 }}
                              animate={{ rotate: 0 }}
                              transition={{ duration: 1, ease: "easeInOut" }}>
                              <motion.circle
                                 cx="50"
                                 cy="50"
                                 r="40"
                                 fill="none"
                                 stroke="#F7931A"
                                 strokeWidth="18"
                                 initial={{
                                    strokeDasharray: "0 100",
                                    strokeDashoffset: "0",
                                 }}
                                 animate={{
                                    strokeDasharray: "56 100",
                                    strokeDashoffset: "0",
                                 }}
                                 transition={{ duration: 1, delay: 0.1 }}
                              />
                              <motion.circle
                                 cx="50"
                                 cy="50"
                                 r="40"
                                 fill="none"
                                 stroke="#627EEA"
                                 strokeWidth="18"
                                 initial={{
                                    strokeDasharray: "0 100",
                                    strokeDashoffset: "-56",
                                 }}
                                 animate={{
                                    strokeDasharray: "30 100",
                                    strokeDashoffset: "-56",
                                 }}
                                 transition={{ duration: 1, delay: 0.2 }}
                              />
                              <motion.circle
                                 cx="50"
                                 cy="50"
                                 r="40"
                                 fill="none"
                                 stroke="#00FFA3"
                                 strokeWidth="18"
                                 initial={{
                                    strokeDasharray: "0 100",
                                    strokeDashoffset: "-86",
                                 }}
                                 animate={{
                                    strokeDasharray: "8 100",
                                    strokeDashoffset: "-86",
                                 }}
                                 transition={{ duration: 1, delay: 0.3 }}
                              />
                              <motion.circle
                                 cx="50"
                                 cy="50"
                                 r="40"
                                 fill="none"
                                 stroke="#0033AD"
                                 strokeWidth="18"
                                 initial={{
                                    strokeDasharray: "0 100",
                                    strokeDashoffset: "-94",
                                 }}
                                 animate={{
                                    strokeDasharray: "4 100",
                                    strokeDashoffset: "-94",
                                 }}
                                 transition={{ duration: 1, delay: 0.4 }}
                              />
                              <motion.circle
                                 cx="50"
                                 cy="50"
                                 r="40"
                                 fill="none"
                                 stroke="#E6007A"
                                 strokeWidth="18"
                                 initial={{
                                    strokeDasharray: "0 100",
                                    strokeDashoffset: "-98",
                                 }}
                                 animate={{
                                    strokeDasharray: "2 100",
                                    strokeDashoffset: "-98",
                                 }}
                                 transition={{ duration: 1, delay: 0.5 }}
                              />
                           </motion.svg>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                           {assets.map((asset, index) => (
                              <motion.div
                                 key={index}
                                 className="flex items-center"
                                 initial={{ opacity: 0, x: -10 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{
                                    duration: 0.3,
                                    delay: 0.1 * index,
                                 }}>
                                 <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{
                                       backgroundColor: asset.color,
                                    }}></div>
                                 <span className="text-xs">{asset.symbol}</span>
                              </motion.div>
                           ))}
                        </div>
                     </div>

                     <div className="bg-gray-800 rounded-xl p-4 md:p-6">
                        <h3 className="text-lg font-semibold mb-4">
                           Recent DApps
                        </h3>
                        <div className="space-y-3">
                           {recentDapps.map((dapp, index) => (
                              <motion.div
                                 key={index}
                                 className="flex items-center justify-between bg-gray-700 p-3 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors"
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 transition={{
                                    duration: 0.3,
                                    delay: 0.1 * index,
                                 }}
                                 whileHover={{ scale: 1.02 }}
                                 whileTap={{ scale: 0.98 }}>
                                 <div className="flex items-center">
                                    <div
                                       className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                                       style={{ backgroundColor: dapp.color }}>
                                       {dapp.logo}
                                    </div>
                                    <div>
                                       <h4 className="text-sm font-medium">
                                          {dapp.name}
                                       </h4>
                                       <p className="text-xs text-gray-400">
                                          {dapp.lastUsed}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="text-xs text-gray-400">
                                    {dapp.transactions} txns
                                 </div>
                              </motion.div>
                           ))}
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </div>
   );
};

export default CryptoPortfolio;
