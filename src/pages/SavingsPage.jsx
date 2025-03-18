import React, { useState } from "react";
import {
   RefreshCw,
   Settings,
   CheckCircle,
   Clock,
   Lock,
   TrendingUp,
   X,
} from "lucide-react";

const SavingsPage = () => {
   const [showModal, setShowModal] = useState(false);
   const [selectedOption, setSelectedOption] = useState(null);

   const handleOptionClick = (option) => {
      setSelectedOption(option);
      setShowModal(true);
   };

   return (
      <div className="min-h-screen bg-gray-100 p-6">
         <div className="text-[#1f1f1f] flex justify-between items-center mb-12">
            <div className="flex items-center space-x-3">
               <div className="text-2xl font-bold">Save</div>
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
         <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-2 text-[#1f1f1f]">Savings</h1>
            <p className="text-gray-600 mb-6">
               Choose a savings strategy that works for you
            </p>

            <div className="space-y-4">
               {/* Yield Optimized Option */}
               <div
                  className="bg-white rounded-xl shadow-md p-5 cursor-pointer transition duration-300 hover:shadow-lg border-2 border-transparent hover:border-blue-500"
                  onClick={() => handleOptionClick("yield")}>
                  <div className="flex items-center mb-3">
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                        <TrendingUp size={20} />
                     </div>
                     <h2 className="text-xl font-semibold">
                        Yield Optimized Savings
                     </h2>
                  </div>

                  <p className="text-gray-600 mb-3">
                     Automatically allocate your assets to the highest-yielding
                     protocols
                  </p>

                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                     <div className="flex items-center">
                        <CheckCircle
                           size={16}
                           className="mr-1 text-green-500"
                        />
                        <span>Flexible withdrawals</span>
                     </div>
                     <div className="flex items-center">
                        <TrendingUp size={16} className="mr-1 text-blue-500" />
                        <span>Up to 8.5% APY</span>
                     </div>
                  </div>
               </div>

               {/* Lock Moonbag Option */}
               <div
                  className="bg-white rounded-xl shadow-md p-5 cursor-pointer transition duration-300 hover:shadow-lg border-2 border-transparent hover:border-purple-500"
                  onClick={() => handleOptionClick("lock")}>
                  <div className="flex items-center mb-3">
                     <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3">
                        <Lock size={20} />
                     </div>
                     <h2 className="text-xl font-semibold">Lock Moonbag</h2>
                  </div>

                  <p className="text-gray-600 mb-3">
                     Lock your MoonBag and watch it grow over time
                  </p>

                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                     <div className="flex items-center">
                        <Clock size={16} className="mr-1 text-orange-500" />
                        <span>30-365 day lock</span>
                     </div>
                     <div className="flex items-center">
                        <TrendingUp
                           size={16}
                           className="mr-1 text-purple-500"
                        />
                        <span>Up to 15% APY</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Stats Summary */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-5">
               <h3 className="font-medium mb-3 text-gray-700">Your Savings</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <div className="text-gray-500 text-sm">
                        Total Deposited
                     </div>
                     <div className="text-xl font-bold">$0.00</div>
                  </div>
                  <div>
                     <div className="text-gray-500 text-sm">Total Earned</div>
                     <div className="text-xl font-bold">$0.00</div>
                  </div>
               </div>
            </div>
         </div>

         {/* Coming Soon Modal */}
         {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full animate-bounce-in">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold">
                        {selectedOption === "yield"
                           ? "Yield Optimized Savings"
                           : "Lock Moonbag"}
                     </h3>
                     <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                     </button>
                  </div>

                  <div className="flex flex-col items-center justify-center py-8">
                     <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <div className="w-12 h-12 border-t-4 border-blue-500 border-r-4 border-gray-200 rounded-full animate-spin"></div>
                     </div>
                     <h4 className="text-xl font-bold mb-2 animate-pulse">
                        Coming Soon!
                     </h4>
                     <p className="text-gray-600 text-center">
                        We're working hard to bring you the best savings
                        experience. Stay tuned for updates!
                     </p>
                  </div>

                  <div className="mt-6">
                     <button
                        onClick={() => setShowModal(false)}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium">
                        Got it
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

// Add the required keyframes for animations
const style = document.createElement("style");
style.textContent = `
  @keyframes bounce-in {
    0% { transform: scale(0.8); opacity: 0; }
    70% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  .animate-bounce-in {
    animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
document.head.appendChild(style);

export default SavingsPage;
