import React, { useState, useEffect } from "react";
import { useWallet } from "../../context/WalletContext";
import { useToken } from "@reservoir0x/relay-kit-hooks";

const TokenSwapInput = ({ onSwapDetailsChange, availableTokens = [] }) => {
   const { account } = useWallet();
   const [fromToken, setFromToken] = useState(
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
   ); // Default to ETH
   const [toToken, setToToken] = useState("");
   const [amount, setAmount] = useState("");

   const { data: fromTokenData } = useToken({
      address: fromToken,
      chainId: 534351, // Scroll Sepolia
   });

   const { data: toTokenData } = useToken({
      address: toToken,
      chainId: 534351, // Scroll Sepolia
      enabled: Boolean(toToken),
   });

   useEffect(() => {
      if (fromToken && amount && toToken) {
         onSwapDetailsChange({
            fromToken,
            toToken,
            amount,
            walletAddress: account,
         });
      }
   }, [fromToken, toToken, amount, account, onSwapDetailsChange]);

   return (
      <div className="card mb-4">
         <div className="card-body">
            <h5 className="card-title">Swap Tokens</h5>

            <div className="mb-3">
               <label className="form-label">From Token</label>
               <select
                  className="form-select"
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}>
                  <option value="0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee">
                     ETH
                  </option>
                  {availableTokens.map((token) => (
                     <option key={token.address} value={token.address}>
                        {token.symbol} - {token.name}
                     </option>
                  ))}
               </select>
               {fromTokenData && (
                  <small className="text-muted">
                     Symbol: {fromTokenData.symbol} | Decimals:{" "}
                     {fromTokenData.decimals}
                  </small>
               )}
            </div>

            <div className="mb-3">
               <label className="form-label">Amount</label>
               <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  min="0"
                  step="0.000001"
               />
            </div>

            <div className="mb-3">
               <label className="form-label">To Token</label>
               <select
                  className="form-select"
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}>
                  <option value="">Select token</option>
                  {availableTokens.map((token) => (
                     <option key={token.address} value={token.address}>
                        {token.symbol} - {token.name}
                     </option>
                  ))}
               </select>
               {toTokenData && (
                  <small className="text-muted">
                     Symbol: {toTokenData.symbol} | Decimals:{" "}
                     {toTokenData.decimals}
                  </small>
               )}
            </div>
         </div>
      </div>
   );
};

export default TokenSwapInput;
