import React, { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";

export const WalletContext = createContext();

const SCROLL_NETWORKS = {
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

const SCROLL_TOKENS = {
   USDC: {
      address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
      icon: "usdc",
   },
   USDT: {
      address: "0xDd29a69462a08006Fda068D090b44B045958C5B7",
      decimals: 6,
      symbol: "USDT",
      name: "Tether USD",
      icon: "usdt",
   },
   SCROLL: {
      address: "0x5300000000000000000000000000000000000002",
      decimals: 18,
      symbol: "SCR",
      name: "Scroll Token",
      icon: "scroll",
   },
};

const DEFAULT_ASSETS = [
   {
      name: "Ethereum",
      symbol: "ETH",
      amount: "0",
      displayAmount: "0.0000 ETH",
      value: "$0.00",
      change: "$0.00",
      changePercent: "0.00%",
      icon: "ethereum",
   },
   {
      name: "USD Coin",
      symbol: "USDC",
      amount: "0",
      displayAmount: "0.00 USDC",
      value: "$0.00",
      change: "$0.00",
      changePercent: "0.00%",
      icon: "usdc",
   },
   {
      name: "Tether USD",
      symbol: "USDT",
      amount: "0",
      displayAmount: "0.00 USDT",
      value: "$0.00",
      change: "$0.00",
      changePercent: "0.00%",
      icon: "usdt",
   },
   {
      name: "Scroll Token",
      symbol: "SCR",
      amount: "0",
      displayAmount: "0.00 SCR",
      value: "$0.00",
      change: "$0.00",
      changePercent: "0.00%",
      icon: "scroll",
   },
];

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
   const [loading, setLoading] = useState({
      wallet: false,
      balance: false,
      transactions: false,
      tokens: false,
      sending: false,
   });

   const getProvider = () => {
      try {
         const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
         return provider;
      } catch (error) {
         console.error("Error creating provider:", error);
         throw new Error("Failed to connect to the network");
      }
   };

   const checkNetworkStatus = async () => {
      try {
         const provider = getProvider();
         const startTime = Date.now();

         const timeoutPromise = new Promise((_, reject) => {
            setTimeout(
               () => reject(new Error("Network request timed out")),
               5000
            );
         });

         const blockNumberPromise = provider.getBlockNumber();
         await Promise.race([blockNumberPromise, timeoutPromise]);

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

   const createWallet = async (password) => {
      setLoading((prev) => ({ ...prev, wallet: true }));
      try {
         const isNetworkAvailable = await checkNetworkStatus();
         if (!isNetworkAvailable)
            return {
               success: false,
               error: "Cannot connect to Scroll network",
            };

         if (!password) {
            throw new Error("Password is required");
         }

         const newWallet = ethers.Wallet.createRandom();
         // We can grab the mnemonic to show seed phrase later
         const mnemonic = newWallet.mnemonic.phrase;

         const passwordStr =
            typeof password === "string" ? password : String(password);
         const encryptedWallet = await newWallet.encrypt(passwordStr);

         const walletData = {
            encryptedWallet,
            network: network.name,
            address: newWallet.address,
            timestamp: Date.now(),
         };

         localStorage.setItem("scrollWallet", JSON.stringify(walletData));

         setWallet(newWallet);
         setAddress(newWallet.address);
         setIsConnected(true);

         await updateBalance(newWallet.address);
         await fetchTokenBalances(newWallet.address);

         return {
            success: true,
            address: newWallet.address,
            mnemonic, // Return the seed phrase
         };
      } catch (error) {
         console.error("Error creating wallet:", error);
         return {
            success: false,
            error: error.message || "Failed to create wallet",
         };
      } finally {
         setLoading((prev) => ({ ...prev, wallet: false }));
      }
   };

   const importWallet = async (recoveryPhrase, password) => {
      // Import via Seed Phrase
      setLoading((prev) => ({ ...prev, wallet: true }));
      try {
         const isNetworkAvailable = await checkNetworkStatus();
         if (!isNetworkAvailable) {
            return {
               success: false,
               error: "Cannot connect to Scroll network",
            };
         }

         if (!recoveryPhrase || !password) {
            throw new Error("Recovery phrase and password are required");
         }

         const newWallet = ethers.Wallet.fromMnemonic(recoveryPhrase.trim());
         const passwordStr =
            typeof password === "string" ? password : String(password);
         const encryptedWallet = await newWallet.encrypt(passwordStr);

         const walletData = {
            encryptedWallet,
            network: network.name,
            address: newWallet.address,
            timestamp: Date.now(),
         };

         localStorage.setItem("scrollWallet", JSON.stringify(walletData));
         setWallet(newWallet);
         setAddress(newWallet.address);
         setIsConnected(true);

         await updateBalance(newWallet.address);
         await fetchTokenBalances(newWallet.address);

         return {
            success: true,
            address: newWallet.address,
         };
      } catch (error) {
         console.error("Error importing wallet:", error);
         return {
            success: false,
            error: error.message || "Failed to import wallet",
         };
      } finally {
         setLoading((prev) => ({ ...prev, wallet: false }));
      }
   };

   // New: Import via Private Key
   const importWalletByPrivateKey = async (privateKey, password) => {
      setLoading((prev) => ({ ...prev, wallet: true }));
      try {
         const isNetworkAvailable = await checkNetworkStatus();
         if (!isNetworkAvailable) {
            return {
               success: false,
               error: "Cannot connect to Scroll network",
            };
         }

         if (!privateKey || !password) {
            throw new Error("Private key and password are required");
         }

         const newWallet = new ethers.Wallet(privateKey.trim());
         const passwordStr =
            typeof password === "string" ? password : String(password);
         const encryptedWallet = await newWallet.encrypt(passwordStr);

         const walletData = {
            encryptedWallet,
            network: network.name,
            address: newWallet.address,
            timestamp: Date.now(),
         };

         localStorage.setItem("scrollWallet", JSON.stringify(walletData));
         setWallet(newWallet);
         setAddress(newWallet.address);
         setIsConnected(true);

         await updateBalance(newWallet.address);
         await fetchTokenBalances(newWallet.address);

         return {
            success: true,
            address: newWallet.address,
         };
      } catch (error) {
         console.error("Error importing wallet by private key:", error);
         return {
            success: false,
            error: error.message || "Failed to import wallet",
         };
      } finally {
         setLoading((prev) => ({ ...prev, wallet: false }));
      }
   };

   const loadWallet = async (password) => {
      setLoading((prev) => ({ ...prev, wallet: true }));
      try {
         const isNetworkAvailable = await checkNetworkStatus();
         if (!isNetworkAvailable) {
            return {
               success: false,
               error: "Cannot connect to Scroll network",
            };
         }

         if (!password) {
            throw new Error("Password is required");
         }

         const walletDataString = localStorage.getItem("scrollWallet");
         if (!walletDataString) {
            return {
               success: false,
               error: "No wallet found in local storage",
            };
         }

         const walletData = JSON.parse(walletDataString);
         const passwordStr =
            typeof password === "string" ? password : String(password);
         const decryptedWallet = await ethers.Wallet.fromEncryptedJson(
            walletData.encryptedWallet,
            passwordStr
         );

         setWallet(decryptedWallet);
         setAddress(decryptedWallet.address);
         setIsConnected(true);

         await updateBalance(decryptedWallet.address);
         await fetchTokenBalances(decryptedWallet.address);

         return {
            success: true,
            address: decryptedWallet.address,
         };
      } catch (error) {
         console.error("Error loading wallet:", error);
         return {
            success: false,
            error: error.message || "Failed to load wallet",
         };
      } finally {
         setLoading((prev) => ({ ...prev, wallet: false }));
      }
   };

   const updateBalance = async (walletAddress) => {
      setLoading((prev) => ({ ...prev, balance: true }));
      try {
         const provider = getProvider();
         const balanceWei = await provider.getBalance(walletAddress);
         const balanceEth = ethers.utils.formatEther(balanceWei);
         setBalance(balanceEth);
         return balanceEth;
      } catch (error) {
         console.error("Error updating balance:", error);
         setBalance("0");
         return "0";
      } finally {
         setLoading((prev) => ({ ...prev, balance: false }));
      }
   };

   const fetchTokenBalances = async (walletAddress) => {
      setLoading((prev) => ({ ...prev, tokens: true }));
      try {
         const provider = getProvider();
         const tokenList = [];

         const erc20Abi = [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",
         ];

         // Fetch ETH first
         const ethBalanceWei = await provider.getBalance(walletAddress);
         const ethBalanceFormatted = ethers.utils.formatEther(ethBalanceWei);

         // Fetch ETH price from Coingecko
         let ethPrice = 2000;
         let ethChangePercent = 0;

         try {
            const ethPriceResponse = await fetch(
               "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true"
            );
            if (ethPriceResponse.ok) {
               const ethPriceData = await ethPriceResponse.json();
               ethPrice = ethPriceData.ethereum?.usd || ethPrice;
               ethChangePercent = ethPriceData.ethereum?.usd_24h_change || 0;
            }
         } catch (priceError) {
            console.error("Error fetching ETH price:", priceError);
         }

         const previousPrice = ethPrice / (1 + ethChangePercent / 100);
         const ethChange = ethPrice - previousPrice;
         const ethValueUSD = parseFloat(ethBalanceFormatted) * ethPrice;
         const myBalanceChange = ethChange * parseFloat(ethBalanceFormatted);

         tokenList.push({
            name: "Ethereum",
            symbol: "ETH",
            amount: ethBalanceFormatted,
            displayAmount: `${parseFloat(ethBalanceFormatted).toFixed(4)} ETH`,
            value: `$${ethValueUSD.toFixed(2)}`,
            change: `${
               myBalanceChange >= 0 ? "+" : ""
            }$${myBalanceChange.toFixed(2)}`,
            changePercent: `${
               ethChangePercent >= 0 ? "+" : ""
            }${ethChangePercent.toFixed(2)}%`,
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
               const code = await provider.getCode(token.address);
               if (code === "0x") {
                  console.warn(
                     `No contract found at address for ${name}: ${token.address}`
                  );
                  continue;
               }

               let balance;
               try {
                  balance = await contract.balanceOf(walletAddress);
               } catch (error) {
                  console.error(`Error fetching ${name} balance:`, error);
                  continue;
               }

               const decimals = token.decimals;
               const symbol = token.symbol;
               const formatted = ethers.utils.formatUnits(balance, decimals);

               // Basic price logic
               let tokenPrice = name === "USDC" || name === "USDT" ? 1.0 : 0.5;
               let tokenChangePercent = 0;

               if (name === "SCROLL") {
                  try {
                     const tokenPriceResponse = await fetch(
                        "https://api.coingecko.com/api/v3/simple/price?ids=scroll&vs_currencies=usd&include_24hr_change=true"
                     );
                     if (tokenPriceResponse.ok) {
                        const tokenPriceData = await tokenPriceResponse.json();
                        tokenPrice = tokenPriceData.scroll?.usd || tokenPrice;
                        tokenChangePercent =
                           tokenPriceData.scroll?.usd_24h_change || 0;
                     }
                  } catch (priceError) {
                     console.error(`Error fetching ${name} price:`, priceError);
                  }
               }

               const valueUSD = parseFloat(formatted) * tokenPrice;
               const previousTokenPrice =
                  tokenPrice / (1 + tokenChangePercent / 100);
               const tokenChange = tokenPrice - previousTokenPrice;
               const myTokenBalanceChange = tokenChange * parseFloat(formatted);

               if (parseFloat(formatted) > 0) {
                  tokenList.push({
                     name: token.name,
                     symbol: token.symbol,
                     amount: formatted,
                     displayAmount: `${parseFloat(formatted).toFixed(2)} ${
                        token.symbol
                     }`,
                     value: `$${valueUSD.toFixed(2)}`,
                     change: `${
                        myTokenBalanceChange >= 0 ? "+" : ""
                     }$${myTokenBalanceChange.toFixed(2)}`,
                     changePercent: `${
                        tokenChangePercent >= 0 ? "+" : ""
                     }${tokenChangePercent.toFixed(2)}%`,
                     icon: token.icon,
                  });
               }
            } catch (error) {
               console.error(`Error processing ${name}:`, error);
            }
         }

         // If user has no tokens except ETH, show placeholders
         if (tokenList.length === 1) {
            tokenList.push(...DEFAULT_ASSETS.slice(1));
         }

         setAssets(tokenList);
      } catch (error) {
         console.error("Error fetching token balances:", error);
         setAssets(DEFAULT_ASSETS);
      } finally {
         setLoading((prev) => ({ ...prev, tokens: false }));
      }
   };

   const getTransactions = async (walletAddress) => {
      setLoading((prev) => ({ ...prev, transactions: true }));
      try {
         const provider = getProvider();
         let history;
         try {
            history = await provider.getHistory(walletAddress);
         } catch (error) {
            console.error("Error fetching transaction history:", error);
            history = [];
         }

         const transactionList = history.map((tx) => {
            return {
               type: tx.from === walletAddress ? "Send" : "Receive",
               address: tx.from === walletAddress ? tx.to : tx.from,
               amount: ethers.utils.formatEther(tx.value),
               icon: "ethereum",
               timestamp: tx.timestamp ? tx.timestamp * 1000 : Date.now(),
               txHash: tx.hash,
               network: network.name,
            };
         });
         setTransactions(transactionList);
      } catch (error) {
         console.error("Error getting transactions:", error);
         setTransactions([]);
      } finally {
         setLoading((prev) => ({ ...prev, transactions: false }));
      }
   };

   const sendTransaction = async (toAddress, amount) => {
      setLoading((prev) => ({ ...prev, sending: true }));
      try {
         if (!wallet) throw new Error("No wallet loaded");

         if (!toAddress || !amount) {
            throw new Error("Address and amount are required");
         }

         if (!ethers.utils.isAddress(toAddress)) {
            throw new Error("Invalid recipient address");
         }

         if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            throw new Error("Invalid amount");
         }

         const provider = getProvider();
         const walletWithProvider = wallet.connect(provider);

         const amountWei = ethers.utils.parseEther(amount);
         const currentBalance = await provider.getBalance(address);
         if (currentBalance.lt(amountWei)) {
            throw new Error("Insufficient balance");
         }

         const gasPrice = await provider.getGasPrice();
         const gasLimit = await provider.estimateGas({
            to: toAddress,
            value: amountWei,
         });

         const adjustedGasLimit = gasLimit.mul(12).div(10);

         const tx = await walletWithProvider.sendTransaction({
            to: toAddress,
            value: amountWei,
            gasPrice: gasPrice,
            gasLimit: adjustedGasLimit,
         });

         await tx.wait();

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
            error: error.message || "Transaction failed",
         };
      } finally {
         setLoading((prev) => ({ ...prev, sending: false }));
      }
   };

   const sendToken = async (tokenAddress, toAddress, amount, decimals) => {
      setLoading((prev) => ({ ...prev, sending: true }));
      try {
         if (!wallet) throw new Error("No wallet loaded");

         if (!tokenAddress || !toAddress || !amount || decimals === undefined) {
            throw new Error(
               "Token address, recipient address, amount, and decimals are required"
            );
         }

         if (
            !ethers.utils.isAddress(tokenAddress) ||
            !ethers.utils.isAddress(toAddress)
         ) {
            throw new Error("Invalid address");
         }

         if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            throw new Error("Invalid amount");
         }

         const provider = getProvider();
         const walletWithProvider = wallet.connect(provider);
         const code = await provider.getCode(tokenAddress);
         if (code === "0x") {
            throw new Error("No contract found at token address");
         }

         const erc20Abi = [
            "function transfer(address to, uint amount) returns (bool)",
            "function balanceOf(address owner) view returns (uint256)",
            "function symbol() view returns (string)",
         ];

         const tokenContract = new ethers.Contract(
            tokenAddress,
            erc20Abi,
            walletWithProvider
         );
         const amountBigNumber = ethers.utils.parseUnits(amount, decimals);

         let balance;
         try {
            balance = await tokenContract.balanceOf(address);
         } catch (error) {
            throw new Error(`Failed to fetch token balance: ${error.message}`);
         }

         if (balance.lt(amountBigNumber)) {
            throw new Error("Insufficient token balance");
         }

         let symbol;
         try {
            symbol = await tokenContract.symbol();
         } catch (error) {
            console.error("Error fetching token symbol:", error);
            symbol = "TOKEN";
         }

         const gasPrice = await provider.getGasPrice();
         let gasLimit;
         try {
            gasLimit = await tokenContract.estimateGas.transfer(
               toAddress,
               amountBigNumber,
               {
                  from: address,
               }
            );
         } catch (error) {
            console.error("Error estimating gas:", error);
            gasLimit = ethers.BigNumber.from(100000);
         }

         const adjustedGasLimit = gasLimit.mul(12).div(10);

         const tx = await tokenContract.transfer(toAddress, amountBigNumber, {
            gasPrice: gasPrice,
            gasLimit: adjustedGasLimit,
         });

         await tx.wait();

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
            error: error.message || "Token transfer failed",
         };
      } finally {
         setLoading((prev) => ({ ...prev, sending: false }));
      }
   };

   const disconnectWallet = () => {
      setWallet(null);
      setAddress("");
      setBalance("0");
      setTransactions([]);
      setAssets([]);
      setIsConnected(false);
      localStorage.removeItem("scrollWallet");
   };

   const switchNetwork = async (networkType) => {
      try {
         if (networkType !== "mainnet" && networkType !== "testnet") {
            throw new Error("Invalid network type");
         }
         setNetwork(SCROLL_NETWORKS[networkType]);

         if (isConnected && address) {
            await checkNetworkStatus();
            await updateBalance(address);
            await fetchTokenBalances(address);
            await getTransactions(address);
         }
         return { success: true };
      } catch (error) {
         console.error("Error switching network:", error);
         return {
            success: false,
            error: error.message || "Failed to switch network",
         };
      }
   };

   useEffect(() => {
      const intervalId = setInterval(() => {
         if (isConnected) {
            checkNetworkStatus();
         }
      }, 30000);

      return () => clearInterval(intervalId);
   }, [isConnected]);

   useEffect(() => {
      if (address) {
         updateBalance(address);
         fetchTokenBalances(address);
         getTransactions(address);
      }
   }, [address]);

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
      loading,
      createWallet,
      importWallet,
      importWalletByPrivateKey,
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

export const useWallet = () => useContext(WalletContext);
