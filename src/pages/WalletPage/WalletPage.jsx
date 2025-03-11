import React, {
   useContext,
   useEffect,
   useState,
   useCallback,
   memo,
} from "react";
import { WalletContext } from "../../context/WalletContext";
import { Link } from "react-router-dom";
import {
   Copy,
   Info,
   Eye,
   EyeOff,
   ArrowUp,
   ArrowDown,
   DollarSign,
   RefreshCw,
} from "lucide-react";
import "./WalletPage.css";

// Icon component for different cryptocurrencies
const CryptoIcon = memo(({ type }) => {
   const iconMap = {
      ethereum: { color: "#627EEA", symbol: "Ξ" },
      usdt: { color: "#26A17B", symbol: "₮" },
      usdc: { color: "#2775CA", symbol: "₮" },
      maga: { color: "#FF4500", symbol: "M" },
   };

   const icon = iconMap[type.toLowerCase()] || {
      color: "#888888",
      symbol: "?",
   };

   return (
      <div
         className="crypto-icon"
         style={{ backgroundColor: icon.color }}
         aria-label={`${type} icon`}>
         {icon.symbol}
      </div>
   );
});

// Transaction item component
const TransactionItem = memo(({ transaction }) => {
   return (
      <div className="transaction-item">
         <div className="transaction-left">
            <div className="transaction-icon">
               <CryptoIcon type={transaction.icon} />
            </div>
            <div className="transaction-info">
               <div className="transaction-type">{transaction.type}</div>
               <div className="transaction-address">{transaction.address}</div>
            </div>
         </div>
         <div className="transaction-amount">{transaction.amount}</div>
      </div>
   );
});

// Asset item component
const AssetItem = memo(({ asset }) => {
   const isPositiveChange = !asset.changePercent.includes("-");

   return (
      <div className="asset-item">
         <div className="asset-left">
            <div className="asset-icon">
               <CryptoIcon type={asset.icon} />
            </div>
            <div className="asset-info">
               <div className="asset-name">{asset.name}</div>
               <div className="asset-amount">{asset.displayAmount}</div>
            </div>
         </div>
         <div className="asset-right">
            <div className="asset-value">{asset.value}</div>
            <div
               className={`asset-change ${
                  isPositiveChange ? "positive" : "negative"
               }`}>
               <span className="change-amount">{asset.change}</span>
               <span className="change-percent">{asset.changePercent}</span>
            </div>
         </div>
      </div>
   );
});

// Loading modal component
const LoadingModal = memo(() => (
   <div
      className="loading-modal"
      role="dialog"
      aria-label="Loading wallet data">
      <div className="loading-content">
         <div className="loading-spinner"></div>
         <p>Loading wallet data...</p>
      </div>
   </div>
));

const WalletPage = () => {
   const {
      address,
      balance,
      transactions,
      updateBalance,
      assets: contextAssets,
   } = useContext(WalletContext);

   const [totalBalance, setTotalBalance] = useState("$0.00");
   const [changeAmount, setChangeAmount] = useState("$0.00");
   const [changePercent, setChangePercent] = useState("0.00%");
   const [assets, setAssets] = useState([]);
   const [previousBalance, setPreviousBalance] = useState(0);
   const [isLoading, setIsLoading] = useState(true);
   const [hideBalance, setHideBalance] = useState(false);

   // Function to format the address for display
   const formatAddress = useCallback((addr) => {
      if (!addr) return "";
      return `${addr.substring(0, 8)}....${addr.substring(addr.length - 8)}`;
   }, []);

   // Calculate balance once when it updates
   const calculateBalance = useCallback((balanceValue) => {
      if (!balanceValue || isNaN(parseFloat(balanceValue))) return 0;

      const ethPrice = 2593.3; // In a real app, fetch this from an API
      return parseFloat(balanceValue) * ethPrice;
   }, []);

   // Copy address to clipboard
   const copyAddressToClipboard = useCallback(() => {
      if (address) {
         navigator.clipboard
            .writeText(address)
            .then(() => {
               // Show a toast notification (would be implemented in a real app)
               console.log("Address copied to clipboard");
            })
            .catch((err) => {
               console.error("Could not copy address:", err);
            });
      }
   }, [address]);

   // Toggle balance visibility
   const toggleBalanceVisibility = useCallback(() => {
      setHideBalance((prev) => !prev);
   }, []);

   // Fetch and update wallet data
   useEffect(() => {
      const fetchData = async () => {
         setIsLoading(true);
         try {
            if (balance) {
               const balanceUSD = calculateBalance(balance);

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

               // Set assets based on context or create defaults if none
               if (contextAssets && contextAssets.length > 0) {
                  setAssets(contextAssets);
               } else {
                  // Default empty assets with zero values
                  setAssets([
                     {
                        name: "Ethereum",
                        symbol: "ETH",
                        amount: "0.0000 ETH",
                        displayAmount: "0.0000 ETH",
                        value: "$0.00",
                        change: "$0.00",
                        changePercent: "0.00%",
                        icon: "ethereum",
                     },
                     {
                        name: "USDT",
                        symbol: "USDT",
                        amount: "0.00 USDT",
                        displayAmount: "0.00 USDT",
                        value: "$0.00",
                        change: "$0.00",
                        changePercent: "0.00%",
                        icon: "usdt",
                     },
                     {
                        name: "USDC",
                        symbol: "USDC",
                        amount: "0.00 USDC",
                        displayAmount: "0.00 USDC",
                        value: "$0.00",
                        change: "$0.00",
                        changePercent: "0.00%",
                        icon: "usdc",
                     },
                  ]);
               }
            }
         } catch (error) {
            console.error("Error loading wallet data:", error);
         } finally {
            setIsLoading(false);
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
   }, [
      balance,
      address,
      updateBalance,
      previousBalance,
      contextAssets,
      calculateBalance,
   ]);

   // Prepare data for display
   const truncatedAddress = formatAddress(address);
   const walletTransactions =
      transactions && transactions.length > 0 ? transactions : [];
   const displayBalance = hideBalance ? "••••••" : totalBalance || "$0.00";

   return (
      <div className="wallet-container">
         {isLoading && <LoadingModal />}

         <div className="wallet-header">
            <div className="wallet-logo">
               <svg
                  className="logo"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <rect
                     width="40"
                     height="40"
                     rx="8"
                     fill="#627EEA"
                     fillOpacity="0.1"
                  />
                  <path
                     d="M20 6L19.7 7.05V26.5L20 26.8L29.4 21.22L20 6Z"
                     fill="#627EEA"
                  />
                  <path d="M20 6L10.6 21.22L20 26.8V17.05V6Z" fill="#8DA3F0" />
                  <path
                     d="M20 28.86L19.84 29.05V34L20 34.4L29.4 23.28L20 28.86Z"
                     fill="#627EEA"
                  />
                  <path d="M20 34.4V28.86L10.6 23.28L20 34.4Z" fill="#8DA3F0" />
                  <path d="M20 26.8L29.4 21.22L20 17.05V26.8Z" fill="#36559D" />
                  <path
                     d="M10.6 21.22L20 26.8V17.05L10.6 21.22Z"
                     fill="#627EEA"
                  />
               </svg>
            </div>

            <div className="account-info">
               <div className="account-card">
                  <div className="account-icon">
                     <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="#F0F3FF" />
                        <path
                           d="M12 6C9.8 6 8 7.8 8 10C8 11.5 8.8 12.8 10 13.5V14C10 14.6 9.6 15 9 15C8.4 15 8 14.6 8 14H6C6 15.7 7.3 17 9 17C10.3 17 11.4 16.2 11.8 15H12.2C12.6 16.2 13.7 17 15 17C16.7 17 18 15.7 18 14H16C16 14.6 15.6 15 15 15C14.4 15 14 14.6 14 14V13.5C15.2 12.8 16 11.5 16 10C16 7.8 14.2 6 12 6ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8Z"
                           fill="#627EEA"
                        />
                     </svg>
                  </div>
                  <div className="account-details">
                     <span className="account-name">Account 1</span>
                     <span className="account-address">{truncatedAddress}</span>
                  </div>
                  <button
                     className="copy-button"
                     onClick={copyAddressToClipboard}
                     aria-label="Copy address to clipboard">
                     <Copy size={18} />
                  </button>
               </div>
            </div>
         </div>

         <div className="balance-section">
            <div className="balance-header">
               <h2 className="balance-title">Total Balance</h2>
               <button className="info-button" aria-label="Balance information">
                  <Info size={18} />
               </button>
            </div>

            <div className="balance-amount">
               <h1 className="amount">{displayBalance}</h1>
               <button
                  className="eye-button"
                  onClick={toggleBalanceVisibility}
                  aria-label={hideBalance ? "Show balance" : "Hide balance"}>
                  {hideBalance ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
            </div>

            <div
               className={`balance-change ${
                  !changeAmount.includes("-") ? "positive" : "negative"
               }`}>
               <span className="change-amount">{changeAmount}</span>
               <span className="change-percent">{changePercent}</span>
            </div>
         </div>

         <div className="action-buttons">
            <button
               className="action-button send"
               aria-label="Send cryptocurrency">
               <ArrowUp size={22} />
               <span>Send</span>
            </button>

            <button
               className="action-button receive"
               aria-label="Receive cryptocurrency">
               <ArrowDown size={22} />
               <span>Receive</span>
            </button>

            <button
               className="action-button buy"
               aria-label="Buy cryptocurrency">
               <DollarSign size={22} />
               <span>Buy</span>
            </button>

            <button
               className="action-button exchange"
               aria-label="Exchange cryptocurrency">
               <RefreshCw size={18} />
               <span>EXCHANGE</span>
            </button>
         </div>

         <div className="content-sections">
            <div className="assets-section">
               <h3 className="section-title">Assets</h3>
               <div className="assets-list">
                  {assets.length > 0 ? (
                     assets.map((asset, index) => (
                        <AssetItem
                           key={`asset-${asset.symbol}-${index}`}
                           asset={asset}
                        />
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
                        <TransactionItem key={`tx-${index}`} transaction={tx} />
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
