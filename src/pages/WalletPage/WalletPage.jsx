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
   X,
   CheckCircle,
   AlertCircle,
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
// New Modal Components
const Modal = ({ isOpen, onClose, title, children }) => {
   if (!isOpen) return null;

   return (
      <div className="modal-overlay" onClick={onClose}>
         <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h2>{title}</h2>
               <button
                  className="close-button"
                  onClick={onClose}
                  aria-label="Close modal">
                  <X size={20} />
               </button>
            </div>
            <div className="modal-content">{children}</div>
         </div>
      </div>
   );
};

const SendModal = ({ isOpen, onClose, assets }) => {
   const [recipient, setRecipient] = useState("");
   const [amount, setAmount] = useState("");
   const [selectedAsset, setSelectedAsset] = useState(
      assets[0]?.symbol || "ETH"
   );
   const [status, setStatus] = useState(null); // null, 'pending', 'success', 'error'

   const resetForm = () => {
      setRecipient("");
      setAmount("");
      setStatus(null);
   };

   const handleClose = () => {
      resetForm();
      onClose();
   };

   const handleSend = async (e) => {
      e.preventDefault();

      if (!recipient || !amount) return;

      try {
         setStatus("pending");

         // In a real application, you would call your web3 provider here
         // const tx = await web3.eth.sendTransaction({
         //   from: address,
         //   to: recipient,
         //   value: web3.utils.toWei(amount, 'ether')
         // });

         // Simulate transaction delay
         await new Promise((resolve) => setTimeout(resolve, 1500));

         setStatus("success");

         // After success timeout, close the modal
         setTimeout(() => {
            handleClose();
         }, 2000);
      } catch (error) {
         console.error("Transaction failed:", error);
         setStatus("error");
      }
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={status ? null : handleClose}
         title="Send Assets">
         {status === "pending" && (
            <div className="transaction-status pending">
               <div className="loading-spinner"></div>
               <p>Processing transaction...</p>
            </div>
         )}

         {status === "success" && (
            <div className="transaction-status success">
               <CheckCircle size={48} />
               <p>Transaction sent successfully!</p>
            </div>
         )}

         {status === "error" && (
            <div className="transaction-status error">
               <AlertCircle size={48} />
               <p>Transaction failed. Please try again.</p>
               <button
                  className="primary-button"
                  onClick={() => setStatus(null)}>
                  Try Again
               </button>
            </div>
         )}

         {!status && (
            <form onSubmit={handleSend} className="send-form">
               <div className="form-group">
                  <label htmlFor="asset">Asset</label>
                  <select
                     id="asset"
                     value={selectedAsset}
                     onChange={(e) => setSelectedAsset(e.target.value)}>
                     {assets.map((asset) => (
                        <option key={asset.symbol} value={asset.symbol}>
                           {asset.name} ({asset.symbol})
                        </option>
                     ))}
                  </select>
               </div>

               <div className="form-group">
                  <label htmlFor="recipient">Recipient Address</label>
                  <input
                     id="recipient"
                     type="text"
                     placeholder="0x..."
                     value={recipient}
                     onChange={(e) => setRecipient(e.target.value)}
                     required
                  />
               </div>

               <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <input
                     id="amount"
                     type="number"
                     step="0.000001"
                     min="0"
                     placeholder="0.00"
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     required
                  />
                  <span className="input-suffix">{selectedAsset}</span>
               </div>

               <div className="form-footer">
                  <button
                     type="button"
                     className="secondary-button"
                     onClick={handleClose}>
                     Cancel
                  </button>
                  <button type="submit" className="primary-button">
                     Send
                  </button>
               </div>
            </form>
         )}
      </Modal>
   );
};

const ReceiveModal = ({ isOpen, onClose, address }) => {
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

   return (
      <Modal isOpen={isOpen} onClose={onClose} title="Receive Assets">
         <div className="receive-container">
            <div className="qr-code">
               {/* In a real app, you would generate a QR code here */}
               <div className="qr-placeholder">
                  {/* This would be replaced with an actual QR code library */}
                  <svg
                     width="180"
                     height="180"
                     viewBox="0 0 180 180"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                     <rect width="180" height="180" fill="#F5F7FF" />
                     <path d="M40 40H70V70H40V40Z" fill="#1F2937" />
                     <path d="M80 40H90V50H80V40Z" fill="#1F2937" />
                     <path d="M100 40H130V70H100V40Z" fill="#1F2937" />
                     <path d="M40 80H50V90H40V80Z" fill="#1F2937" />
                     <path d="M60 80H70V90H60V80Z" fill="#1F2937" />
                     <path d="M90 80H100V90H90V80Z" fill="#1F2937" />
                     <path d="M110 80H120V90H110V80Z" fill="#1F2937" />
                     <path d="M40 100H70V130H40V100Z" fill="#1F2937" />
                     <path d="M80 110H90V120H80V110Z" fill="#1F2937" />
                     <path d="M100 100H130V130H100V100Z" fill="#1F2937" />
                  </svg>
               </div>
            </div>

            <div className="address-container">
               <p className="address-label">Your Wallet Address</p>
               <div className="address-value">{address}</div>
               <button
                  className="copy-address-button"
                  onClick={copyAddressToClipboard}
                  aria-label="Copy address to clipboard">
                  <Copy size={18} />
                  <span>Copy Address</span>
               </button>
            </div>

            <div className="receive-warning">
               <p>
                  Only send Ethereum and ERC-20 tokens to this address. Sending
                  other types of tokens may result in permanent loss.
               </p>
            </div>
         </div>
      </Modal>
   );
};
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
   const [isSendModalOpen, setIsSendModalOpen] = useState(false);
   const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

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

         {/* Send Modal */}
         <SendModal
            isOpen={isSendModalOpen}
            onClose={() => setIsSendModalOpen(false)}
            assets={assets}
         />

         {/* Receive Modal */}
         <ReceiveModal
            isOpen={isReceiveModalOpen}
            onClose={() => setIsReceiveModalOpen(false)}
            address={address}
         />

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
               onClick={() => setIsSendModalOpen(true)}
               aria-label="Send cryptocurrency">
               <ArrowUp size={22} />
               <span>Send</span>
            </button>

            <button
               className="action-button receive"
               onClick={() => setIsReceiveModalOpen(true)}
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
               <span>Exchange</span>
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
