import React, { createContext, useState, useEffect } from "react";
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
      address: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
      icon: "usdc",
   },
   USDT: {
      address: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
      decimals: 6,
      symbol: "USDT",
      name: "Tether USD",
      icon: "usdt",
   },
   SCROLL: {
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
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

   const getProvider = () => {
      return new ethers.providers.JsonRpcProvider(network.rpcUrl);
   };

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

   const createWallet = async (password) => {
      try {
         const isNetworkAvailable = await checkNetworkStatus();
         if (!isNetworkAvailable) {
            throw new Error("Cannot connect to Scroll network");
         }

         const newWallet = ethers.Wallet.createRandom();
         const encryptedWallet = await newWallet.encrypt(password);

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

   const importWallet = async (recoveryPhrase, password) => {
      try {
         const isNetworkAvailable = await checkNetworkStatus();
         if (!isNetworkAvailable) {
            throw new Error("Cannot connect to Scroll network");
         }

         const newWallet = ethers.Wallet.fromMnemonic(recoveryPhrase);
         const encryptedWallet = await newWallet.encrypt(password);

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

   const loadWallet = async (password) => {
      try {
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

   const updateBalance = async (walletAddress) => {
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
      }
   };

   const fetchTokenBalances = async (walletAddress) => {
      try {
         const provider = getProvider();
         const tokenList = [];

         const erc20Abi = [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",
         ];

         const ethPriceResponse = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true"
         );
         const ethPriceData = await ethPriceResponse.json();
         const ethPrice = ethPriceData.ethereum.usd;
         const ethChangePercent = ethPriceData.ethereum.usd_24h_change || 0;

         // Calculate the previous price based on the current price and percentage change
         const previousPrice = ethPrice / (1 + ethChangePercent / 100);
         // Calculate the actual dollar change
         const ethChange = ethPrice - previousPrice;
         const ethBalanceWei = await provider.getBalance(walletAddress);
         const ethBalanceFormatted = ethers.utils.formatEther(ethBalanceWei);
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

               let mockPrice = 1.0;
               if (name === "SCROLL") {
                  const scrPriceResponse = await fetch(
                     "[https://api.coingecko.com/api/v3/simple/price?ids=scroll&vs_currencies=usd](https://api.coingecko.com/api/v3/simple/price?ids=scroll&vs_currencies=usd)"
                  );
                  const scrPriceData = await scrPriceResponse.json();
                  mockPrice = scrPriceData.scroll.usd;
               }

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
                     change: "+$0.50",
                     changePercent: "+0.8%",
                     icon: token.icon,
                  });
               }
            } catch (error) {
               console.error(`Error fetching ${name} balance:`, error);
            }
         }

         if (tokenList.length === 1) {
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

   const getTransactions = async (walletAddress) => {
      try {
         const provider = getProvider();
         const history = await provider.getHistory(walletAddress);
         const transactionList = history.map((tx) => {
            return {
               type: tx.from === walletAddress ? "Send" : "Receive",
               address: tx.from === walletAddress ? tx.to : tx.from,
               amount: ethers.utils.formatEther(tx.value),
               icon: "ethereum",
               timestamp: tx.timestamp * 1000,
               txHash: tx.hash,
               network: network.name,
            };
         });
         setTransactions(transactionList);
      } catch (error) {
         console.error("Error getting transactions:", error);
         setTransactions([]);
      }
   };

   const sendTransaction = async (toAddress, amount) => {
      try {
         if (!wallet) throw new Error("No wallet loaded");

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

         const tx = await walletWithProvider.sendTransaction({
            to: toAddress,
            value: amountWei,
            gasPrice: gasPrice,
            gasLimit: gasLimit.mul(12).div(10),
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
            blockExplorerUrl: `<span class="math-inline">\{network\.blockExplorer\}/tx/</span>{tx.hash}`,
         };
      } catch (error) {
         console.error("Error sending transaction:", error);
         return {
            success: false,
            error: error.message,
         };
      }
   };

   const sendToken = async (tokenAddress, toAddress, amount, decimals) => {
      try {
         if (!wallet) throw new Error("No wallet loaded");

         const provider = getProvider();
         const walletWithProvider = wallet.connect(provider);

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

         const balance = await tokenContract.balanceOf(address);
         if (balance.lt(amountBigNumber)) {
            throw new Error("Insufficient token balance");
         }

         const symbol = await tokenContract.symbol();

         const gasPrice = await provider.getGasPrice();

         const tx = await tokenContract.transfer(toAddress, amountBigNumber, {
            gasPrice: gasPrice,
            gasLimit: 100000,
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
            blockExplorerUrl: `<span class="math-inline">\{network\.blockExplorer\}/tx/</span>{tx.hash}`,
         };
      } catch (error) {
         console.error("Error sending token:", error);
         return {
            success: false,
            error: error.message,
         };
      }
   };

   const disconnectWallet = () => {
      setWallet(null);
      setAddress("");
      setBalance("0");
      setTransactions([]);
      setAssets([]);
      setIsConnected(false);
   };

   const switchNetwork = async (networkType) => {
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

      return true;
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
export const useWallet = () => useContext(WalletContext);
