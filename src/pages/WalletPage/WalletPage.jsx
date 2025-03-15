import React, {
   useContext,
   useEffect,
   useState,
   useCallback,
   memo,
} from "react";
import { useNavigate } from "react-router-dom";
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

// Toast notification component for feedback
const Toast = memo(({ message, type = "success", onClose }) => {
   useEffect(() => {
      const timer = setTimeout(() => {
         onClose();
      }, 3000);
      return () => clearTimeout(timer);
   }, [onClose]);

   return (
      <div className={`toast toast-${type}`}>
         {type === "success" ? (
            <CheckCircle size={16} />
         ) : (
            <AlertCircle size={16} />
         )}
         <span>{message}</span>
         <button className="toast-close" onClick={onClose}>
            <X size={14} />
         </button>
      </div>
   );
});

// Icon component for different cryptocurrencies
const CryptoIcon = memo(({ type }) => {
   const iconMap = {
      ethereum: { color: "#627EEA", symbol: "Ξ" },
      usdt: { color: "#26A17B", symbol: "₮" },
      usdc: { color: "#2775CA", symbol: "₮" },
      scroll: { color: "#FFAC3A", symbol: "S" }, // Scroll token
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
const TransactionItem = memo(({ transaction, network }) => {
   const formattedTime = new Date(transaction.timestamp).toLocaleString();
   const explorerBaseUrl =
      network === "Scroll Mainnet"
         ? "https://scrollscan.com/tx/"
         : "https://sepolia.scrollscan.com/tx/";
   return (
      <div className="transaction-item">
         <div className="transaction-left">
            <div className="transaction-icon">
               <CryptoIcon type={transaction.icon} />
            </div>
            <div className="transaction-info">
               <div className="transaction-type">{transaction.type}</div>
               <div className="transaction-address">{transaction.address}</div>
               <div className="transaction-time">{formattedTime}</div>
            </div>
         </div>
         <div className="transaction-right">
            <div className="transaction-amount">{transaction.amount}</div>
            {transaction.txHash && (
               <a
                  href={`${explorerBaseUrl}${transaction.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  View <ExternalLink size={12} />
               </a>
            )}
         </div>
      </div>
   );
});

// Asset item component
const AssetItem = memo(({ asset, onSelect }) => {
   const isPositiveChange = !asset.changePercent.includes("-");
   return (
      <div className="asset-item" onClick={() => onSelect && onSelect(asset)}>
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

// Network Status: Displays connection status and latency.
const NetworkStatus = memo(({ status, network }) => {
   const { connected, latency } = status;
   const networkName = network.name || "Scroll Network";
   return (
      <div className="network-status">
         {connected ? (
            <div className="network-connected">
               <Wifi size={14} />
               <span>
                  Connected <span className="text-green-500">{latency}ms</span>
               </span>
            </div>
         ) : (
            <div className="network-disconnected">
               <WifiOff size={14} /> <span>Connecting...({networkName})</span>
            </div>
         )}
      </div>
   );
});

// Loading Modal: Shows a spinner and customizable loading message.
const LoadingModal = memo(({ message = "Loading..." }) => {
   return (
      <div
         className="loading-modal"
         role="dialog"
         aria-label="Loading wallet data">
         <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Loading Scroll wallet data...</p>
            <p>{message}</p>
         </div>
      </div>
   );
});

// Modal: A reusable modal component.
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
                  <X size={24} />
               </button>
            </div>
            <div className="modal-content">{children}</div>
         </div>
      </div>
   );
};

const SessionExpiryModal = ({ isOpen, onExtend, onLogout }) => {
   return (
      <Modal isOpen={isOpen} onClose={() => {}} title="Session Expiring">
         <div className="session-expiry-modal">
            <AlertCircle size={48} className="warning-icon" />
            <p>Your session is about to expire for security reasons.</p>
            <div className="modal-actions">
               <button className="btn btn-primary" onClick={onExtend}>
                  Stay Logged In
               </button>
               <button className="btn btn-secondary" onClick={onLogout}>
                  Logout
               </button>
            </div>
         </div>
      </Modal>
   );
};
// Send Modal: Handles sending transactions, including form and status.
const SendModal = ({ isOpen, onClose, assets, onSend, network }) => {
   const [recipient, setRecipient] = useState("");
   const [amount, setAmount] = useState("");
   const [selectedAsset, setSelectedAsset] = useState(
      assets[0]?.symbol || "ETH"
   );
   const [txResult, setTxResult] = useState(null);
   const [gasEstimate, setGasEstimate] = useState(null);
   const [status, setStatus] = useState(null);
   const [errorMessage, setErrorMessage] = useState("");

   // Reset form when modal opens/closes
   useEffect(() => {
      if (isOpen) {
         setRecipient("");
         setAmount("");
         setSelectedAsset(assets[0]?.symbol || "ETH");
         setStatus(null);
         setErrorMessage("");
         setTxResult(null);
         setGasEstimate(null);
      }
   }, [isOpen, assets]);

   const resetForm = () => {
      setRecipient("");
      setAmount("");
      setStatus(null);
      setTxResult(null);
      setGasEstimate(null);
   };

   const handleClose = () => {
      resetForm();
      onClose();
   };

   // Get selected asset details
   const getSelectedAssetDetails = () => {
      return assets.find((asset) => asset.symbol === selectedAsset);
   };

   // Estimate gas (simplified for demo)
   const estimateGas = async () => {
      if (!recipient || !amount) return;

      // In a real app, this would call the blockchain
      // Here we'll just set a mock value based on network congestion
      const baseFee = selectedAsset === "ETH" ? 0.0002 : 0.0005;
      const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setGasEstimate({
         fee: baseFee * randomFactor,
         timeEstimate: "~30 seconds",
      });
   };

   useEffect(() => {
      if (recipient && amount && parseFloat(amount) > 0) {
         estimateGas();
      } else {
         setGasEstimate(null);
      }
   }, [recipient, amount, selectedAsset]);

   // Handle use maximum amount button
   const handleUseMax = () => {
      const selectedAssetDetails = getSelectedAssetDetails();
      if (selectedAssetDetails) {
         // Extract the numeric value from amount string (e.g. "0.5 ETH" -> "0.5")
         const numericAmount = parseFloat(selectedAssetDetails.amount);
         if (!isNaN(numericAmount)) {
            // For ETH, subtract the estimated gas fee
            if (selectedAsset === "ETH" && gasEstimate) {
               const maxAmount = Math.max(0, numericAmount - gasEstimate.fee);
               setAmount(maxAmount.toFixed(6));
            } else {
               setAmount(numericAmount.toFixed(6));
            }
         }
      }
   };

   // Handle send transaction

   const handleSubmit = async (e) => {
      e.preventDefault();

      // Validate form
      if (!recipient) {
         setErrorMessage("Please enter a valid recipient address");
         return;
      }

      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
         setErrorMessage("Please enter a valid amount");
         return;
      }

      setErrorMessage("");
      setStatus("sending");

      try {
         // Find the selected asset details
         const assetDetails = assets.find((a) => a.symbol === selectedAsset);

         const result = await onSend(
            recipient,
            amount,
            selectedAsset,
            assetDetails
         );

         if (result.success) {
            setStatus("success");
         } else {
            setStatus("error");
            setErrorMessage(
               result.error || "Transaction failed. Please try again."
            );
         }
      } catch (error) {
         setStatus("error");
         setErrorMessage(error.message || "An unexpected error occurred");
      }
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}
         title={`Send ${selectedAsset} on ${network}`}>
         {status === "pending" && (
            <div className="status-container pending">
               <div className="loading-spinner">
                  <RefreshCw size={32} className="spinning" />
               </div>
               <h4>Processing Transaction</h4>
               <p>Please wait while your transaction is being processed...</p>
            </div>
         )}

         {status === "success" && (
            <div className="status-container success">
               <CheckCircle size={48} color="green" />
               <h4>Transaction Successful!</h4>
               {txResult && txResult.hash && (
                  <div className="tx-details">
                     <p>Transaction Hash:</p>
                     <div className="hash-container">
                        <span className="tx-hash">{txResult.hash}</span>
                        <a
                           href={`${
                              network.includes("Sepolia")
                                 ? "https://sepolia.scrollscan.com/tx/"
                                 : "https://scrollscan.com/tx/"
                           }${txResult.hash}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="view-link">
                           <ExternalLink size={16} />
                           View
                        </a>
                     </div>
                  </div>
               )}
               <button className="btn btn-primary" onClick={handleClose}>
                  Close
               </button>
            </div>
         )}

         {status === "error" && (
            <div className="status-container error">
               <AlertCircle size={48} color="red" />
               <h4>Transaction Failed</h4>
               <p>
                  {txResult?.error ||
                     "Something went wrong with your transaction."}
               </p>
               <div className="modal-actions">
                  <button
                     className="btn btn-secondary"
                     onClick={() => setStatus(null)}>
                     Try Again
                  </button>
                  <button className="btn btn-primary" onClick={handleClose}>
                     Close
                  </button>
               </div>
            </div>
         )}

         {!status && (
            <form onSubmit={handleSubmit}>
               <div className="form-group">
                  <label htmlFor="asset">Asset</label>
                  <select
                     id="asset"
                     className="form-control"
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
                     className="form-control"
                     placeholder="0x..."
                     value={recipient}
                     onChange={(e) => setRecipient(e.target.value)}
                     required
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <div className="amount-input-wrapper">
                     <input
                        id="amount"
                        className="form-control"
                        placeholder="0.0"
                        type="number"
                        step="0.000001"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                     />
                     <span className="amount-suffix">{selectedAsset}</span>
                     <button
                        type="button"
                        className="max-button"
                        onClick={handleUseMax}>
                        MAX
                     </button>
                  </div>
               </div>
               {gasEstimate && (
                  <div className="gas-estimate">
                     <div className="gas-row">
                        <span>Estimated Gas:</span>
                        <span>{gasEstimate.fee.toFixed(6)} ETH</span>
                     </div>
                     <div className="gas-row">
                        <span>Estimated Time:</span>
                        <span>{gasEstimate.timeEstimate}</span>
                     </div>
                     <div className="gas-row gas-total">
                        <span>Total Amount:</span>
                        <span>
                           {selectedAsset === "ETH"
                              ? (parseFloat(amount) + gasEstimate.fee).toFixed(
                                   6
                                )
                              : amount}{" "}
                           {selectedAsset}
                        </span>
                     </div>
                  </div>
               )}
               <div className="modal-actions">
                  <button
                     type="button"
                     className="btn btn-secondary"
                     onClick={handleClose}>
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className="btn btn-primary"
                     disabled={
                        !recipient || !amount || parseFloat(amount) <= 0
                     }>
                     Send
                  </button>
               </div>
            </form>
         )}
      </Modal>
   );
};
// Receive Modal: Displays wallet address and QR code.
const ReceiveModal = ({ isOpen, onClose, address, network }) => {
   const [copied, setCopied] = useState(false);

   const copyAddressToClipboard = useCallback(() => {
      if (address) {
         navigator.clipboard
            .writeText(address)
            .then(() => {
               setCopied(true);
               setTimeout(() => setCopied(false), 3000);
            })
            .catch((err) => {
               console.error("Could not copy address:", err);
            });
      }
   }, [address]);

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title="Receive on Scroll Network">
         <div className="qr-container">
            {/* In a real app, you would generate a QR code here */}
            <div className="qr-placeholder">
               <div className="qr-grid">
                  <div className="qr-pixel"></div>
                  <div className="qr-pixel"></div>
                  <div className="qr-pixel"></div>
                  <div className="qr-pixel"></div>
                  <div className="qr-pixel"></div>
                  <div className="qr-pixel"></div>
                  <div className="qr-pixel"></div>
                  <div className="qr-pixel"></div>
                  <div className="qr-pixel"></div>
                  <div className="qr-pixel"></div>
               </div>
            </div>
         </div>

         <div className="address-container">
            <h4 className="address-label">Your Scroll Wallet Address</h4>
            <div className="address-value">{address}</div>
            <button className="copy-btn" onClick={copyAddressToClipboard}>
               {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
               {copied ? "Copied!" : "Copy Address"}
            </button>
         </div>

         <div className="network-tag">
            <div className="network-info">
               <Info size={16} />
               <p>
                  Only send Ethereum and ERC-20 tokens on the Scroll{" "}
                  {network.includes("Sepolia") ? "Sepolia Testnet" : "Mainnet"}{" "}
                  to this address. Sending other types of tokens may result in
                  permanent loss.
               </p>
            </div>
         </div>
      </Modal>
   );
};
// Network Switch: Allows switching between mainnet and testnet.
const NetworkSwitch = memo(({ currentNetwork, onSwitch }) => {
   const [isOpen, setIsOpen] = useState(false);

   const networks = [
      { id: "mainnet", name: "Scroll Mainnet" },
      { id: "testnet", name: "Scroll Sepolia" },
   ];

   const handleNetworkSwitch = (networkId) => {
      setIsOpen(false);
      onSwitch(networkId);
   };

   return (
      <div className="network-switch">
         <button className="network-current" onClick={() => setIsOpen(!isOpen)}>
            {currentNetwork}
            <ArrowDown size={12} className={isOpen ? "rotated" : ""} />
         </button>

         {isOpen && (
            <div className="network-dropdown">
               {networks.map((network) => (
                  <button
                     key={network.id}
                     className={`network-option ${
                        currentNetwork === network.name ? "active" : ""
                     }`}
                     onClick={() => handleNetworkSwitch(network.id)}>
                     {network.name}
                     {currentNetwork === network.name && (
                        <CheckCircle size={12} />
                     )}
                  </button>
               ))}
            </div>
         )}
      </div>
   );
});
// Wallet Connection: Handles wallet creation, import, and reconnection.
const WalletConnection = () => {
   const {
      isConnected,
      isWalletExisting,
      createWallet,
      importWallet,
      loadWallet,
   } = useContext(WalletContext);
   const [password, setPassword] = useState("");
   const [recoveryPhrase, setRecoveryPhrase] = useState("");
   const [isCreating, setIsCreating] = useState(false);
   const [isImporting, setIsImporting] = useState(false);
   const [error, setError] = useState("");

   // Handle password input
   const handlePasswordChange = (e) => {
      setPassword(e.target.value);
   };

   // Handle recovery phrase input
   const handleRecoveryPhraseChange = (e) => {
      setRecoveryPhrase(e.target.value);
   };

   // Handle wallet creation
   const handleCreateWallet = async () => {
      if (password.length < 8) {
         setError("Password must be at least 8 characters long");
         return;
      }

      setError("");
      setIsCreating(true);

      try {
         const success = await createWallet(password);
         if (!success) {
            setError("Failed to create wallet");
         }
      } catch (err) {
         setError(err.message);
      } finally {
         setIsCreating(false);
      }
   };

   // Handle wallet import
   const handleImportWallet = async () => {
      if (password.length < 8) {
         setError("Password must be at least 8 characters long");
         return;
      }

      if (!recoveryPhrase.trim()) {
         setError("Recovery phrase is required");
         return;
      }

      setError("");
      setIsImporting(true);

      try {
         const success = await importWallet(recoveryPhrase, password);
         if (!success) {
            setError("Failed to import wallet");
         }
      } catch (err) {
         setError(err.message);
      } finally {
         setIsImporting(false);
      }
   };

   // Handle wallet reconnection
   const handleReconnectWallet = async () => {
      if (password.length < 8) {
         setError("Password must be at least 8 characters long");
         return;
      }

      setError("");
      setIsCreating(true);

      try {
         const success = await loadWallet(password);
         if (!success) {
            setError("Incorrect password or wallet is corrupted");
         }
      } catch (err) {
         setError(err.message);
      } finally {
         setIsCreating(false);
      }
   };

   // Return early if already connected
   if (isConnected) {
      return <div>Wallet is connected!</div>;
   }

   return (
      <div className="wallet-connection">
         <h2>Connect to Your Wallet</h2>

         {error && <div className="error-message">{error}</div>}

         <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
               type="password"
               id="password"
               value={password}
               onChange={handlePasswordChange}
               placeholder="Enter your password"
            />
         </div>

         {isWalletExisting ? (
            // Wallet exists, show reconnect option
            <div className="reconnect-section">
               <p>
                  A wallet was found on this device. Enter your password to
                  reconnect.
               </p>
               <button onClick={handleReconnectWallet} disabled={isCreating}>
                  {isCreating ? "Connecting..." : "Reconnect Wallet"}
               </button>
               <div className="separator">or</div>
               <button
                  onClick={() => localStorage.removeItem("scrollWallet")}
                  className="secondary-button">
                  Use a Different Wallet
               </button>
            </div>
         ) : (
            // No wallet found, show create or import options
            <div className="wallet-options">
               <div className="option-section">
                  <h3>Create New Wallet</h3>
                  <button
                     onClick={handleCreateWallet}
                     disabled={isWalletConnectionCreating || isImporting}>
                     {isCreating ? "Creating..." : "Create Wallet"}
                  </button>
               </div>

               <div className="separator">or</div>

               <div className="option-section">
                  <h3>Import Existing Wallet</h3>
                  <div className="form-group">
                     <label htmlFor="recoveryPhrase">Recovery Phrase</label>
                     <textarea
                        id="recoveryPhrase"
                        value={recoveryPhrase}
                        onChange={handleRecoveryPhraseChange}
                        placeholder="Enter your 12-word recovery phrase"
                        rows={4}
                     />
                  </div>
                  <button
                     onClick={handleImportWallet}
                     disabled={isCreating || isImporting}>
                     {isImporting ? "Importing..." : "Import Wallet"}
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

// Default empty assets list - extracted to avoid duplication
const DEFAULT_ASSETS = [
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
];

// Service to fetch cryptocurrency prices
// Price service for fetching real-time cryptocurrency prices
const PriceService = {
   async getEthPrice() {
      try {
         const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
         );
         const data = await response.json();
         return data.ethereum.usd;
      } catch (error) {
         console.error("Error fetching ETH price:", error);
         // Return a fallback price if API call fails
         return 1893.3; // Fallback price
      }
   },

   // Could be expanded to fetch prices for other tokens
   async getTokenPrice(tokenId) {
      try {
         const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
         );
         const data = await response.json();
         return data[tokenId]?.usd || 0;
      } catch (error) {
         console.error(`Error fetching ${tokenId} price:`, error);
         return 0;
      }
   },
};

const WalletPage = () => {
   const {
      address,
      assets: contextAssets,
      balance,
      transactions,
      updateBalance,
      isConnected,
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
   const navigate = useNavigate();
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
   const [ethPrice, setEthPrice] = useState(null);
   const [toast, setToast] = useState(null);
   const [sessionWarning, setSessionWarning] = useState(false);

   // Show toast notification
   const showToast = (message, type = "success") => {
      setToast({ message, type });
   };

   // Close toast notification
   const closeToast = () => {
      setToast(null);
   };

   // Handle session expiration
   useEffect(() => {
      if (!sessionExpiresAt) return;

      const updateTimer = () => {
         const now = new Date().getTime();
         const remaining = sessionExpiresAt - now;

         if (remaining <= 0) {
            setTimeRemaining("Expired");
            disconnectWallet(); // Logout when session expires
            showToast(
               "Your session has expired. Please log in again.",
               "error"
            );
            return;
         }

         // Show warning 2 minutes before expiry
         if (remaining < 120000 && !sessionWarning) {
            setSessionWarning(true);
         }

         const minutes = Math.floor(remaining / 60000);
         const seconds = Math.floor((remaining % 60000) / 1000);
         setTimeRemaining(`${minutes}m ${seconds}s`);
      };

      updateTimer();
      const timerId = setInterval(updateTimer, 1000);

      return () => clearInterval(timerId);
   }, [sessionExpiresAt, sessionWarning, disconnectWallet]);

   // Function to handle session extension
   const handleExtendSession = useCallback(() => {
      extendSession();
      setSessionWarning(false);
      showToast("Session extended successfully");
   }, [extendSession]);

   // Function to handle logout
   const handleLogout = useCallback(() => {
      disconnectWallet();
   }, [disconnectWallet]);

   // Function to format the address for display
   const formatAddress = useCallback((addr) => {
      if (!addr) return "";
      return `${addr.substring(0, 8)}....${addr.substring(addr.length - 8)}`;
   }, []);

   // Fetch ETH price and calculate balance
   const fetchEthPrice = useCallback(async () => {
      const price = await PriceService.getEthPrice();
      setEthPrice(price);
      return price;
   }, []);

   // Calculate balance with live ETH price
   const calculateBalance = useCallback(
      (balanceValue, price) => {
         if (!balanceValue || isNaN(parseFloat(balanceValue))) return 0;
         const ethPriceToUse = price || ethPrice || 2593.3; // Use provided price, stored price, or fallback
         return parseFloat(balanceValue) * ethPriceToUse;
      },
      [ethPrice]
   );

   // Copy address to clipboard with UI feedback
   const copyAddressToClipboard = useCallback(() => {
      if (address) {
         navigator.clipboard
            .writeText(address)
            .then(() => {
               showToast("Address copied to clipboard");
            })
            .catch((err) => {
               console.error("Could not copy address:", err);
               showToast("Failed to copy address", "error");
            });
      }
   }, [address]);

   // Toggle balance visibility
   const toggleBalanceVisibility = useCallback(() => {
      setHideBalance((prev) => !prev);
   }, []);

   // Handle refresh with  feedback
   const handleRefresh = useCallback(async () => {
      if (refreshing || !address) return;

      setRefreshing(true);
      try {
         // Refresh ETH price and balance simultaneously
         const [_, updatedBalance] = await Promise.all([
            fetchEthPrice(),
            updateBalance(address),
         ]);

         showToast("Balance updated successfully");
      } catch (error) {
         console.error("Error refreshing balance:", error);
         showToast("Failed to update balance", "error");
      } finally {
         setTimeout(() => setRefreshing(false), 1000); // Minimum 1 second refresh animation
      }
   }, [address, updateBalance, refreshing, fetchEthPrice]);

   // Handle network switch with error handling
   const handleNetworkSwitch = useCallback(
      async (networkType) => {
         try {
            setIsLoading(true);
            await switchNetwork(networkType);
            showToast(
               `Switched to ${
                  networkType === "mainnet"
                     ? "Scroll Mainnet"
                     : "Scroll Sepolia"
               }`
            );
         } catch (error) {
            console.error("Error switching networks:", error);
            showToast(`Failed to switch network: ${error.message}`, "error");
         } finally {
            setIsLoading(false);
         }
      },
      [switchNetwork]
   );

   // Handle send transaction with error handling
   const handleSendTransaction = useCallback(
      async (recipient, amount, asset, assetDetails) => {
         try {
            if (asset === "ETH") {
               const result = await sendTransaction(recipient, amount);
               return {
                  success: true,
                  txHash: result.transactionHash || result.hash || "",
               };
            } else {
               // Find token details
               const token = SCROLL_TOKENS[asset];
               if (!token) throw new Error("Token not supported");

               const result = await sendToken(
                  token.address,
                  recipient,
                  amount,
                  token.decimals
               );
               return {
                  success: true,
                  txHash: result.transactionHash || result.hash || "",
               };
            }
         } catch (error) {
            console.error("Error in transaction:", error);
            return {
               success: false,
               error: error.message || "Transaction failed. Please try again.",
            };
         }
      },
      [sendTransaction, sendToken, SCROLL_TOKENS]
   );

   // Fetch and update wallet data
   useEffect(() => {
      const fetchData = async () => {
         setIsLoading(true);
         try {
            // Fetch ETH price if not already set
            const currentEthPrice = ethPrice || (await fetchEthPrice());

            if (balance) {
               const balanceUSD = calculateBalance(balance, currentEthPrice);

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
                  // Use DEFAULT_ASSETS constant instead of duplicating the code
                  setAssets(DEFAULT_ASSETS);
               }
            }
         } catch (error) {
            console.error("Error loading wallet data:", error);
            showToast("Failed to load wallet data", "error");
         } finally {
            setIsLoading(false);
         }
      };

      fetchData();

      // Set up interval to refresh balance and prices periodically
      const intervalId = setInterval(() => {
         if (address) {
            // Silently refresh data without showing loading state
            Promise.all([fetchEthPrice(), updateBalance(address)]).catch(
               (error) => console.error("Error in auto-refresh:", error)
            );
         }
      }, 20000); // Update every 20 seconds

      return () => clearInterval(intervalId);
   }, [
      balance,
      address,
      updateBalance,
      previousBalance,
      contextAssets,
      calculateBalance,
      fetchEthPrice,
      ethPrice,
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

         {/* Toast Notification */}
         {toast && (
            <Toast
               message={toast.message}
               type={toast.type}
               onClose={closeToast}
            />
         )}

         {/* Session Expiry Warning */}
         <SessionExpiryModal
            isOpen={sessionWarning}
            onExtend={handleExtendSession}
            onLogout={handleLogout}
         />

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

         {/* Network status bar with session info */}
         <div className="network-status-bar">
            <NetworkStatus status={networkStatus} network={network} />
            <div className="session-info">
               <Clock size={14} />
               <span>{timeRemaining}</span>
            </div>
            <NetworkSwitch
               currentNetwork={networkName}
               onSwitch={handleNetworkSwitch}
            />
         </div>

         <div className="wallet-header">
            <div className="wallet-logo">
               <img
                  src="src/assets/logo.png"
                  alt=""
                  srcset=""
                  className="range-logo"
               />
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
                  onClick={copyAddressToClipboard}
                  aria-label="Copy wallet address">
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
                  disabled={refreshing}
                  aria-label="Refresh balance">
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
                  onClick={toggleBalanceVisibility}
                  aria-label={hideBalance ? "Show balance" : "Hide balance"}>
                  {hideBalance ? <Eye size={18} /> : <EyeOff size={18} />}
               </button>
            </div>
            {/* // Eths balance Change not displaying */}
            <div className="balance-change">
               <span className="change-amount">{changeAmount}</span>
               <span className="change-percent">{changePercent}</span>
            </div>
            {ethPrice && (
               <div className="eth-price-info" style={{ display: "none" }}>
                  <span>ETH: ${ethPrice.toFixed(2)}</span>
                  <span className="price-updated">
                     Last updated: {new Date().toLocaleTimeString()}
                  </span>
               </div>
            )}
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
               RECEIVE
            </button>

            <button
               className="action-button buy"
               aria-label="Buy cryptocurrency">
               <DollarSign size={20} />
               BUY
            </button>

            <Link to="/swap" className="action-button exchange">
               <button aria-label="Exchange cryptocurrency">
                  <RefreshCw size={20} />
                  EXCHANGE
               </button>
            </Link>

            <button
               className="action-button exchange"
               onClick={() => navigate("/swap")}
               aria-label="Exchange cryptocurrency">
               <RefreshCw size={20} /> EXCHANGE
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
                           onSelect={() => setIsSendModalOpen(true)}
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
                  <button
                     className="view-all-button"
                     onClick={() => {
                        /* Navigate to full transaction history */
                     }}>
                     View All
                  </button>
               </div>
               <div className="section-content">
                  {walletTransactions.length > 0 ? (
                     walletTransactions.map((tx, index) => (
                        <TransactionItem
                           key={`tx-${tx.txHash || index}`}
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
            </div>
         </div>
      </div>
   );
};

export default WalletPage;
