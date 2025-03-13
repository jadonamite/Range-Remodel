import React, { useState, useContext } from "react";
import { WalletContext } from "./WalletContext";

const SwapComponent = () => {
   const { relayClient, getSwapQuotes, executeSwap, SCROLL_TOKENS } =
      useContext(WalletContext);
   const [fromToken, setFromToken] = useState(SCROLL_TOKENS.USDC.address);
   const [toToken, setToToken] = useState(SCROLL_TOKENS.USDT.address);
   const [amount, setAmount] = useState("");
   const [quotes, setQuotes] = useState();
   const [selectedQuote, setSelectedQuote] = useState(null);

   const handleGetQuotes = async () => {
      try {
         const fetchedQuotes = await getSwapQuotes(fromToken, toToken, amount);
         setQuotes(fetchedQuotes);
      } catch (error) {
         alert("Error getting quotes: " + error.message);
      }
   };

   const handleExecuteSwap = async () => {
      if (!selectedQuote) {
         alert("Please select a quote.");
         return;
      }
      try {
         const result = await executeSwap(selectedQuote);
         console.log("Swap result:", result);
         alert("Swap successful!");
      } catch (error) {
         alert("Error executing swap: " + error.message);
      }
   };

   return (
      <div>
         <select
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}>
            {Object.entries(SCROLL_TOKENS).map(([key, token]) => (
               <option key={key} value={token.address}>
                  {token.symbol}
               </option>
            ))}
         </select>
         <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
            {Object.entries(SCROLL_TOKENS).map(([key, token]) => (
               <option key={key} value={token.address}>
                  {token.symbol}
               </option>
            ))}
         </select>
         <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
         />
         <button onClick={handleGetQuotes}>Get Quotes</button>

         {quotes.length > 0 && (
            <div>
               <h3>Swap Quotes</h3>
               <ul>
                  {quotes.map((quote, index) => (
                     <li key={index}>
                        {/* Display quote details here (e.g., price, DEX, etc.) */}
                        <button onClick={() => setSelectedQuote(quote)}>
                           Select
                        </button>
                     </li>
                  ))}
               </ul>
            </div>
         )}

         <button onClick={handleExecuteSwap} disabled={!selectedQuote}>
            Execute Swap
         </button>
      </div>
   );
};

export default SwapComponent;
