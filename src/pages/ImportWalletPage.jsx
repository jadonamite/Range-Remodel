import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import "./pages.css";

// [Previous EyeIcon and SeedPhraseInput components remain the same]

const ImportWalletPage = () => {
   const { importWalletFromMnemonic } = useContext(WalletContext);
   const [seedWords, setSeedWords] = useState(Array(12).fill(""));
   const [seedLength, setSeedLength] = useState(12);
   const [isLoading, setIsLoading] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const [focusedInput, setFocusedInput] = useState(null);
   const [visibleInputs, setVisibleInputs] = useState({});
   const navigate = useNavigate();

   const handleWordChange = (index, value) => {
      const newWords = [...seedWords];
      newWords[index] = value.trim().toLowerCase();
      setSeedWords(newWords);

      // Clear error when user starts typing again
      if (errorMessage) {
         setErrorMessage("");
      }
   };

   const handlePasteMnemonic = (e) => {
      e.preventDefault();

      // Get clipboard text
      const pastedText = e.clipboardData.getData("text").trim();

      // Split the pasted text into words
      const pastedWords = pastedText
         .toLowerCase()
         .split(/\s+/)
         .filter((word) => word.trim() !== "");

      // Determine the number of words to fill
      const wordsToFill = Math.min(pastedWords.length, seedLength);

      // Create a new array of seed words
      const newSeedWords = [...seedWords];

      // Fill the words
      for (let i = 0; i < wordsToFill; i++) {
         newSeedWords[i] = pastedWords[i];
      }

      // Update state
      setSeedWords(newSeedWords);

      // Clear any previous error
      setErrorMessage("");

      // If more words are pasted than the current seed length, adjust length
      if (pastedWords.length > seedLength) {
         const newLength = pastedWords.length === 12 ? 12 : 24;
         setSeedLength(newLength);
      }
   };

   const handleSeedLengthChange = (length) => {
      setSeedLength(length);
      setSeedWords(Array(length).fill(""));
      setErrorMessage("");
   };

   const handleFocus = (index) => {
      setFocusedInput(index);
   };

   const handleShowText = (index) => {
      setVisibleInputs({
         ...visibleInputs,
         [index]: true,
      });
   };

   const handleHideText = (index) => {
      setVisibleInputs({
         ...visibleInputs,
         [index]: false,
      });
   };

   const validateSeedPhrase = () => {
      // Check if all words are filled
      const hasEmptyWords = seedWords.some(
         (word) => !word || word.trim() === ""
      );
      if (hasEmptyWords) {
         setErrorMessage("Please fill in all words of your recovery phrase");
         return false;
      }

      return true;
   };

   const handleImportWallet = async () => {
      if (!validateSeedPhrase()) {
         return;
      }

      setIsLoading(true);
      try {
         const phrase = seedWords.join(" ");

         // Debugging log
         console.log("Attempting to import phrase:", phrase);

         // Validate phrase format (optional additional check)
         const wordCount = phrase.split(" ").length;
         if (wordCount !== seedLength) {
            throw new Error(
               `Invalid phrase length. Expected ${seedLength} words, got ${wordCount}`
            );
         }

         await importWalletFromMnemonic(phrase);
         navigate("/create-password");
      } catch (error) {
         console.error("Wallet Import Error:", error);

         // More detailed error logging
         if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
         }

         // More informative error message
         setErrorMessage(
            `Import failed: ${
               error.message ||
               "Invalid recovery phrase. Please check your words and try again."
            }`
         );
      } finally {
         setIsLoading(false);
      }
   };

   const handleGoBack = () => {
      navigate("/");
   };

   const renderSeedInputs = () => {
      return (
         <div className="grid grid-cols-3 gap-2">
            {seedWords.map((word, index) => (
               <SeedPhraseInput
                  key={`seed-${index}`}
                  index={index}
                  value={word}
                  onChange={handleWordChange}
                  isFocused={focusedInput === index}
                  onFocus={handleFocus}
                  showText={visibleInputs[index]}
                  onShowText={handleShowText}
                  onHideText={handleHideText}
               />
            ))}
         </div>
      );
   };

   return (
      <div className="full-background">
         <div className="o-container py-8">
            <div className="text">
               <h1 className="text-xl font-bold mb-2">Import Wallet</h1>
               <p className="text-sm mb-4">
                  Enter your recovery phrase to import your existing wallet.
               </p>
               <p className="text-xs text-gray-400 mb-2 text-center">
                  Tip: You can paste your entire recovery phrase, and it will be
                  automatically distributed.
               </p>
            </div>
            <div className="phrase-length-selector mb-4 flex justify-center space-x-4">
               <button
                  onClick={() => handleSeedLengthChange(12)}
                  className={`px-4 py-2 rounded-md ${
                     seedLength === 12
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300"
                  }`}>
                  12 Words
               </button>
               <button
                  onClick={() => handleSeedLengthChange(24)}
                  className={`px-4 py-2 rounded-md ${
                     seedLength === 24
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300"
                  }`}>
                  24 Words
               </button>
            </div>
            <div className="display" onPaste={handlePasteMnemonic}>
               <div className="mnemonic-display p-4 max-h-64 overflow-y-auto bg-white/10 rounded-lg">
                  {renderSeedInputs()}

                  {errorMessage && (
                     <div className="mt-4 text-red-500 text-center">
                        {errorMessage}
                     </div>
                  )}
               </div>
            </div>
            <div className="btn-container mt-4 w-full">
               <button
                  onClick={handleImportWallet}
                  className="primary-btn w-full"
                  disabled={isLoading}>
                  {isLoading ? "Importing..." : "Import Wallet"}
               </button>
            </div>

            <button
               onClick={handleGoBack}
               className="secondary-btn w-full mt-2">
               Back
            </button>
         </div>
      </div>
   );
};

export default ImportWalletPage;
