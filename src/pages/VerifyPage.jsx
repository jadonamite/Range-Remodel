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

const VerificationInput = ({
   index,
   onChange,
   value,
   isCorrect,
   isChecked,
   isFocused,
   onFocus,
   showText,
   onShowText,
   onHideText,
}) => (
   <div className="mb-4 relative">
      <label className="text-white mb-1 block">Word #{index}</label>
      <div className="relative">
         <input
            type={showText || isFocused ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => onFocus(index)}
            className={`p-2 pr-10 rounded-md w-full ${
               isChecked
                  ? isCorrect
                     ? "border-green-500"
                     : "border-red-500"
                  : ""
            }`}
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

const VerifyBackupPage = () => {
   const { wallet } = useContext(WalletContext);
   const [mnemonicWords, setMnemonicWords] = useState([]);
   const [wordIndices, setWordIndices] = useState([]);
   const [userInputs, setUserInputs] = useState({});
   const [isLoading, setIsLoading] = useState(true);
   const [isVerified, setIsVerified] = useState(false);
   const [isChecked, setIsChecked] = useState(false);
   const [verificationAttempts, setVerificationAttempts] = useState(0);
   const [focusedInput, setFocusedInput] = useState(null);
   const [visibleInputs, setVisibleInputs] = useState({});
   const navigate = useNavigate();

   // Number of words to verify
   const numberOfWordsToVerify = 4;

   useEffect(() => {
      const timeout = setTimeout(() => {
         if (!wallet?.mnemonic?.phrase) {
            setIsLoading(false);
            return;
         }

         const words = wallet.mnemonic.phrase.split(" ");
         setMnemonicWords(words);

         // Generate random indices to verify
         const indices = generateRandomIndices(
            words.length,
            numberOfWordsToVerify
         );
         setWordIndices(indices);

         // Initialize user inputs
         const initialInputs = {};
         indices.forEach((index) => {
            initialInputs[index] = "";
         });
         setUserInputs(initialInputs);

         setIsLoading(false);
      }, 500);

      return () => clearTimeout(timeout);
   }, [wallet]);

   const generateRandomIndices = (max, count) => {
      const indices = [];
      while (indices.length < count) {
         const randomIndex = Math.floor(Math.random() * max);
         // Add 1 because mnemonic words are 1-indexed in the UI
         const indexToAdd = randomIndex + 1;
         if (!indices.includes(indexToAdd)) {
            indices.push(indexToAdd);
         }
      }
      // Sort indices for better UX
      return indices.sort((a, b) => a - b);
   };

   const handleInputChange = (index, value) => {
      setUserInputs({
         ...userInputs,
         [index]: value.trim().toLowerCase(),
      });
      // Reset check state when input changes
      if (isChecked) {
         setIsChecked(false);
      }
   };

   const handleVerify = () => {
      let allCorrect = true;

      // Check each word
      wordIndices.forEach((index) => {
         // Adjust index for 0-based array
         const expectedWord = mnemonicWords[index - 1].toLowerCase();
         const userInput = userInputs[index].toLowerCase();

         if (expectedWord !== userInput) {
            allCorrect = false;
         }
      });

      setIsChecked(true);
      setVerificationAttempts(verificationAttempts + 1);

      if (allCorrect) {
         setIsVerified(true);
      } else if (verificationAttempts >= 2) {
         // After 3 attempts (0, 1, 2), suggest they review their backup
         alert(
            "You seem to be having trouble verifying your phrase. Please go back and make sure you've recorded your recovery phrase correctly."
         );
      }
   };

   const handleNavigateToCreated = () => {
      navigate("/created");
   };

   const handleGoBack = () => {
      navigate("/backup");
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

   const isInputComplete = () => {
      return wordIndices.every(
         (index) => userInputs[index] && userInputs[index].trim() !== ""
      );
   };

   const renderWordChecks = () => {
      return (
         <div className="space-y-4">
            {wordIndices.map((index) => (
               <VerificationInput
                  key={`verify-${index}`}
                  index={index}
                  value={userInputs[index] || ""}
                  onChange={(value) => handleInputChange(index, value)}
                  isCorrect={
                     userInputs[index]?.toLowerCase() ===
                     mnemonicWords[index - 1]?.toLowerCase()
                  }
                  isChecked={isChecked}
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
               <h1 className="text-xl font-bold mb-2">Verify Your Backup</h1>
               <p className="text-sm mb-4">
                  Please enter the following {numberOfWordsToVerify} words from
                  your recovery phrase to confirm you've backed it up correctly.
               </p>
            </div>

            <div className="display">
               <div className="mnemonic-display p-4">
                  {isLoading ? (
                     <div className="text-center py-8">
                        <p>Preparing verification...</p>
                     </div>
                  ) : isVerified ? (
                     <div className="text-center py-8 text-green-500">
                        <p className="font-bold mb-2">
                           Verification Successful!
                        </p>
                        <p>
                           You've successfully verified your recovery phrase.
                        </p>
                     </div>
                  ) : (
                     renderWordChecks()
                  )}
               </div>
            </div>

            <div className="btn-container mt-4 w-full flex flex-col space-y-2">
               {isVerified ? (
                  <div className="btn-container mt-1 w-full">
                     <button
                        onClick={handleNavigateToCreated}
                        className="primary-btn w-full">
                        Continue to Wallet
                     </button>
                  </div>
               ) : (
                  <>
                     <div className="btn-container mt-1 w-full">
                        <button
                           onClick={handleVerify}
                           className="primary-btn w-full"
                           disabled={!isInputComplete()}>
                           Verify My Backup
                        </button>
                        <button onClick={handleGoBack} className="mt-6 w-full">
                           Back to Recovery Phrase
                        </button>
                     </div>
                  </>
               )}
            </div>
         </div>
      </div>
   );
};

export default VerifyBackupPage;
