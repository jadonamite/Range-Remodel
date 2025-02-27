import { ethers } from "ethers";

class WalletService {
   // Create a new wallet with ethers.js
   static createWallet() {
      const wallet = ethers.Wallet.createRandom();
      return {
         address: wallet.address,
         privateKey: wallet.privateKey,
         mnemonic: wallet.mnemonic.phrase,
      };
   }

   // Import wallet from mnemonic phrase
   static importFromMnemonic(mnemonic) {
      try {
         const wallet = ethers.Wallet.fromMnemonic(mnemonic);
         return {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: mnemonic,
         };
      } catch (error) {
         console.error("Error importing wallet from mnemonic:", error);
         throw new Error("Invalid recovery phrase");
      }
   }

   // Import wallet from private key
   static importFromPrivateKey(privateKey) {
      try {
         const wallet = new ethers.Wallet(privateKey);
         return {
            address: wallet.address,
            privateKey: privateKey,
            mnemonic: null,
         };
      } catch (error) {
         console.error("Error importing wallet from private key:", error);
         throw new Error("Invalid private key");
      }
   }

   // Encrypt wallet data for storage
   static async encryptWallet(walletData, password) {
      try {
         const wallet = new ethers.Wallet(walletData.privateKey);
         const encryptedWallet = await wallet.encrypt(password);
         return {
            encryptedWallet,
            address: walletData.address,
            mnemonic: walletData.mnemonic,
         };
      } catch (error) {
         console.error("Error encrypting wallet:", error);
         throw new Error("Failed to encrypt wallet");
      }
   }

   // Decrypt stored wallet data
   static async decryptWallet(encryptedWallet, password) {
      try {
         const wallet = await ethers.Wallet.fromEncryptedJson(
            encryptedWallet,
            password
         );
         return {
            address: wallet.address,
            privateKey: wallet.privateKey,
         };
      } catch (error) {
         console.error("Error decrypting wallet:", error);
         throw new Error("Invalid password or corrupted wallet data");
      }
   }

   // Get wallet balance (ETH)
   static async getBalance(address, provider) {
      try {
         const balance = await provider.getBalance(address);
         return ethers.utils.formatEther(balance);
      } catch (error) {
         console.error("Error getting balance:", error);
         throw new Error("Failed to get wallet balance");
      }
   }

   // Get token balances (ERC20)
   static async getTokenBalance(address, tokenAddress, provider) {
      try {
         const erc20Abi = [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",
         ];

         const tokenContract = new ethers.Contract(
            tokenAddress,
            erc20Abi,
            provider
         );
         const balance = await tokenContract.balanceOf(address);
         const decimals = await tokenContract.decimals();
         const symbol = await tokenContract.symbol();

         return {
            symbol,
            balance: ethers.utils.formatUnits(balance, decimals),
         };
      } catch (error) {
         console.error("Error getting token balance:", error);
         throw new Error("Failed to get token balance");
      }
   }
}

export default WalletService;
