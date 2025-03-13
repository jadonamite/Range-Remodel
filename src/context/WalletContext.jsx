import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import {
   createClient,
   convertViemChainToRelayChain,
   TESTNET_RELAY_API,
} from "@reservoir0x/relay-sdk";
import { defineChain } from "viem";

export const WalletContext = createContext();

// Scroll network configuration
const SCROLL_NETWORKS = {
   mainnet: {
      name: "Scroll Mainnet",
      rpcUrl: "https://rpc.scroll.io",
      chainId: 534352,
      blockExplorer: "https://scrollscan.com",
      nativeCurrency: {
         name: "ETH",
         symbol: "ETH",
         decimals: 18,
      },
   },
   testnet: {
      name: "Scroll Sepolia",
      rpcUrl: "https://sepolia-rpc.scroll.io",
      chainId: 534351,
      blockExplorer: "https://sepolia.scrollscan.com",
      nativeCurrency: {
         name: "ETH",
         symbol: "ETH",
         decimals: 18,
      },
   },
};
const scrollSepolia = defineChain({
   id: 534351, // Scroll Sepolia chain ID
   name: "Scroll Sepolia",
   network: "scroll-sepolia",
   nativeCurrency: {
      decimals: 18,
      name: "ETH",
      symbol: "ETH",
   },
   rpcUrls: {
      default: {
         http: ["https://sepolia-rpc.scroll.io"],
      },
   },
   blockExplorers: {
      default: {
         name: "Scrollscan",
         url: "https://sepolia.scrollscan.com",
      },
   },
});
// Common token addresses on Scroll Sepolia
const SCROLL_TOKENS = {
   USDC: {
      address: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7", // Example USDC address on Scroll Sepolia
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
      icon: "usdc",
   },
   USDT: {
      address: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df", // Example USDT address on Scroll Sepolia
      decimals: 6,
      symbol: "USDT",
      name: "Tether USD",
      icon: "usdt",
   },
   // Example Scroll ecosystem token
   SCROLL: {
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // This is a placeholder address
      decimals: 18,
      symbol: "SCR",
      name: "Scroll Token",
      icon: "scroll",
   },
};

export const WalletProvider = ({ children }) => {
   const [wallet, setWallet] = useState(null);
   const [address, setAddress] = useState("");
   const [balance, setBalance] = useState("0");
   const [transactions, setTransactions] = useState([]);
   const [assets, setAssets] = useState([]);
   const [network, setNetwork] = useState(SCROLL_NETWORKS.testnet);
   const [isConnected, setIsConnected] = useState(false);
   const [networkStatus, setNetworkStatus] = useState({
      connected: false,
      latency: 0,
   });

   // Get Scroll network provider
   const getProvider = () => {
      return new ethers.providers.JsonRpcProvider(network.rpcUrl);
   };

   // Check network connection and latency
   const checkNetworkStatus = async () => {
      try {
         const provider = getProvider();
         const startTime = Date.now();
         await provider.getBlockNumber();
         const endTime = Date.now();

         setNetworkStatus({
            connected: true,
            latency: endTime - startTime,
         });
         return true;
      } catch (error) {
         console.error("Network connection error:", error);
         setNetworkStatus({
            connected: false,
            latency: 0,
         });
         return false;
      }
   };

   // Function to create a new wallet
   const createWallet = async (password) => {
      try {
         // Check network connection before proceeding
         const isNetworkAvailable = await checkNetworkStatus();
         if (!isNetworkAvailable) {
            throw new Error("Cannot connect to Scroll network");
         }

         const newWallet = ethers.Wallet.createRandom();
         const encryptedWallet = await newWallet.encrypt(password);

         // Save with network info
         const walletData = {
            encryptedWallet,
            network: network.name,
            timestamp: Date.now(),
         };

         localStorage.setItem("scrollWallet", JSON.stringify(walletData));
         setWallet(newWallet);
         setAddress(newWallet.address);
         setIsConnected(true);

         await updateBalance(newWallet.address);
         await fetchTokenBalances(newWallet.address);
         return true;
      } catch (error) {
         console.error("Error creating wallet:", error);
         return false;
      }
   };

   // Function to import an existing wallet
   const importWallet = async (recoveryPhrase, password) => {
      try {
         // Check network connection before proceeding
         const isNetworkAvailable = await checkNetworkStatus();
         if (!isNetworkAvailable) {
            throw new Error("Cannot connect to Scroll network");
         }

         const newWallet = ethers.Wallet.fromMnemonic(recoveryPhrase);
         const encryptedWallet = await newWallet.encrypt(password);

         // Save with network info
         const walletData = {
            encryptedWallet,
            network: network.name,
            timestamp: Date.now(),
         };

         localStorage.setItem("scrollWallet", JSON.stringify(walletData));
         setWallet(newWallet);
         setAddress(newWallet.address);
         setIsConnected(true);

         await updateBalance(newWallet.address);
         await fetchTokenBalances(newWallet.address);
         return true;
      } catch (error) {
         console.error("Error importing wallet:", error);
         return false;
      }
   };

   // Function to load the wallet from local storage
   const loadWallet = async (password) => {
      try {
         // Check network connection before proceeding
         const isNetworkAvailable = await checkNetworkStatus();
         if (!isNetworkAvailable) {
            throw new Error("Cannot connect to Scroll network");
         }

         const walletDataString = localStorage.getItem("scrollWallet");
         if (!walletDataString) return false;

         const walletData = JSON.parse(walletDataString);
         const decryptedWallet = await ethers.Wallet.fromEncryptedJson(
            walletData.encryptedWallet,
            password
         );

         setWallet(decryptedWallet);
         setAddress(decryptedWallet.address);
         setIsConnected(true);

         await updateBalance(decryptedWallet.address);
         await fetchTokenBalances(decryptedWallet.address);
         return true;
      } catch (error) {
         console.error("Error loading wallet:", error);
         return false;
      }
   };

   // Function to update the wallet balance
   const updateBalance = async (walletAddress) => {
      try {
         const provider = getProvider();
         const balanceWei = await provider.getBalance(walletAddress);
         const balanceEth = ethers.utils.formatEther(balanceWei);
         setBalance(balanceEth);
         return balanceEth;
      } catch (error) {
         console.error("Error updating balance:", error);
         return "0";
      }
   };

   // Function to fetch ERC20 token balances
   const fetchTokenBalances = async (walletAddress) => {
      try {
         const provider = getProvider();
         const tokenList = [];

         // ERC20 ABI for balanceOf
         const erc20Abi = [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",
         ];

         // Fetch ETH balance first
         const ethBalanceWei = await provider.getBalance(walletAddress);
         const ethBalanceFormatted = ethers.utils.formatEther(ethBalanceWei);
         const ethPrice = 2593.3; // In a real app, fetch this from an API
         const ethValueUSD = parseFloat(ethBalanceFormatted) * ethPrice;

         // Add ETH to the list
         tokenList.push({
            name: "Ethereum",
            symbol: "ETH",
            amount: ethBalanceFormatted,
            displayAmount: `${parseFloat(ethBalanceFormatted).toFixed(4)} ETH`,
            value: `$${ethValueUSD.toFixed(2)}`,
            change: "+$24.30", // Would be calculated from price history in real app
            changePercent: "+1.2%",
            icon: "ethereum",
         });

         // Fetch token balances
         for (const [name, token] of Object.entries(SCROLL_TOKENS)) {
            try {
               const contract = new ethers.Contract(
                  token.address,
                  erc20Abi,
                  provider
               );
               const balance = await contract.balanceOf(walletAddress);
               const decimals = token.decimals;
               const formatted = ethers.utils.formatUnits(balance, decimals);

               // Mock price and change values for demo
               // In a real app, you would fetch these from an API
               const mockPrice = name === "USDC" || name === "USDT" ? 1.0 : 0.8;
               const valueUSD = parseFloat(formatted) * mockPrice;

               if (parseFloat(formatted) > 0) {
                  tokenList.push({
                     name: token.name,
                     symbol: token.symbol,
                     amount: formatted,
                     displayAmount: `${parseFloat(formatted).toFixed(2)} ${
                        token.symbol
                     }`,
                     value: `$${valueUSD.toFixed(2)}`,
                     change: "+$0.50", // Would be calculated from price history in real app
                     changePercent: "+0.8%",
                     icon: token.icon,
                  });
               }
            } catch (error) {
               console.error(`Error fetching ${name} balance:`, error);
            }
         }

         // Add zero balance tokens for display
         if (tokenList.length === 1) {
            // Only ETH was added
            tokenList.push({
               name: "USD Coin",
               symbol: "USDC",
               amount: "0",
               displayAmount: "0.00 USDC",
               value: "$0.00",
               change: "$0.00",
               changePercent: "0.00%",
               icon: "usdc",
            });

            tokenList.push({
               name: "Tether USD",
               symbol: "USDT",
               amount: "0",
               displayAmount: "0.00 USDT",
               value: "$0.00",
               change: "$0.00",
               changePercent: "0.00%",
               icon: "usdt",
            });

            tokenList.push({
               name: "Scroll Token",
               symbol: "SCR",
               amount: "0",
               displayAmount: "0.00 SCR",
               value: "$0.00",
               change: "$0.00",
               changePercent: "0.00%",
               icon: "scroll",
            });
         }

         setAssets(tokenList);
      } catch (error) {
         console.error("Error fetching token balances:", error);
         // Set default assets on error
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
         ]);
      }
   };

   // Function to get transaction history from Scroll explorer API
   const getTransactions = async (walletAddress) => {
      try {
         // In a real app, you would query the Scroll block explorer API
         // For this example, we'll create mock transactions if there's a balance
         const provider = getProvider();
         const balanceWei = await provider.getBalance(walletAddress);

         if (balanceWei.gt(0)) {
            // Mock transactions with Scroll-specific details
            setTransactions([
               {
                  type: "Receive",
                  address: `0x${Math.random()
                     .toString(16)
                     .slice(2, 10)}...${Math.random()
                     .toString(16)
                     .slice(2, 8)}`,
                  amount: `${ethers.utils.formatEther(balanceWei.div(2))} ETH`,
                  icon: "ethereum",
                  timestamp: Date.now() - 86400000, // 1 day ago
                  txHash: `0x${Math.random().toString(16).slice(2, 42)}`,
                  network: "Scroll Sepolia",
               },
               {
                  type: "Contract Interaction",
                  address: `0x${Math.random()
                     .toString(16)
                     .slice(2, 10)}...${Math.random()
                     .toString(16)
                     .slice(2, 8)}`,
                  amount: `0.001 ETH`,
                  icon: "ethereum",
                  timestamp: Date.now() - 172800000, // 2 days ago
                  txHash: `0x${Math.random().toString(16).slice(2, 42)}`,
                  network: "Scroll Sepolia",
               },
            ]);
         } else {
            // No transactions yet
            setTransactions([]);
         }
      } catch (error) {
         console.error("Error getting transactions:", error);
         setTransactions([]);
      }
   };

   // Function to send ETH transaction
   const sendTransaction = async (toAddress, amount) => {
      try {
         if (!wallet) throw new Error("No wallet loaded");

         const provider = getProvider();
         const walletWithProvider = wallet.connect(provider);

         // Convert amount to wei
         const amountWei = ethers.utils.parseEther(amount);

         // Check if we have enough balance
         const currentBalance = await provider.getBalance(address);
         if (currentBalance.lt(amountWei)) {
            throw new Error("Insufficient balance");
         }

         // Get the current gas price from Scroll network
         const gasPrice = await provider.getGasPrice();

         // Estimate gas limit for the transaction
         const gasLimit = await provider.estimateGas({
            to: toAddress,
            value: amountWei,
         });

         // Create transaction with proper gas settings for Scroll
         const tx = await walletWithProvider.sendTransaction({
            to: toAddress,
            value: amountWei,
            gasPrice: gasPrice,
            gasLimit: gasLimit.mul(12).div(10), // Add 20% buffer for gas limit
         });

         // Wait for transaction to be mined
         await tx.wait();

         // Add the transaction to the list immediately
         const newTx = {
            type: "Send",
            address: toAddress,
            amount: `-${amount} ETH`,
            icon: "ethereum",
            timestamp: Date.now(),
            txHash: tx.hash,
            network: network.name,
         };

         setTransactions((prev) => [newTx, ...prev]);

         // Update balance and token balances
         await updateBalance(address);
         await fetchTokenBalances(address);

         return {
            success: true,
            txHash: tx.hash,
            blockExplorerUrl: `${network.blockExplorer}/tx/${tx.hash}`,
         };
      } catch (error) {
         console.error("Error sending transaction:", error);
         return {
            success: false,
            error: error.message,
         };
      }
   };

   // Function to send ERC20 tokens
   const sendToken = async (tokenAddress, toAddress, amount, decimals) => {
      try {
         if (!wallet) throw new Error("No wallet loaded");

         const provider = getProvider();
         const walletWithProvider = wallet.connect(provider);

         // ERC20 ABI for transfer function
         const erc20Abi = [
            "function transfer(address to, uint amount) returns (bool)",
            "function balanceOf(address owner) view returns (uint256)",
            "function symbol() view returns (string)",
         ];

         // Create contract instance
         const tokenContract = new ethers.Contract(
            tokenAddress,
            erc20Abi,
            walletWithProvider
         );

         // Convert amount based on token decimals
         const amountBigNumber = ethers.utils.parseUnits(amount, decimals);

         // Check if we have enough tokens
         const balance = await tokenContract.balanceOf(address);
         if (balance.lt(amountBigNumber)) {
            throw new Error("Insufficient token balance");
         }

         // Get token symbol
         const symbol = await tokenContract.symbol();

         // Get current gas price
         const gasPrice = await provider.getGasPrice();

         // Send the transaction
         const tx = await tokenContract.transfer(toAddress, amountBigNumber, {
            gasPrice: gasPrice,
            gasLimit: 100000, // Standard gas limit for ERC20 transfers
         });

         // Wait for transaction to be mined
         await tx.wait();

         // Add to transactions list
         const newTx = {
            type: "Send",
            address: toAddress,
            amount: `-${amount} ${symbol}`,
            icon: symbol.toLowerCase(),
            timestamp: Date.now(),
            txHash: tx.hash,
            network: network.name,
         };

         setTransactions((prev) => [newTx, ...prev]);

         // Update balances
         await fetchTokenBalances(address);

         return {
            success: true,
            txHash: tx.hash,
            blockExplorerUrl: `${network.blockExplorer}/tx/${tx.hash}`,
         };
      } catch (error) {
         console.error("Error sending token:", error);
         return {
            success: false,
            error: error.message,
         };
      }
   };

   // Function to disconnect wallet
   const disconnectWallet = () => {
      setWallet(null);
      setAddress("");
      setBalance("0");
      setTransactions([]);
      setAssets([]);
      setIsConnected(false);
   };

   // Switch network (mainnet/testnet)
   const switchNetwork = async (networkType) => {
      if (networkType !== "mainnet" && networkType !== "testnet") {
         throw new Error("Invalid network type");
      }

      setNetwork(SCROLL_NETWORKS[networkType]);

      // If wallet is connected, refresh data for new network
      if (isConnected && address) {
         await checkNetworkStatus();
         await updateBalance(address);
         await fetchTokenBalances(address);
         await getTransactions(address);
      }

      return true;
   };

   // Check for network issues periodically
   useEffect(() => {
      const intervalId = setInterval(() => {
         if (isConnected) {
            checkNetworkStatus();
         }
      }, 30000); // Check every 30 seconds

      return () => clearInterval(intervalId);
   }, [isConnected]);

   // Update data when address changes
   useEffect(() => {
      if (address) {
         updateBalance(address);
         fetchTokenBalances(address);
         getTransactions(address);
      }
   }, [address]);

   // Initial network check on component mount
   useEffect(() => {
      checkNetworkStatus();
   }, []);

   const value = {
      wallet,
      address,
      balance,
      transactions,
      assets,
      network,
      networkStatus,
      isConnected,
      createWallet,
      importWallet,
      loadWallet,
      updateBalance,
      getTransactions,
      sendTransaction,
      sendToken,
      disconnectWallet,
      switchNetwork,
      checkNetworkStatus,
      fetchTokenBalances,
      SCROLL_TOKENS,
   };

   return (
      <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
   );
};
