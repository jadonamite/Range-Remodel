import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import "./pages.css";

const EyeIcon = ({ onMouseDown, onMouseUp, onMouseLeave }) => (
   <div
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}>
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width="20"
         height="20"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round">
         <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
         <circle cx="12" cy="12" r="3"></circle>
      </svg>
   </div>
);

const SeedPhraseInput = ({
   index,
   value,
   onChange,
   isFocused,
   onFocus,
   showText,
   onShowText,
   onHideText,
}) => (
   <div className="mb-2">
      <div className="relative">
         <input
            type={showText || isFocused ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(index, e.target.value)}
            onFocus={() => onFocus(index)}
            placeholder={`Word ${index + 1}`}
            className="p-2 pr-8 rounded-md w-full"
         />
         {value && (
            <EyeIcon
               onMouseDown={() => onShowText(index)}
               onMouseUp={() => onHideText(index)}
               onMouseLeave={() => onHideText(index)}
            />
         )}
      </div>
   </div>
);

const ImportWalletPage = () => {
   const { importWallet } = useContext(WalletContext);
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

      if (errorMessage) {
         setErrorMessage("");
      }
   };

   const handlePasteMnemonic = (e) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData("text").trim();
      const pastedWords = pastedText
         .toLowerCase()
         .split(/\s+/)
         .filter((word) => word.trim() !== "");
      const wordsToFill = Math.min(pastedWords.length, seedLength);
      const newSeedWords = [...seedWords];

      for (let i = 0; i < wordsToFill; i++) {
         newSeedWords[i] = pastedWords[i];
      }

      setSeedWords(newSeedWords);
      setErrorMessage("");

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
         const success = await importWallet(phrase, "your-password-here");

         if (success) {
            navigate("/created");
         } else {
            setErrorMessage(
               "Failed to import wallet. Please check your recovery phrase."
            );
         }
      } catch (error) {
         console.error("Wallet Import Error:", error);
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
            </div>
            <div className="phrase-length-selector mb-4 flex justify-center space-x-4">
               <button
                  onClick={() => handleSeedLengthChange(12)}
                  className={`px-4 py-2 rounded-md ${
                     seedLength === 12
                        ? "bg-[#6a3ff5] text-white"
                        : "bg-gray-700 text-gray-300"
                  }`}>
                  12 Words
               </button>
               <button
                  onClick={() => handleSeedLengthChange(24)}
                  className={`px-4 py-2 rounded-md ${
                     seedLength === 24
                        ? "bg-[#6a3ff5] text-white"
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
                  className="primary-btn"
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
