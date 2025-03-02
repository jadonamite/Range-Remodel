import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import "./pages.css";

// Separate component for mnemonic word display
const MnemonicWord = ({ index, word }) => (
   <li className="mb-4 p-2  rounded-md  text-white">
      <span className=" mr-2">{index}.</span>
      <span>{word}</span>
   </li>
);

// Component for a column of mnemonic words
const MnemonicColumn = ({ words, startIndex }) => (
   <ul className="space-y-2">
      {words.map((word, idx) => (
         <MnemonicWord
            key={`word-${startIndex + idx}`}
            index={startIndex + idx}
            word={word}
         />
      ))}
   </ul>
);

const BackupPage = () => {
   const { wallet } = useContext(WalletContext);
   const [mnemonicWords, setMnemonicWords] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isRevealed, setIsRevealed] = useState(false);
   const [hasBackedUp, setHasBackedUp] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      // Clear any timeout when component unmounts
      const timeout = setTimeout(() => {
         if (!wallet?.mnemonic?.phrase) {
            setIsLoading(false);
            return;
         }

         setMnemonicWords(wallet.mnemonic.phrase.split(" "));
         setIsLoading(false);
      }, 500);

      return () => clearTimeout(timeout);
   }, [wallet]);

   const handleToggleReveal = () => {
      setIsRevealed(!isRevealed);
   };

   const handleCopyMnemonic = () => {
      if (mnemonicWords.length > 0) {
         navigator.clipboard
            .writeText(mnemonicWords.join(" "))
            .then(() => {
               alert("Recovery phrase copied to clipboard");
            })
            .catch((err) => {
               console.error("Failed to copy: ", err);
            });
      }
   };

   const handleConfirmBackup = () => {
      setHasBackedUp(true);
   };

   const handleNavigateToWallet = () => {
      if (hasBackedUp) {
         navigate("/wallet");
      } else {
         alert("Please confirm you've backed up your recovery phrase first");
      }
   };

   const renderMnemonicGrid = () => {
      if (!isRevealed) {
         return (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
               <p className="text-red-600 font-bold mb-4">Security Warning</p>
               <p>Your recovery phrase is hidden for security.</p>
               <button
                  onClick={handleToggleReveal}
                  className="mt-4 bg-[#284b6e] hover:bg-yellow-600 text-white py-2 px-4 rounded">
                  Reveal Recovery Phrase
               </button>
            </div>
         );
      }

      // Divide words into three equal columns
      const columnSize = Math.ceil(mnemonicWords.length / 3);
      const columns = [
         mnemonicWords.slice(0, columnSize),
         mnemonicWords.slice(columnSize, columnSize * 2),
         mnemonicWords.slice(columnSize * 2),
      ];

      return (
         <>
            <div className="grid grid-cols-3 gap-3 mb-2">
               <MnemonicColumn words={columns[0]} startIndex={1} />
               <MnemonicColumn words={columns[1]} startIndex={columnSize + 1} />
               <MnemonicColumn
                  words={columns[2]}
                  startIndex={columnSize * 2 + 1}
               />
            </div>
            <div className="flex justify-between mt-4">
               <button
                  onClick={handleToggleReveal}
                  className="bg-[#284b6e] hover:bg-gray-600 text-white py-1 px-3 rounded">
                  Hide Phrase
               </button>
               <button
                  onClick={handleCopyMnemonic}
                  className="bg-[#284b6e]-500 hover:bg-blue-600 text-white py-1 px-3 rounded">
                  Copy to Clipboard
               </button>
            </div>
         </>
      );
   };

   return (
      <div className="full-background">
         <div className="o-container py-8">
            <div className="text">
               <h1 className="text-xl font-bold mb-2">Backup Your Wallet</h1>
               <p className="text-sm mb-4">
                  Your recovery phrase is the <strong>only way</strong> to
                  recover your wallet if you lose access to this device. Write
                  it down and store it somewhere safe and private.
               </p>
            </div>

            <div className="display">
               <div className="mnemonic-display p-4">
                  {isLoading ? (
                     <div className="text-center py-8">
                        <p>Loading your recovery phrase...</p>
                     </div>
                  ) : mnemonicWords.length > 0 ? (
                     renderMnemonicGrid()
                  ) : (
                     <div className="text-center py-8 text-red-600">
                        <p>
                           Unable to retrieve your recovery phrase. Please try
                           again later.
                        </p>
                     </div>
                  )}
               </div>
            </div>
            <div className="btn-container mt-1 w-full">
               {!hasBackedUp ? (
                  <button
                     onClick={handleConfirmBackup}
                     className="primary-btn btn"
                     disabled={isLoading || mnemonicWords.length === 0}>
                     I've Backed Up My Phrase
                  </button>
               ) : (
                  <button
                     onClick={handleNavigateToWallet}
                     className="primary-btn w-full">
                     Continue to Wallet
                  </button>
               )}
            </div>
         </div>
      </div>
   );
};

export default BackupPage;
