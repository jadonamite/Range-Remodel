// src/components/wallet/Assets.jsx
import React from "react";
import { useWallet } from "../../context/WalletContext";

const Assets = () => {
   const { assets } = useWallet();

   return (
      <div className="mb-6">
         <h2 className="text-xl font-bold mb-4">Assets</h2>
         {assets && assets.length > 0 ? (
            <div className="space-y-4">
               {assets.map((asset, index) => (
                  <div
                     key={index}
                     className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
                     <div className="flex items-center space-x-3">
                        <img
                           src={`/${asset.icon}.png`}
                           alt={asset.symbol}
                           className="w-8 h-8"
                        />
                        <div>
                           <p className="font-semibold">{asset.name}</p>
                           <p className="text-gray-400 text-sm">
                              {asset.displayAmount}
                           </p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="font-semibold">{asset.value}</p>
                        <p
                           className={`text-sm ${
                              asset.change.startsWith("+")
                                 ? "text-green-500"
                                 : "text-red-500"
                           }`}>
                           {asset.change} ({asset.changePercent})
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <p className="text-gray-400">No assets found.</p>
         )}
      </div>
   );
};

export default Assets;
