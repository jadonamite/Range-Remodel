import React, { useState, useEffect } from "react";
import { useWallet } from "../../../context/WalletContext";
import Modal from "../../common/Modal";
import Button from "../../common/Button";
import Loading from "../../common/Loading";

const ConfirmBackup = ({ seedPhrase, password, onBack }) => {
   const { loadWallet } = useWallet();
   const [allWords, setAllWords] = useState([]);
   const [selectedWords, setSelectedWords] = useState([]);
   const [confirmIndices, setConfirmIndices] = useState([]);
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const [success, setSuccess] = useState(false);

   useEffect(() => {
      const words = seedPhrase.split(" ");
      setAllWords(words);

      // Select 4 random indices to confirm
      const indices = [];
      while (indices.length < 4) {
         const randomIndex = Math.floor(Math.random() * words.length);
         if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
         }
      }
      setConfirmIndices(indices.sort((a, b) => a - b));
   }, [seedPhrase]);

   const handleWordSelection = (word) => {
      if (selectedWords.includes(word)) {
         setSelectedWords(selectedWords.filter((w) => w !== word));
      } else if (selectedWords.length < confirmIndices.length) {
         setSelectedWords([...selectedWords, word]);
      }
   };

   const handleConfirm = async () => {
      // Check if selected words match the words at the confirmation indices
      const expectedWords = confirmIndices.map((index) => allWords[index]);

      if (selectedWords.length !== expectedWords.length) {
         setError("Please select all required words");
         return;
      }

      for (let i = 0; i < selectedWords.length; i++) {
         if (selectedWords[i] !== expectedWords[i]) {
            setError("Selected words do not match your recovery phrase");
            return;
         }
      }

      setLoading(true);

      try {
         // Load the wallet as the final step
         const result = await loadWallet(password);
         if (result.success) {
            setSuccess(true);
         } else {
            setError(result.error || "Failed to load wallet");
         }
      } catch (err) {
         setError("An unexpected error occurred");
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   if (loading) {
      return <Loading message="Completing wallet setup..." />;
   }

   if (success) {
      return (
         <Modal title="Wallet Created Successfully" showBack={false}>
            <div className="text-center">
               <div className="mx-auto mb-4 bg-green-500 rounded-full p-2 inline-block">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="h-8 w-8 text-white"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                     />
                  </svg>
               </div>
               <h3 className="text-xl font-bold text-white mb-2">
                  Congratulations!
               </h3>
               <p className="text-gray-300 mb-6">
                  Your wallet has been created successfully.
               </p>
               <Button className="w-full">Continue to Wallet</Button>
            </div>
         </Modal>
      );
   }

   return (
      <Modal title="Confirm Backup" onBack={onBack}>
         <div>
            <p className="text-gray-300 mb-4">
               Please select the words below that match the following positions
               in your recovery phrase:
            </p>

            <div className="bg-gray-800 rounded-lg p-4 mb-6">
               <div className="grid grid-cols-2 gap-2">
                  {confirmIndices.map((index, i) => (
                     <div key={i} className="flex items-center">
                        <span className="text-purple-500 font-bold mr-2">
                           #{index + 1}:
                        </span>
                        <span className="text-white">
                           {selectedWords[i] || "________"}
                        </span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
               {allWords.map((word, index) => (
                  <Button
                     key={index}
                     variant={
                        selectedWords.includes(word) ? "primary" : "outline"
                     }
                     className="py-1 px-2 text-sm"
                     onClick={() => handleWordSelection(word)}>
                     {word}
                  </Button>
               ))}
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <Button
               className="w-full"
               disabled={selectedWords.length !== confirmIndices.length}
               onClick={handleConfirm}>
               Confirm
            </Button>
         </div>
      </Modal>
   );
};

export default ConfirmBackup;
