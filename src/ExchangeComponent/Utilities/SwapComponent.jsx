import React, { useState, useCallback, useEffect } from "react";
import { useQuote, useTokenList } from "@reservoir0x/relay-kit-hooks";
import { useWallet } from "../../context/WalletContext";

import TokenSwapInput from "./TokenSwapInput";
import SwapExecution from "./SwapExecution";
import TransactionStatus from "./TransactionStatus";

const SwapComponent = () => {
   const { account, chainId } = useWallet();
   const [swapDetails, setSwapDetails] = useState(null);
   const [availableTokens, setAvailableTokens] = useState([]);
   const [txHash, setTxHash] = useState("");

   // Set chain ID (default to Scroll Sepolia if not available)
   const currentChainId = chainId || 534351;

   // Fetch token list
   const { data: tokenList } = useTokenList({
      chainId: currentChainId,
   });

   useEffect(() => {
      if (tokenList) {
         setAvailableTokens(tokenList);
      }
   }, [tokenList]);

   // Get quote when swap details change
   const {
      data: quoteData,
      isLoading: isQuoteLoading,
      error: quoteError,
   } = useQuote({
      fromToken: swapDetails?.fromToken,
      toToken: swapDetails?.toToken,
      amount: swapDetails?.amount,
      walletAddress: account,
      chainId: currentChainId,
      enabled: Boolean(
         swapDetails?.fromToken && swapDetails?.toToken && swapDetails?.amount
      ),
   });

   const handleSwapDetailsChange = useCallback((details) => {
      setSwapDetails(details);
   }, []);

   const handleSwapComplete = useCallback((data) => {
      if (data?.txHash) {
         setTxHash(data.txHash);
      }
   }, []);

   return (
      <div className="container my-4">
         <h2 className="mb-4">Token Swap</h2>

         {txHash && (
            <TransactionStatus txHash={txHash} chainId={currentChainId} />
         )}

         <div className="row">
            <div className="col-md-6">
               <TokenSwapInput
                  onSwapDetailsChange={handleSwapDetailsChange}
                  availableTokens={availableTokens}
               />
            </div>

            <div className="col-md-6">
               {swapDetails && (
                  <div className="card mb-4">
                     <div className="card-body">
                        <h5 className="card-title">Swap Quote</h5>

                        {isQuoteLoading && <div>Loading quote...</div>}

                        {quoteError && (
                           <div className="alert alert-danger">
                              Error:{" "}
                              {quoteError.message || "Failed to get quote"}
                           </div>
                        )}

                        {quoteData && (
                           <div>
                              <div className="mb-3">
                                 <strong>From:</strong> {swapDetails.amount}{" "}
                                 {quoteData.fromToken?.symbol}
                              </div>
                              <div className="mb-3">
                                 <strong>To:</strong> {quoteData.toAmount}{" "}
                                 {quoteData.toToken?.symbol}
                              </div>
                              <div className="mb-3">
                                 <strong>Price Impact:</strong>{" "}
                                 {quoteData.priceImpact}%
                              </div>
                              <div className="mb-3">
                                 <strong>Gas Fee:</strong> {quoteData.gasFee}{" "}
                                 ETH
                              </div>

                              <SwapExecution
                                 quoteId={quoteData.quoteId}
                                 onSwapComplete={handleSwapComplete}
                              />
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default SwapComponent;
