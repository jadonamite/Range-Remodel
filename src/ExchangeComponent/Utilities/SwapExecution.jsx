import React, { useState } from "react";
import { useRequests } from "@reservoir0x/relay-kit-hooks";
import { useWallet } from "../../context/WalletContext";

const SwapExecution = ({ quoteId, onSwapComplete }) => {
   const { account } = useWallet();
   const [isSwapping, setIsSwapping] = useState(false);
   const [swapError, setSwapError] = useState(null);

   const { mutate: executeSwap, data: swapData } = useRequests();

   const handleSwap = async () => {
      if (!quoteId || !account) return;

      setIsSwapping(true);
      setSwapError(null);

      try {
         await executeSwap({
            quoteId,
            walletAddress: account,
            chainId: 534351, // Scroll Sepolia
         });

         onSwapComplete && onSwapComplete(swapData);
      } catch (error) {
         console.error("Swap execution error:", error);
         setSwapError(error.message || "Failed to execute swap");
      } finally {
         setIsSwapping(false);
      }
   };

   return (
      <div className="mt-3">
         {swapError && <div className="alert alert-danger">{swapError}</div>}

         <button
            className="btn btn-primary"
            onClick={handleSwap}
            disabled={!quoteId || isSwapping}>
            {isSwapping ? "Processing..." : "Swap Tokens"}
         </button>

         {quoteId && (
            <div className="mt-2">
               <small className="text-muted">Quote ID: {quoteId}</small>
            </div>
         )}
      </div>
   );
};

export default SwapExecution;
