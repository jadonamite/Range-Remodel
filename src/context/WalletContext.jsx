import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import aesjs from "aes-js";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
   const [wallet, setWallet] = useState(null);
   const [address, setAddress] = useState("");
   const [balance, setBalance] = useState("0");
   const [transactions, setTransactions] = useState([]);

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
         }
      } catch (error) {
         console.error("Error loading wallet:", error);
      }
   };

   // Function to update the wallet balance
   const updateBalance = async (address) => {
      try {
         const provider = new ethers.providers.getDefaultProvider();
         const balanceWei = await provider.getBalance(address);
         const balanceEth = ethers.utils.formatEther(balanceWei);
         setBalance(balanceEth);
      } catch (error) {
         console.error("Error updating balance:", error);
      }
   };

   // Function to get transaction history (placeholder)
   const getTransactions = async (address) => {
      // Implement fetching transaction history from a blockchain explorer API
      setTransactions([]); // Placeholder
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
      createWallet,
      importWallet,
      loadWallet,
      updateBalance,
      getTransactions,
   };

   return (
      <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
   );
};
