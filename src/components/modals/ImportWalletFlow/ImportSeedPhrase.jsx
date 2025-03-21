// src/components/modals/ImportWalletFlow/ImportSeedPhrase.jsx
import React, { useState } from "react";
import Modal from "../../common/Modal";
import Button from "../../common/Button";
import SeedPhraseInput from "../../common/SeedPhraseInput";

const ImportSeedPhrase = ({ onBack, onNext }) => {
   const [seedWords, setSeedWords] = useState(Array(12).fill(""));
   const [focusedInput, setFocusedInput] = useState(null);
   const [visibleInputs, setVisibleInputs] = useState(Array(12).fill(false));

   const handleWordChange = (index, value) => {
      const newWords = [...seedWords];
      newWords[index] = value;
      setSeedWords(newWords);
   };

   const handleFocus = (index) => {
      setFocusedInput(index);
   };

   const handleShowText = (index) => {
      const newVisibility = [...visibleInputs];
      newVisibility[index] = true;
      setVisibleInputs(newVisibility);
   };

   const handleHideText = (index) => {
      const newVisibility = [...visibleInputs];
      newVisibility[index] = false;
      setVisibleInputs(newVisibility);
   };

   const handleSubmit = () => {
      // Basic validation: ensure all words are entered
      if (seedWords.some((word) => word.trim() === "")) {
         alert("Please fill in all seed phrase words.");
         return;
      }
      // Join seed phrase words by space
      const seedPhrase = seedWords.join(" ");
      onNext(seedPhrase);
   };

   return (
      <Modal title="Import via Seed Phrase" onBack={onBack}>
         <p className="text-gray-300 mb-4">
            Enter your 12-word recovery phrase below. Each input will mask the
            text but you can reveal it temporarily.
         </p>
         <div className="mb-6">
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
         </div>
         <Button onClick={handleSubmit}>Next</Button>
      </Modal>
   );
};

export default ImportSeedPhrase;
