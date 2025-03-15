import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import "./pages.css";
import EyeIcon from "../Components/EyeIcon/EyeIcon";

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
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [passwordMatch, setPasswordMatch] = useState(true);
   const navigate = useNavigate();
   const [step, setStep] = useState(1); // 1: Seed Phrase, 2: Password
   const [passwordVisible, setPasswordVisible] = useState(false);
   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

   const handleWordChange = (index, value) => {
      const newWords = [...seedWords];
      newWords[index] = value.trim().toLowerCase();
      setSeedWords(newWords);

      if (errorMessage) {
         setErrorMessage("");
      }
   };
   const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
   };

   const toggleConfirmPasswordVisibility = () => {
      setConfirmPasswordVisible(!confirmPasswordVisible);
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

   const handleNext = () => {
      if (step === 1 && validateSeedPhrase()) {
         setStep(2);
      }
   };

   const handleImportWallet = async () => {
      if (password !== confirmPassword) {
         setPasswordMatch(false);
         return;
      }

      setIsLoading(true);
      try {
         const phrase = seedWords.join(" ");
         const success = await importWallet(phrase, password);

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
      if (step === 2) {
         setStep(1);
      } else {
         navigate("/");
      }
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
                  {step === 1
                     ? "Enter your recovery phrase to import your existing wallet."
                     : "Set up a password for your imported wallet."}
               </p>
            </div>

            {step === 1 && (
               <>
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
                        onClick={handleNext}
                        className="primary-btn"
                        disabled={isLoading}>
                        Next
                     </button>
                  </div>
               </>
            )}
            {step === 2 && (
               <>
                  <div className="space-y-4 w-full">
                     <div className="relative password-input mx-auto">
                        <input
                           type={passwordVisible ? "text" : "password"}
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="focus:outline-none"
                           placeholder="Enter your password"
                           disabled={isLoading}
                        />
                        <EyeIcon
                           isVisible={passwordVisible}
                           toggleVisibility={togglePasswordVisibility}
                        />
                     </div>
                     <div className="relative password-input mx-auto">
                        <input
                           type={confirmPasswordVisible ? "text" : "password"}
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           className="focus:outline-none"
                           placeholder="Confirm your password"
                           disabled={isLoading}
                        />
                        <EyeIcon
                           isVisible={confirmPasswordVisible}
                           toggleVisibility={toggleConfirmPasswordVisibility}
                        />
                     </div>
                     {!passwordMatch && (
                        <p className="text-red-500 text-sm mt-1 error">
                           Passwords do not match.
                        </p>
                     )}
                  </div>
                  <div className="btn-container mt-8 w-full">
                     {" "}
                     <button
                        onClick={handleImportWallet}
                        className={`primary-btn ${
                           password && confirmPassword
                              ? ""
                              : "cursor-not-allowed opacity-50"
                        }`}
                        disabled={isLoading || !password || !confirmPassword}>
                        {isLoading ? "Importing..." : "Import Wallet"}
                     </button>
                     {!password && !confirmPassword && (
                        <p className="text-red-500 text-sm mt-1 error">
                           Password required.
                        </p>
                     )}
                  </div>
               </>
            )}

            <button onClick={handleGoBack} className="secondary-btn w-full">
               Back
            </button>
         </div>
      </div>
   );
};

export default ImportWalletPage;
