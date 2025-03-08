import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import aesjs from "aes-js";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
   const [wallet, setWallet] = useState(null);
   const [address, setAddress] = useState("");
   const [balance, setBalance] = useState("0");
   const [transactions, setTransactions] = useState([]);
   const [assets, setAssets] = useState([]);

   // Get Scroll's provider
   const getProvider = () => {
      // For Scroll Mainnet
      // return new ethers.providers.JsonRpcProvider("https://rpc.scroll.io");

      //For Scroll's testnet instead
      return new ethers.providers.JsonRpcProvider(
         "https://sepolia-rpc.scroll.io"
      );
   };

   // Function to create a new wallet
   const createWallet = async (password) => {
      try {
         const newWallet = ethers.Wallet.createRandom();
         const encryptedWallet = await newWallet.encrypt(password);
         localStorage.setItem("encryptedWallet", encryptedWallet);
         setWallet(newWallet);
         setAddress(newWallet.address);
         await updateBalance(newWallet.address);
         return true;
      } catch (error) {
         console.error("Error creating wallet:", error);
         return false;
      }
   };

   // Function to import an existing wallet
   const importWallet = async (recoveryPhrase, password) => {
      try {
         const newWallet = ethers.Wallet.fromMnemonic(recoveryPhrase);
         const encryptedWallet = await newWallet.encrypt(password);
         localStorage.setItem("encryptedWallet", encryptedWallet);
         setWallet(newWallet);
         setAddress(newWallet.address);
         await updateBalance(newWallet.address);
         return true;
      } catch (error) {
         console.error("Error importing wallet:", error);
         return false;
      }
   };

   // Function to load the wallet from local storage
   const loadWallet = async (password) => {
      try {
         const encryptedWallet = localStorage.getItem("encryptedWallet");
         if (encryptedWallet) {
            const decryptedWallet = await ethers.Wallet.fromEncryptedJson(
               encryptedWallet,
               password
            );
            setWallet(decryptedWallet);
            setAddress(decryptedWallet.address);
            await updateBalance(decryptedWallet.address);
            return true;
         }
         return false;
      } catch (error) {
         console.error("Error loading wallet:", error);
         return false;
      }
   };

   // Function to update the wallet balance
   const updateBalance = async (address) => {
      try {
         // Use Scroll provider instead of default provider
         const provider = getProvider();
         const balanceWei = await provider.getBalance(address);
         const balanceEth = ethers.utils.formatEther(balanceWei);
         setBalance(balanceEth);
         return balanceEth;
      } catch (error) {
         console.error("Error updating balance:", error);
         return "0";
      }
   };

   // Function to get transaction history
   const getTransactions = async (address) => {
      try {
         // In a real app, fetch this from an API or blockchain explorer
         // For demonstration, we'll check if the address has a balance
         // and create a sample transaction if it does
         const provider = getProvider();
         const balanceWei = await provider.getBalance(address);

         if (balanceWei.gt(0)) {
            // If they have a balance, show a sample "receive" transaction
            setTransactions([
               {
                  type: "Receive",
                  address: `0x${Math.random()
                     .toString(16)
                     .slice(2, 10)}...${Math.random()
                     .toString(16)
                     .slice(2, 8)}`,
                  amount: `${ethers.utils.formatEther(balanceWei)} ETH`,
                  icon: "ethereum",
                  timestamp: Date.now(),
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

   // Function to simulate sending tokens (for demo purposes)
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

         // Create transaction
         const tx = await walletWithProvider.sendTransaction({
            to: toAddress,
            value: amountWei,
         });

         // Wait for transaction to be mined
         await tx.wait();

         // Update balance and transactions
         await updateBalance(address);
         await getTransactions(address);

         return true;
      } catch (error) {
         console.error("Error sending transaction:", error);
         return false;
      }
   };

   useEffect(() => {
      if (address) {
         updateBalance(address);
         getTransactions(address);
      }
   }, [address]);

   const value = {
      wallet,
      address,
      balance,
      transactions,
      assets,
      createWallet,
      importWallet,
      loadWallet,
      updateBalance,
      getTransactions,
      sendTransaction,
   };

   return (
      <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
   );
};
