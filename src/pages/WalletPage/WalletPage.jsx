// pages/WalletPage.jsx

import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "../../context/WalletContext";
import { Link } from "react-router-dom";
import "./WalletPage.css";

const WalletPage = () => {
   const { address, balance, transactions, updateBalance } =
      useContext(WalletContext);
   const [totalBalance, setTotalBalance] = useState("$0.00");
   const [changeAmount, setChangeAmount] = useState("$0.00");
   const [changePercent, setChangePercent] = useState("0.00%");
   const [assets, setAssets] = useState([]);
   const [previousBalance, setPreviousBalance] = useState(0);

   // Convert ETH balance to USD (simplified for demo)
   useEffect(() => {
      const fetchData = async () => {
         if (balance) {
            // Update the real balance from context
            const ethPrice = 2593.3; // In a real app, fetch this from an API
            const balanceUSD = parseFloat(balance) * ethPrice;

            // Calculate change from previous balance
            const change = balanceUSD - previousBalance;
            if (previousBalance > 0) {
               const percentChange = (change / previousBalance) * 100;
               setChangeAmount(
                  change >= 0
                     ? `+$${change.toFixed(2)}`
                     : `-$${Math.abs(change).toFixed(2)}`
               );
               setChangePercent(
                  change >= 0
                     ? `+${percentChange.toFixed(2)}%`
                     : `-${Math.abs(percentChange).toFixed(2)}%`
               );
            } else {
               setChangeAmount("$0.00");
               setChangePercent("0.00%");
            }

            // Update previous balance for next calculation
            if (balanceUSD > 0 && balanceUSD !== previousBalance) {
               setPreviousBalance(balanceUSD);
            }

            setTotalBalance(`$${balanceUSD.toFixed(2)}`);

            // Create assets based on real balance
            if (parseFloat(balance) > 0) {
               // Primary ETH asset
               const assets = [
                  {
                     name: "Ethereum",
                     symbol: "ETH",
                     amount: `${parseFloat(balance).toFixed(4)} ETH`,
                     displayAmount: `${parseFloat(balance).toFixed(1)} WETH`,
                     value: `$${(balanceUSD * 0.9).toFixed(2)}`, // Simulate 90% of balance is in ETH
                     change: "$2.12",
                     changePercent: "+14.45%",
                     icon: "ethereum",
                  },
               ];

               // Add MAGA and USDC as sample assets if balance is substantial
               if (balanceUSD > 50) {
                  assets.push(
                     {
                        name: "MAGA (Trump)",
                        symbol: "MAGA",
                        amount: "459 MAGA",
                        displayAmount: "459 MAGA",
                        value: "$14.06",
                        change: "$2.12",
                        changePercent: "+14.45%",
                        icon: "maga",
                     },
                     {
                        name: "USDC",
                        symbol: "USDC",
                        amount: "16.5 USDC",
                        displayAmount: "16.5 USDC",
                        value: "$16.50",
                        change: "$0.02",
                        changePercent: "+0.02%",
                        icon: "usdc",
                     }
                  );
               }

               setAssets(assets);
            } else {
               // Default assets to display when user has no deposits
               setAssets([
                  {
                     name: "Ethereum",
                     symbol: "ETH",
                     amount: "0.1 WETH",
                     displayAmount: "0.1 WETH",
                     value: "$259.33",
                     change: "$2.12",
                     changePercent: "+14.45%",
                     icon: "ethereum",
                  },
                  {
                     name: "MAGA (Trump)",
                     symbol: "MAGA",
                     amount: "459 MAGA",
                     displayAmount: "459 MAGA",
                     value: "$14.06",
                     change: "$2.12",
                     changePercent: "+14.45%",
                     icon: "maga",
                  },
                  {
                     name: "USDC",
                     symbol: "USDC",
                     amount: "16.5 USDC",
                     displayAmount: "16.5 USDC",
                     value: "$16.50",
                     change: "$0.02",
                     changePercent: "+0.02%",
                     icon: "usdc",
                  },
               ]);
            }
         }
      };

      fetchData();

      // Set up interval to refresh balance periodically
      const intervalId = setInterval(() => {
         if (address) {
            updateBalance(address);
         }
      }, 30000); // Update every 30 seconds

      return () => clearInterval(intervalId);
   }, [balance, address, updateBalance, previousBalance]);

   const truncatedAddress = address
      ? `0xA33de0....aD77638`
      : "0xA33de0....aD77638";

   // Sample transaction data that matches the format in the image
   // In a real app, this would come from the WalletContext
   const walletTransactions =
      transactions && transactions.length > 0
         ? transactions
         : [
              {
                 type: "Send",
                 address: "0x49E/fa...D77638",
                 amount: "0.05 ETH",
                 icon: "ethereum",
              },
              {
                 type: "Send",
                 address: "0x49E/fa...D77638",
                 amount: "103.50 USDC",
                 icon: "ethereum",
              },
              {
                 type: "Send",
                 address: "0x49E/fa...D77638",
                 amount: "0.12 ETH",
                 icon: "ethereum",
              },
              {
                 type: "Recieve",
                 address: "0xD07f3...D77638",
                 amount: "120 USDC",
                 icon: "ethereum",
              },
           ];

   return (
      <div className="wallet-container">
         <div className="wallet-header">
            <div className="wallet-logo">
               <img
                  src="/path-to-logo.png"
                  alt="Wallet Logo"
                  className="logo"
               />
            </div>

            <div className="account-info">
               <div className="account-card">
                  <div className="account-icon">
                     <img src="/path-to-icon.png" alt="Account Icon" />
                  </div>
                  <div className="account-details">
                     <span className="account-name">Account 1</span>
                     <span className="account-address">{truncatedAddress}</span>
                  </div>
                  <div className="copy-button">
                     <img src="/path-to-copy-icon.png" alt="Copy" />
                  </div>
               </div>
            </div>
         </div>

         <div className="balance-section">
            <div className="balance-header">
               <h2 className="balance-title">Total Balance</h2>
               <button className="info-button">
                  <img src="/path-to-info-icon.png" alt="Info" />
               </button>
            </div>

            <div className="balance-amount">
               <h1 className="amount">{totalBalance || "$289.89"}</h1>
               <button className="eye-button">
                  <img src="/path-to-eye-icon.png" alt="Toggle visibility" />
               </button>
            </div>

            <div className="balance-change">
               <span className="change-amount">
                  ({changeAmount || "+$3.714"})
               </span>
               <span className="change-percent">
                  {changePercent || "+12.38%"}
               </span>
            </div>
         </div>

         <div className="action-buttons">
            <button className="action-button send">
               <img src="/path-to-send-icon.png" alt="Send" />
            </button>

            <button className="action-button receive">
               <img src="/path-to-receive-icon.png" alt="Receive" />
            </button>

            <button className="action-button buy">
               <img src="/path-to-buy-icon.png" alt="Buy" />
            </button>

            <button className="action-button exchange">
               <img src="/path-to-exchange-icon.png" alt="Exchange" />
               <span>EXCHANGE</span>
            </button>
         </div>

         <div className="content-sections">
            <div className="assets-section">
               <h3 className="section-title">Assets</h3>
               <div className="assets-list">
                  {assets.length > 0 ? (
                     assets.map((asset, index) => (
                        <div className="asset-item" key={index}>
                           <div className="asset-left">
                              <div className="asset-icon">
                                 <div className="eth-icon"></div>
                              </div>
                              <div className="asset-info">
                                 <div className="asset-name">{asset.name}</div>
                                 <div className="asset-amount">
                                    {asset.displayAmount}
                                 </div>
                              </div>
                           </div>
                           <div className="asset-right">
                              <div className="asset-value">{asset.value}</div>
                              <div className="asset-change">
                                 <span className="change-amount">
                                    {asset.change}
                                 </span>
                                 <span className="change-percent">
                                    {asset.changePercent}
                                 </span>
                              </div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="no-assets">
                        <p>No assets yet. Deposit funds to get started.</p>
                     </div>
                  )}
               </div>
            </div>

            <div className="activity-section">
               <h3 className="section-title">Activity</h3>
               <div className="transactions-list">
                  {walletTransactions.length > 0 ? (
                     walletTransactions.map((tx, index) => (
                        <div className="transaction-item" key={index}>
                           <div className="transaction-left">
                              <div className="transaction-icon">
                                 <div className="eth-icon"></div>
                              </div>
                              <div className="transaction-info">
                                 <div className="transaction-type">
                                    {tx.type}
                                 </div>
                                 <div className="transaction-address">
                                    {tx.address}
                                 </div>
                              </div>
                           </div>
                           <div className="transaction-amount">{tx.amount}</div>
                        </div>
                     ))
                  ) : (
                     <div className="no-transactions">
                        <p>No transactions yet.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default WalletPage;
