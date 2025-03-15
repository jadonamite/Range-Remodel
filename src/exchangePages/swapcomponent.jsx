import React, { useState, useContext, useEffect } from "react";
import { WalletContext } from "../context/WalletContext";

const SwapComponent = () => {
   const { getSwapQuotes, executeSwap, SCROLL_TOKENS, address } =
      useContext(WalletContext);

   // State variables
   const [fromToken, setFromToken] = useState("");
   const [toToken, setToToken] = useState("");
   const [amount, setAmount] = useState("");
   const [quotes, setQuotes] = useState([]);
   const [selectedQuote, setSelectedQuote] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");
   const [isQuotesFetched, setIsQuotesFetched] = useState(false);

   // Reset states when changing tokens or amount
   useEffect(() => {
      setQuotes([]);
      setSelectedQuote(null);
      setIsQuotesFetched(false);
      setError("");
      setSuccess("");
   }, [fromToken, toToken, amount]);

   // Handler for fetching quotes
   const handleGetQuotes = async () => {
      if (!fromToken || !toToken || !amount) {
         setError("Please fill in all fields");
         return;
      }

      if (fromToken === toToken) {
         setError("Please select different tokens");
         return;
      }

      setLoading(true);
      setError("");
      setSuccess("");

      try {
         const quotesResult = await getSwapQuotes({
            fromToken,
            toToken,
            amount,
            userAddress: address,
         });

         if (quotesResult && quotesResult.length > 0) {
            setQuotes(quotesResult);
            setIsQuotesFetched(true);
         } else {
            setError("No quotes available for this swap");
         }
      } catch (err) {
         setError(`Error fetching quotes: ${err.message}`);
      } finally {
         setLoading(false);
      }
   };

   // Handler for executing swap
   const handleExecuteSwap = async () => {
      if (!selectedQuote) {
         setError("Please select a quote first");
         return;
      }

      setLoading(true);
      setError("");
      setSuccess("");

      try {
         const result = await executeSwap(selectedQuote);
         setSuccess(`Swap executed successfully! Tx hash: ${result.hash}`);

         // Reset after successful swap
         setFromToken("");
         setToToken("");
         setAmount("");
         setQuotes([]);
         setSelectedQuote(null);
         setIsQuotesFetched(false);
      } catch (err) {
         setError(`Error executing swap: ${err.message}`);
      } finally {
         setLoading(false);
      }
   };

   // Format token balance to display
   const formatTokenBalance = (balance) => {
      if (!balance) return "0";
      return parseFloat(balance).toFixed(4);
   };

   // Format price to display with appropriate units
   const formatPrice = (quote) => {
      if (!quote || !quote.price) return "";
      return `1 ${SCROLL_TOKENS[fromToken]?.symbol} = ${Number(
         quote.price
      ).toFixed(6)} ${SCROLL_TOKENS[toToken]?.symbol}`;
   };

   // Calculate and format the estimated output amount
   const formatOutputAmount = (quote) => {
      if (!quote || !quote.estimatedOutput) return "";
      return `≈ ${Number(quote.estimatedOutput).toFixed(6)} ${
         SCROLL_TOKENS[toToken]?.symbol
      }`;
   };

   return (
      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
         <h2 className="text-2xl font-bold text-center mb-6">Swap Tokens</h2>

         {/* Error and Success Messages */}
         {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
               {error}
            </div>
         )}

         {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
               {success}
            </div>
         )}

         <div className="space-y-4">
            {/* From Token Selection */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
               </label>
               <div className="flex items-center space-x-2">
                  <select
                     className="flex-grow p-2 border rounded-md"
                     value={fromToken}
                     onChange={(e) => setFromToken(e.target.value)}>
                     <option value="">Select token</option>
                     {Object.entries(SCROLL_TOKENS).map(([address, token]) => (
                        <option key={address} value={address}>
                           {token.symbol} - {token.name}
                        </option>
                     ))}
                  </select>

                  <input
                     type="number"
                     placeholder="Amount"
                     className="w-1/3 p-2 border rounded-md"
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     min="0"
                     step="0.000001"
                  />
               </div>
            </div>

            {/* Swap Direction Indicator */}
            <div className="flex justify-center">
               <button
                  className="p-2 bg-gray-100 rounded-full"
                  onClick={() => {
                     const temp = fromToken;
                     setFromToken(toToken);
                     setToToken(temp);
                  }}>
                  ⇅
               </button>
            </div>

            {/* To Token Selection */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
               </label>
               <select
                  className="w-full p-2 border rounded-md"
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}>
                  <option value="">Select token</option>
                  {Object.entries(SCROLL_TOKENS).map(([address, token]) => (
                     <option key={address} value={address}>
                        {token.symbol} - {token.name}
                     </option>
                  ))}
               </select>

               {selectedQuote && (
                  <div className="mt-2 text-right text-gray-600">
                     {formatOutputAmount(selectedQuote)}
                  </div>
               )}
            </div>

            {/* Get Quotes Button */}
            <button
               className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
               onClick={handleGetQuotes}
               disabled={loading || !fromToken || !toToken || !amount}>
               {loading && !isQuotesFetched ? "Loading..." : "Get Quotes"}
            </button>

            {/* Quotes Display */}
            {quotes.length > 0 && (
               <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Available Quotes</h3>
                  <div className="space-y-3">
                     {quotes.map((quote, index) => (
                        <div
                           key={index}
                           className={`p-3 border rounded-md cursor-pointer ${
                              selectedQuote === quote
                                 ? "border-blue-500 bg-blue-50"
                                 : "border-gray-200"
                           }`}
                           onClick={() => setSelectedQuote(quote)}>
                           <div className="flex justify-between">
                              <span className="font-medium">
                                 {quote.source || "Unknown Source"}
                              </span>
                              <span className="text-green-600">
                                 {formatPrice(quote)}
                              </span>
                           </div>

                           <div className="flex justify-between text-sm text-gray-600 mt-1">
                              <div>
                                 <span>
                                    Gas: ~${quote.estimatedGas?.usd || "N/A"}
                                 </span>
                              </div>
                              <div>
                                 <span>Slippage: {quote.slippage || 0.5}%</span>
                              </div>
                           </div>

                           <div className="mt-2 text-sm">
                              <div>
                                 <span>
                                    You receive: {formatOutputAmount(quote)}
                                 </span>
                              </div>
                              {quote.priceImpact && (
                                 <div
                                    className={`${
                                       parseFloat(quote.priceImpact) > 5
                                          ? "text-red-500"
                                          : "text-gray-600"
                                    }`}>
                                    Price Impact:{" "}
                                    {parseFloat(quote.priceImpact).toFixed(2)}%
                                 </div>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Execute Swap Button */}
            {isQuotesFetched && (
               <button
                  className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300"
                  onClick={handleExecuteSwap}
                  disabled={loading || !selectedQuote}>
                  {loading ? "Processing..." : "Swap Now"}
               </button>
            )}
         </div>
      </div>
   );
};

export default SwapComponent;
