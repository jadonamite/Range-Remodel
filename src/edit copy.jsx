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
   ExternalLink,
   Activity,
   Wifi,
   WifiOff,
   Clock,
} from "lucide-react";
import "./WalletPage.css";
const CryptoIcon = memo(({ type }) => {
   // Crypto Icons: Maps type to color and symbol, defaults to grey '?'
   const iconMap = {
      /* ... */
   };
   const icon = iconMap[type.toLowerCase()] || {
      color: "#888888",
      symbol: "?",
   };
   return (
      <div className="crypto-icon" style={{ backgroundColor: icon.color }}>
         {icon.symbol}
      </div>
   );
});

const TransactionItem = memo(({ transaction, network }) => {
   // Transactions: Displays time, address, amount, and explorer link.
   const formattedTime = new Date(transaction.timestamp).toLocaleString();
   const explorerBaseUrl =
      network === "Scroll Mainnet"
         ? "https://scrollscan.com/tx/"
         : "https://sepolia.scrollscan.com/tx/";
   return (
      <div className="transaction-item">
         {/* ... */}
         <div className="transaction-right">
            <div className="transaction-amount">{transaction.amount}</div>
            {transaction.txHash && (
               <a
                  href={`${explorerBaseUrl}${transaction.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  View
               </a>
            )}
         </div>
      </div>
   );
});

const AssetItem = memo(({ asset, onSelect }) => {
   // Assets: Shows asset name, amount, value, and change percentage.
   const isPositiveChange = !asset.changePercent.includes("-");
   return (
      <div className="asset-item" onClick={() => onSelect && onSelect(asset)}>
         {/* ... */}
         <div
            className={`asset-change ${
               isPositiveChange ? "positive" : "negative"
            }`}>
            <span>{asset.change}</span>
            <span>{asset.changePercent}</span>
         </div>
      </div>
   );
});

const NetworkStatus = memo(({ status, network }) => {
   // Network Status: Displays connection status and latency.
   const { connected, latency } = status;
   const networkName = network.name || "Scroll Network";
   return (
      <div className="network-status">
         {connected ? (
            <div>Connected ({latency}ms)</div>
         ) : (
            <div>Connecting...</div>
         )}
      </div>
   );
});

const LoadingModal = memo(() => {
   // Loading Modal: Shows a spinner and loading message.
   return (
      <div className="loading-modal">
         <div className="loading-spinner"></div>
         <p>Loading...</p>
      </div>
   );
});

const Modal = ({ isOpen, onClose, title, children }) => {
   // Modal: A reusable modal component.
   if (!isOpen) return null;
   return (
      <div className="modal-overlay" onClick={onClose}>
         <div className="modal-container">{/* ... */}</div>
      </div>
   );
};

const SendModal = ({ isOpen, onClose, assets, onSend, network }) => {
   // Send Modal: Handles sending transactions, including form and status.
   const [recipient, setRecipient] = useState("");
   const [amount, setAmount] = useState("");
   const [status, setStatus] = useState(null);
   // ... (form handling, send logic, status updates)
   return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Send on ${network}`}>
         {/* ... */}
      </Modal>
   );
};

const ReceiveModal = ({ isOpen, onClose, address, network }) => {
   // Receive Modal: Displays wallet address and QR code.
   const [copied, setCopied] = useState(false);
   // ... (copy address functionality)
   return (
      <Modal isOpen={isOpen} onClose={onClose} title="Receive">
         {/* ... */}
      </Modal>
   );
};

const NetworkSwitch = memo(({ currentNetwork, onSwitch }) => {
   // Network Switch: Allows switching between mainnet and testnet.
   const [isOpen, setIsOpen] = useState(false);
   // ... (dropdown logic)
   return <div className="network-switch">{/* ... */}</div>;
});

const WalletConnection = () => {
   // Wallet Connection: Handles wallet creation, import, and reconnection.
   const {
      isConnected,
      isWalletExisting,
      createWallet,
      importWallet,
      loadWallet,
   } = useContext(WalletContext);
   const [password, setPassword] = useState("");
   const [recoveryPhrase, setRecoveryPhrase] = useState("");
   const [error, setError] = useState("");
   // ... (form handling, wallet logic)
   return <div className="wallet-connection">{/* ... */}</div>;
};

const WalletPage = () => {
   const {
      address,
      assets: contextAssets,
      balance,
      transactions,
      updateBalance,

      isConnected,
      WalletConnection,
      network,
      networkStatus,
      switchNetwork,
      disconnectWallet,
      sessionExpiresAt,
      extendSession,
      sendTransaction,
      sendToken,
      SCROLL_TOKENS,
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
   const [refreshing, setRefreshing] = useState(false);
   const [timeRemaining, setTimeRemaining] = useState("");
   React.useEffect(() => {
      if (!sessionExpiresAt) return;

      const updateTimer = () => {
         const now = new Date().getTime();
         const remaining = sessionExpiresAt - now;

         if (remaining <= 0) {
            setTimeRemaining("Expired");
            return;
         }

         const minutes = Math.floor(remaining / 60000);
         const seconds = Math.floor((remaining % 60000) / 1000);
         setTimeRemaining(`${minutes}m ${seconds}s`);
      };

      updateTimer();
      const timerId = setInterval(updateTimer, 1000);

      return () => clearInterval(timerId);
   }, [sessionExpiresAt]);

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

   // Handle refresh
   const handleRefresh = useCallback(async () => {
      if (refreshing || !address) return;

      setRefreshing(true);
      try {
         await updateBalance(address);
      } catch (error) {
         console.error("Error refreshing balance:", error);
      } finally {
         setTimeout(() => setRefreshing(false), 1000); // Minimum 1 second refresh animation
      }
   }, [address, updateBalance, refreshing]);

   // Handle network switch
   const handleNetworkSwitch = useCallback(
      async (networkType) => {
         try {
            setIsLoading(true);
            await switchNetwork(networkType);
         } catch (error) {
            console.error("Error switching networks:", error);
         } finally {
            setIsLoading(false);
         }
      },
      [switchNetwork]
   );

   // Handle send transaction
   const handleSendTransaction = useCallback(
      async (recipient, amount, asset, assetDetails) => {
         try {
            if (asset === "ETH") {
               return await sendTransaction(recipient, amount);
            } else {
               // Find token details
               const token = SCROLL_TOKENS[asset];
               if (!token) throw new Error("Token not supported");

               return await sendToken(
                  token.address,
                  recipient,
                  amount,
                  token.decimals
               );
            }
         } catch (error) {
            console.error("Error in transaction:", error);
            return { success: false, error: error.message };
         }
      },
      [sendTransaction, sendToken, SCROLL_TOKENS]
   );

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
                        name: "USD Coin",
                        symbol: "USDC",
                        amount: "0.00 USDC",
                        displayAmount: "0.00 USDC",
                        value: "$0.00",
                        change: "$0.00",
                        changePercent: "0.00%",
                        icon: "usdc",
                     },
                     {
                        name: "Tether USD",
                        symbol: "USDT",
                        amount: "0.00 USDT",
                        displayAmount: "0.00 USDT",
                        value: "$0.00",
                        change: "$0.00",
                        changePercent: "0.00%",
                        icon: "usdt",
                     },
                     {
                        name: "Scroll Token",
                        symbol: "SCR",
                        amount: "0.00 SCR",
                        displayAmount: "0.00 SCR",
                        value: "$0.00",
                        change: "$0.00",
                        changePercent: "0.00%",
                        icon: "scroll",
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
   const networkName = network?.name || "Scroll Sepolia";

   return (
      <div className="wallet-page">
         {isLoading && <LoadingModal />}
         {/* Send Modal */}
         <SendModal
            isOpen={isSendModalOpen}
            onClose={() => setIsSendModalOpen(false)}
            assets={assets}
            onSend={handleSendTransaction}
            network={networkName}
         />
         {/* Receive Modal */}
         <ReceiveModal
            isOpen={isReceiveModalOpen}
            onClose={() => setIsReceiveModalOpen(false)}
            address={address}
            network={networkName}
         />

         {/* Network status bar */}
         <div className="network-status-bar">
            <NetworkStatus status={networkStatus} network={network} />
            <NetworkSwitch
               currentNetwork={networkName}
               onSwitch={handleNetworkSwitch}
            />
         </div>
         <div className="wallet-header">
            <div className="wallet-logo">
               <svg
                  className="scroll-logo"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24">
                  <path
                     fill="#FFAC3A"
                     d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,18c-3.31,0-6-2.69-6-6
            s2.69-6,6-6s6,2.69,6,6S15.31,18,12,18z"
                  />
                  <path
                     fill="#FFAC3A"
                     d="M12,8v8M8,12h8"
                     stroke="#FFAC3A"
                     strokeWidth="2"
                  />
               </svg>
            </div>
            <div className="wallet-account">
               <div className="account-avatar">
                  <div className="avatar-circle"></div>
               </div>
               <div className="account-info">
                  <div className="account-name">Account 1</div>
                  <div className="account-address">{truncatedAddress}</div>
               </div>
               <button
                  className="copy-address"
                  onClick={copyAddressToClipboard}>
                  <Copy size={16} />
               </button>
            </div>
         </div>
         <div className="wallet-balance">
            <div className="balance-label">
               <span>Total Balance</span>
               <button
                  className="refresh-button"
                  onClick={handleRefresh}
                  disabled={refreshing}>
                  <RefreshCw
                     size={18}
                     className={refreshing ? "refreshing" : ""}
                  />
               </button>
            </div>
            <div className="balance-amount">
               <span>{displayBalance}</span>
               <button
                  className="toggle-visibility"
                  onClick={toggleBalanceVisibility}>
                  {hideBalance ? <Eye size={18} /> : <EyeOff size={18} />}
               </button>
            </div>
            <div className="balance-change">
               <span className="change-amount">{changeAmount}</span>
               <span className="change-percent">{changePercent}</span>
            </div>
         </div>
         <div className="wallet-actions">
            <button
               className="action-button send"
               onClick={() => setIsSendModalOpen(true)}
               aria-label="Send cryptocurrency">
               <ArrowUp size={20} />
               SEND
            </button>
            <button
               className="action-button receive"
               onClick={() => setIsReceiveModalOpen(true)}
               aria-label="Receive cryptocurrency">
               <ArrowDown size={20} />
               RECIEVE
            </button>

            <button
               className="action-button buy"
               aria-label="Buy cryptocurrency">
               <DollarSign size={20} />
               BUY
            </button>
            <button
               className="action-button exchange"
               aria-label="Exchange cryptocurrency">
               <RefreshCw size={20} />
               EXCHANGE
            </button>
         </div>
         <div className="wallet-content">
            <div className="wallet-section">
               <div className="section-header">
                  <h3>Assets</h3>
               </div>
               <div className="section-content">
                  {assets.length > 0 ? (
                     assets.map((asset, index) => (
                        <AssetItem
                           key={`${asset.symbol}-${index}`}
                           asset={asset}
                        />
                     ))
                  ) : (
                     <div className="empty-state">
                        <p>No assets yet. Deposit funds to get started.</p>
                     </div>
                  )}
               </div>
            </div>
            <div className="wallet-section">
               <div className="section-header">
                  <h3>Activity</h3>
               </div>
               <div className="section-content">
                  {walletTransactions.length > 0 ? (
                     walletTransactions.map((tx, index) => (
                        <TransactionItem
                           key={`tx-${index}`}
                           transaction={tx}
                           network={networkName}
                        />
                     ))
                  ) : (
                     <div className="empty-state">
                        <p>No transactions yet.</p>
                     </div>
                  )}
               </div>
               <button
                  className="btn btn-secondary"
                  onClick={() => setStatus(null)}>
                  Try Again
               </button>
            </div>
         </div>
      </div>
   );
};
export default WalletPage;
