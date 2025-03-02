import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import "./pages.css";

// Eye icon component for show/hide
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
            className="p-2 pr-10 rounded-md w-full"
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
         await importWalletFromMnemonic(phrase);
         navigate("/wallet");
      } catch (error) {
         console.error("Failed to import wallet:", error);
         setErrorMessage(
            "Invalid recovery phrase. Please check your words and try again."
         );
      } finally {
         setIsLoading(false);
      }
   };

   const handleGoBack = () => {
      navigate("/");
   };

   const renderSeedInputs = () => {
      // Create a grid with 3 columns
      const columns = 3;
      const rows = Math.ceil(seedLength / columns);

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
                  <span className="text-sm block mt-1 opacity-80">
                     For privacy, your entries will be hidden when not in focus.
                     Hold the eye icon to reveal.
                  </span>
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

            <div className="display">
               <div className="mnemonic-display p-4">
                  {renderSeedInputs()}

                  {errorMessage && (
                     <div className="mt-4 text-red-500 text-center">
                        {errorMessage}
                     </div>
                  )}
               </div>
            </div>

            <div className="btn-container mt-4 w-full flex flex-col space-y-2">
               <button
                  onClick={handleImportWallet}
                  className="primary-btn w-full"
                  disabled={isLoading}>
                  {isLoading ? "Importing..." : "Import Wallet"}
               </button>
               <button onClick={handleGoBack} className="secondary-btn w-full">
                  Back
               </button>
            </div>
         </div>
      </div>
   );
};

export default ImportWalletPage;
