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
   Clock
} from "lucide-react";
import "./WalletPage.css";

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
   const explorerBaseUrl = network === "Scroll Mainnet" 
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
                  rel="noopener noreferrer"
                  className="tx-explorer-link"
                  aria-label="View on Scroll Explorer"
               >
                  <ExternalLink size={14} />
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

// Network status indicator
const NetworkStatus = memo(({ status, network }) => {
   const { connected, latency } = status;
   const networkName = network.name || "Scroll Network";
   
   return (
      <div className="network-status">
         {connected ? (
            <div className="status-connected">
               <Wifi size={14} className="status-icon" />
               <span className="status-text">
                  {networkName} ({latency}ms)
               </span>
            </div>
         ) : (
            <div className="status-disconnected">
               <WifiOff size={14} className="status-icon" />
               <span className="status-text">
                  Connecting to {networkName}...
               </span>
            </div>
         )}
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
         <p>Loading Scroll wallet data...</p>
      </div>
   </div>
));

// Modal Components
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

const SendModal = ({ isOpen, onClose, assets, onSend, network }) => {
   const [recipient, setRecipient] = useState("");
   const [amount, setAmount] = useState("");
   const [selectedAsset, setSelectedAsset] = useState(
      assets[0]?.symbol || "ETH"
   );
   const [status, setStatus] = useState(null); // null, 'pending', 'success', 'error'
   const [txResult, setTxResult] = useState(null);
   const [gasEstimate, setGasEstimate] = useState(null);

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
      return assets.find(asset => asset.symbol === selectedAsset);
   };

   // Estimate gas (simplified for demo)
   const estimateGas = async () => {
      if (!recipient || !amount) return;
      
      // In a real app, this would call the blockchain
      // Here we'll just set a mock value based on network congestion
      const baseFee = selectedAsset === "ETH" ? 0.0002 : 0.0005;
      const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGasEstimate({
         fee: baseFee * randomFactor,
         timeEstimate: "~30 seconds"
      });
   };

   useEffect(() => {
      if (recipient && amount && parseFloat(amount) > 0) {
         estimateGas();
      } else {
         setGasEstimate(null);
      }
   }, [recipient, amount, selectedAsset]);

   const handleSend = async (e) => {
      e.preventDefault();

      if (!recipient || !amount) return;

      try {
         setStatus("pending");

         const selectedAssetDetails = getSelectedAssetDetails();
         const result = await onSend(recipient, amount, selectedAsset, selectedAssetDetails);

         if (result.success) {
            setStatus("success");
            setTxResult(result);
            
            // After success timeout, close the modal
            setTimeout(() => {
               handleClose();
            }, 3000);
         } else {
            setStatus("error");
            setTxResult(result);
         }
      } catch (error) {
         console.error("Transaction failed:", error);
         setStatus("error");
         setTxResult({ 
            success: false, 
            error: error.message || "Transaction failed" 
         });
      }
   };
   
   const getMaxAmount = () => {
      const asset = getSelectedAssetDetails();
      if (!asset) return "0";
      
      // For non-ETH assets, return full amount
      if (asset.symbol !== "ETH") {
         return asset.amount;
      }
      
      // For ETH, reserve some for gas
      const amount = parseFloat(asset.amount);
      const gasReserve = 0.001; // Reserve 0.001 ETH for gas
      return Math.max(0, amount - gasReserve).toString();
   };
   
   const handleUseMax = () => {
      setAmount(getMaxAmount());
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={status ? null : handleClose}
         title="Send Assets">
         {status === "pending" && (
            <div className="transaction-status pending">
               <div className="loading-spinner"></div>
               <p>Processing transaction on Scroll network...</p>
               <p className="tx-subtitle">This may take a few moments</p>
            </div>
         )}

         {status === "success" && txResult && (
            <div className="transaction-status success">
               <CheckCircle size={48} />
               <p>Transaction sent successfully!</p>
               {txResult.txHash && (
                  <a 
                     href={txResult.blockExplorerUrl} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="tx-explorer-button"
                  >
                     <ExternalLink size={16} />
                     <span>View on Scroll Explorer</span>
                  </a>
               )}
            </div>
         )}

         {status === "error" && (
            <div className="transaction-status error">
               <AlertCircle size={48} />
               <p>Transaction failed</p>
               <p className="error-message">{txResult?.error || "Please try again"}</p>
               <button
                  className="primary-button"
                  className="btn btn-secondary"
                  onClick={() => setStatus(null)}>
                  Try Again
                </button>
            </div>
         )}

         {!status && (
            <form onSubmit={handleSend}>
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
                              ? (parseFloat(amount) + gasEstimate.fee).toFixed(6)
                              : amount} {selectedAsset}
                        </span>
                     </div>
                  </div>
               )}

               <div className="modal-actions">
                  <button
                     type="button"
                     className="btn btn-secondary"
                     onClick={onClose}>
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className="btn btn-primary"
                     disabled={!recipient || !amount || parseFloat(amount) <= 0}>
                     Send
                  </button>
               </div>
            </form>
         )}
      </Modal>
   );
};

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
         title="Receive on Scroll Network"
      >
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
            <h4 className="address-label">
               Your Scroll Wallet Address
            </h4>
            <div className="address-value">
               {address}
            </div>
            <button 
               className="copy-btn" 
               onClick={copyAddressToClipboard}>
               {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
               {copied ? "Copied!" : "Copy Address"}
            </button>
         </div>

         <div className="network-tag">
            <div className="network-info">
               <Info size={16} />
               <p>
                  Only send Ethereum and ERC-20 tokens on the Scroll {network.includes("Sepolia") ? "Sepolia Testnet" : "Mainnet"} to this address. Sending other types of tokens may result in permanent loss.
               </p>
            </div>
         </div>
      </Modal>
   );
};

// Network switch component
const NetworkSwitch = memo(({ currentNetwork, onSwitch }) => {
   const [isOpen, setIsOpen] = useState(false);
   
   const handleSelect = (networkType) => {
      setIsOpen(false);
      onSwitch(networkType);
   };
   
   return (
      <div className="network-switch">
         <button 
            className={`network-switch-button ${currentNetwork.includes("Sepolia") ? "testnet" : "mainnet"}`}
            onClick={() => setIsOpen(!isOpen)}
         >
            <div className="network-switch-indicator"></div>
            <span>{currentNetwork}</span>
            <ArrowDown size={16} />
         </button>
         
         {isOpen && (
            <div className="network-dropdown">
               <div 
                  className="network-option mainnet"
                  onClick={() => handleSelect('mainnet')}
               >
                  <div className="network-option-indicator"></div>
                  <span>Scroll Mainnet</span>
               </div>
               <div 
                  className="network-option testnet"
                  onClick={() => handleSelect('testnet')}
               >
                  <div className="network-option-indicator"></div>
                  <span>Scroll Sepolia</span>
               </div>
            </div>
         )}
      </div>
   );
});

const WalletPage = () => {
   const {
      address,
      balance,
      transactions,
      updateBalance,
      assets: contextAssets,
      network,
      networkStatus,
      switchNetwork,
      sendTransaction,
      sendToken,
      SCROLL_TOKENS
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
   const handleNetworkSwitch = useCallback(async (networkType) => {
      try {
         setIsLoading(true);
         await switchNetwork(networkType);
      } catch (error) {
         console.error("Error switching networks:", error);
      } finally {
         setIsLoading(false);
      }
   }, [switchNetwork]);

   // Handle send transaction
   const handleSendTransaction = useCallback(async (recipient, amount, asset, assetDetails) => {
      try {
         if (asset === "ETH") {
            return await sendTransaction(recipient, amount);
         } else {
            // Find token details
            const token = SCROLL_TOKENS[asset];
            if (!token) throw new Error("Token not supported");
            
            return await sendToken(token.address, recipient, amount, token.decimals);
         }
      } catch (error) {
         console.error("Error in transaction:", error);
         return { success: false, error: error.message };
      }
   }, [sendTransaction, sendToken, SCROLL_TOKENS]);

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
                     }
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
               <svg className="scroll-logo" viewBox="0 0 24 24" width="24" height="24">
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

               <button className="copy-address" onClick={copyAddressToClipboard}>
                  <Copy size={16} />
               </button>
            </div>
         </div>

         <div className="wallet-balance">
            <div className="balance-label">
               <span>Total Balance</span>
               <button className="refresh-button" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw size={18} className={refreshing ? "refreshing" : ""} />
               </button>
            </div>

            <div className="balance-amount">
               <span>{displayBalance}</span>
               <button className="toggle-visibility" onClick={toggleBalanceVisibility}>
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
               Send
            </button>

            <button
               className="action-button receive"
               onClick={() => setIsReceiveModalOpen(true)}
               aria-label="Receive cryptocurrency">
               <ArrowDown size={20} />
               Receive
            </button>
            
            <button 
               className="action-button buy"
               aria-label="Buy cryptocurrency">
               <DollarSign size={20} />
               Buy
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
                        <AssetItem key={`${asset.symbol}-${index}`} asset={asset} />
                     ))
                  ) : (
                     <div className="empty-state">
                        <p>
                           No assets yet. Deposit funds to get started.
                        </p>
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
                        <TransactionItem key={`tx-${index}`} transaction={tx} network={networkName} />
                     ))
                  ) : (
                     <div className="empty-state">
                        <p>
                           No transactions yet.
                        </p>
                     </div>
                  )}
               </div><button
                  className="btn btn-secondary"
                  onClick={() => setStatus(null)}>
                  Try Again
                </button>
            </div>
         div)}

         {!status && (
            <form onSubmit={handleSend}>
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
                              ? (parseFloat(amount) + gasEstimate.fee).toFixed(6)
                              : amount} {selectedAsset}
                        </span>
                     </div>
                  </div>
               )}

               <div className="modal-actions">
                  <button
                     type="button"
                     className="btn btn-secondary"
                     onClick={onClose}>
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className="btn btn-primary"
                     disabled={!recipient || !amount || parseFloat(amount) <= 0}>
                     Send
                  </button>
               </div>
            </form>
         )}
      </Modal>
   );
};

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
         title="Receive on Scroll Network"
      >
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
            <h4 className="address-label">
               Your Scroll Wallet Address
            </h4>
            <div className="address-value">
               {address}
            </div>
            <button 
               className="copy-btn" 
               onClick={copyAddressToClipboard}>
               {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
               {copied ? "Copied!" : "Copy Address"}
            </button>
         </div>

         <div className="network-tag">
            <div className="network-info">
               <Info size={16} />
               <p>
                  Only send Ethereum and ERC-20 tokens on the Scroll {network.includes("Sepolia") ? "Sepolia Testnet" : "Mainnet"} to this address. Sending other types of tokens may result in permanent loss.
               </p>
            </div>
         </div>
      </Modal>
   );
};

// Network switch component
const NetworkSwitch = memo(({ currentNetwork, onSwitch }) => {
   const [isOpen, setIsOpen] = useState(false);
   
   const handleSelect = (networkType) => {
      setIsOpen(false);
      onSwitch(networkType);
   };
   
   return (
      <div className="network-switch">
         <button 
            className={`network-switch-button ${currentNetwork.includes("Sepolia") ? "testnet" : "mainnet"}`}
            onClick={() => setIsOpen(!isOpen)}
         >
            <div className="network-switch-indicator"></div>
            <span>{currentNetwork}</span>
            <ArrowDown size={16} />
         </button>
         
         {isOpen && (
            <div className="network-dropdown">
               <div 
                  className="network-option mainnet"
                  onClick={() => handleSelect('mainnet')}
               >
                  <div className="network-option-indicator"></div>
                  <span>Scroll Mainnet</span>
               </div>
               <div 
                  className="network-option testnet"
                  onClick={() => handleSelect('testnet')}
               >
                  <div className="network-option-indicator"></div>
                  <span>Scroll Sepolia</span>
               </div>
            </div>
         )}
      </div>
   );
});

const WalletPage = () => {
   const {
      address,
      balance,
      transactions,
      updateBalance,
      assets: contextAssets,
      network,
      networkStatus,
      switchNetwork,
      sendTransaction,
      sendToken,
      SCROLL_TOKENS
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
   const handleNetworkSwitch = useCallback(async (networkType) => {
      try {
         setIsLoading(true);
         await switchNetwork(networkType);
      } catch (error) {
         console.error("Error switching networks:", error);
      } finally {
         setIsLoading(false);
      }
   }, [switchNetwork]);

   // Handle send transaction
   const handleSendTransaction = useCallback(async (recipient, amount, asset, assetDetails) => {
      try {
         if (asset === "ETH") {
            return await sendTransaction(recipient, amount);
         } else {
            // Find token details
            const token = SCROLL_TOKENS[asset];
            if (!token) throw new Error("Token not supported");
            
            return await sendToken(token.address, recipient, amount, token.decimals);
         }
      } catch (error) {
         console.error("Error in transaction:", error);
         return { success: false, error: error.message };
      }
   }, [sendTransaction, sendToken, SCROLL_TOKENS]);

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
                     }
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
               <svg className="scroll-logo" viewBox="0 0 24 24" width="24" height="24">
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

               <button className="copy-address" onClick={copyAddressToClipboard}>
                  <Copy size={16} />
               </button>
            </div>
         </div>

         <div className="wallet-balance">
            <div className="balance-label">
               <span>Total Balance</span>
               <button className="refresh-button" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw size={18} className={refreshing ? "refreshing" : ""} />
               </button>
            </div>

            <div className="balance-amount">
               <span>{displayBalance}</span>
               <button className="toggle-visibility" onClick={toggleBalanceVisibility}>
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
               Send
            </button>

            <button
               className="action-button receive"
               onClick={() => setIsReceiveModalOpen(true)}
               aria-label="Receive cryptocurrency">
               <ArrowDown size={20} />
               Receive
            </button>
            
            <button 
               className="action-button buy"
               aria-label="Buy cryptocurrency">
               <DollarSign size={20} />
               Buy
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
                        <AssetItem key={`${asset.symbol}-${index}`} asset={asset} />
                     ))
                  ) : (
                     <div className="empty-state">
                        <p>
                           No assets yet. Deposit funds to get started.
                        </p>
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
                        <TransactionItem key={`tx-${index}`} transaction={tx} network={networkName} />
                     ))
                  ) : (
                     <div className="empty-state">
                        <p>
                           No transactions yet.
                        </p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default WalletPage;
