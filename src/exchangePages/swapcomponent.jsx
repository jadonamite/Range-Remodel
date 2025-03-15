import React, { useState, useContext, useEffect } from "react";
import { WalletContext } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";

const SwapComponent = () => {
   const { getSwapQuotes, executeSwap, SCROLL_TOKENS, address } =
      useContext(WalletContext);

   // Add native ETH to the tokens list for UI display
   const enhancedTokens = {
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
         symbol: "ETH",
         name: "Ethereum",
         decimals: 18,
         isNative: true,
      },
      ...SCROLL_TOKENS,
   };
   const navigate = useNavigate();

   // Create a mapping of symbol to address for reverse lookup
   const symbolToAddress = Object.entries(enhancedTokens).reduce(
      (acc, [address, token]) => {
         acc[token.symbol] = address;
         return acc;
      },
      {}
   );

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

   // Format amount based on token decimals
   const formatAmountWithDecimals = (amt, tokenAddress) => {
      if (!amt) return "0";
      const tokenInfo = enhancedTokens[tokenAddress];
      if (!tokenInfo) return amt;

      // For display purposes only - ensure string format
      return amt.toString();
   };

   // Handler for fetching quotes
   // In your handleGetQuotes function in SwapComponent.jsx, make these changes:

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
         // Ensure both token parameters are addresses, not symbols
         const fromTokenAddress = fromToken;
         const toTokenAddress = toToken;

         // Format amount as string
         const formattedAmount = amount.toString();

         console.log("Requesting quotes with params:", {
            fromTokenAddress,
            toTokenAddress,
            amount: formattedAmount,
         });

         const quotesResult = await getSwapQuotes(
            fromTokenAddress,
            toTokenAddress,
            formattedAmount
         );

         if (quotesResult && quotesResult.length > 0) {
            setQuotes(quotesResult);
            setIsQuotesFetched(true);
         } else {
            setError("No quotes available for this swap");
         }
      } catch (err) {
         console.error("Quote error details:", err);
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
         console.error("Swap execution error:", err);
         setError(`Error executing swap: ${err.message}`);
      } finally {
         setLoading(false);
      }
   };

   // Get token symbol from address
   const getTokenSymbol = (address) => {
      return enhancedTokens[address]?.symbol || "Unknown";
   };

   // Get token name from address
   console.log("Requesting quotes with params:", {
      fromToken,
      toToken,
      amount,
   });
   const getTokenName = (address) => {
      return enhancedTokens[address]?.name || "Unknown Token";
   };

   // Format price to display with appropriate units
   const formatPrice = (quote) => {
      if (!quote || !quote.price) return "";
      return `1 ${getTokenSymbol(fromToken)} = ${Number(quote.price).toFixed(
         6
      )} ${getTokenSymbol(toToken)}`;
   };

   // Calculate and format the estimated output amount
   const formatOutputAmount = (quote) => {
      if (!quote || !quote.estimatedOutput) return "";
      return `≈ ${Number(quote.estimatedOutput).toFixed(6)} ${getTokenSymbol(
         toToken
      )}`;
   };
   const handleBack = () => {
      // Optionally reset any state if needed
      setFromToken("");
      setToToken("");
      setAmount("");
      setQuotes([]);
      setSelectedQuote(null);
      setIsQuotesFetched(false);
      setError("");
      setSuccess("");

      // Navigate back to the wallet page
      navigate("/wallet");
   };

   // Component JSX with enhanced UI
   return (
      <div className="p-6 max-w-lg mx-auto bg-custom-bg rounded-xl shadow-lg">
         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Swap
         </h2>

         {/* Debug Information - Keep for development */}
         <div className="mb-4 p-3 bg-[#111827] text-xs font-mono overflow-x-auto rounded-lg border border-gray-200">
            <p>From Token: {fromToken}</p>
            <p>To Token: {toToken}</p>
            <p>Amount: {amount}</p>
            <p>User Address: {address}</p>
         </div>

         {/* Error and Success Messages */}
         {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md animate-fadeIn">
               {error}
            </div>
         )}

         {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md animate-fadeIn">
               {success}
            </div>
         )}

         <div className="space-y-4">
            {/* From Token Selection */}
            <div className="bg-white p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
               </label>
               <div className="flex items-center space-x-2">
                  <select
                     className="flex-grow p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                     value={fromToken}
                     onChange={(e) => setFromToken(e.target.value)}>
                     <option value="">Select token</option>
                     {Object.entries(enhancedTokens).map(([address, token]) => (
                        <option key={address} value={address}>
                           {token.symbol} - {token.name}
                        </option>
                     ))}
                  </select>

                  <input
                     type="text"
                     placeholder="Amount"
                     className="w-1/3 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                     value={amount}
                     onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                           setAmount(value);
                        }
                     }}
                     inputMode="decimal"
                  />
               </div>
            </div>

            {/* Swap Direction Indicator */}
            <div className="flex justify-center">
               <button
                  className="p-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                  onClick={() => {
                     const temp = fromToken;
                     setFromToken(toToken);
                     setToToken(temp);
                  }}>
                  ⇅
               </button>
            </div>

            {/* To Token Selection */}
            <div className="bg-white p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
               </label>
               <select
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}>
                  <option value="">Select token</option>
                  {Object.entries(enhancedTokens).map(([address, token]) => (
                     <option key={address} value={address}>
                        {token.symbol} - {token.name}
                     </option>
                  ))}
               </select>

               {selectedQuote && (
                  <div className="mt-2 text-right text-gray-600 animate-fadeIn">
                     {formatOutputAmount(selectedQuote)}
                  </div>
               )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-4 mt-6">
               <button
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-300 transform hover:translate-y-[-2px]"
                  onClick={handleGetQuotes}
                  disabled={loading || !fromToken || !toToken || !amount}>
                  {loading && !isQuotesFetched ? (
                     <span className="flex items-center justify-center">
                        <svg
                           className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24">
                           <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"></circle>
                           <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                     </span>
                  ) : (
                     "Get Quotes"
                  )}
               </button>
            </div>

            {/* Quotes Display */}
            {quotes.length > 0 && (
               <div className="mt-6 animate-fadeIn">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">
                     Available Quotes
                  </h3>
                  <div className="space-y-3">
                     {quotes.map((quote, index) => (
                        <div
                           key={index}
                           className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                              selectedQuote === quote
                                 ? "border-blue-500 bg-blue-50 selected-quote"
                                 : "border-gray-200"
                           }`}
                           onClick={() => setSelectedQuote(quote)}>
                           <div className="flex justify-between">
                              <span className="font-medium flex items-center">
                                 {quote.source || "Unknown Source"}
                              </span>
                              <span className="text-green-600 font-medium">
                                 {formatPrice(quote)}
                              </span>
                           </div>

                           <div className="flex justify-between text-sm text-gray-600 mt-2">
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
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-300 transform hover:translate-y-[-2px]"
                  onClick={handleExecuteSwap}
                  disabled={loading || !selectedQuote}>
                  {loading ? (
                     <span className="flex items-center justify-center">
                        <svg
                           className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24">
                           <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"></circle>
                           <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                     </span>
                  ) : (
                     "Swap Now"
                  )}
               </button>
            )}
         </div>
         <button
            onClick={handleBack}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <svg
               xmlns="http://www.w3.org/2000/svg"
               className="h-5 w-5 mr-1"
               viewBox="0 0 20 20"
               fill="currentColor">
               <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
               />
            </svg>
            Back to Wallet
         </button>
         <button
            onClick={handleBack}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <svg
               xmlns="http://www.w3.org/2000/svg"
               className="h-5 w-5 mr-1"
               viewBox="0 0 20 20"
               fill="currentColor">
               <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
               />
            </svg>
            Back to Wallet
         </button>
      </div>
   );
};

export default SwapComponent;
