import React, { useState, useEffect } from "react";
import { useWallet } from "../../../context/WalletContext";
import Modal from "../../common/Modal";
import Button from "../../common/Button";
import Loading from "../../common/Loading";

const BackupSeedPhrase = ({ password, onBack, onNext }) => {
   const { createWallet } = useWallet();
   const [seedPhrase, setSeedPhrase] = useState("");
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   useEffect(() => {
      const generateWallet = async () => {
         try {
            setLoading(true);
            const result = await createWallet(password);
            if (result.success) {
               setSeedPhrase(result.mnemonic);
            } else {
               setError(result.error || "Failed to create wallet");
            }
         } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
         } finally {
            setLoading(false);
         }
      };

      generateWallet();
   }, [createWallet, password]);

   const handleCopyToClipboard = () => {
      navigator.clipboard.writeText(seedPhrase);
      alert("Seed phrase copied to clipboard!");
   };

   if (loading) {
      return <Loading message="Generating your wallet..." />;
   }

   if (error) {
      return (
         <Modal title="Error" onBack={onBack}>
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={onBack} className="w-full">
               Go Back
            </Button>
         </Modal>
      );
   }

   const seedWords = seedPhrase.split(" ");

   return (
      <Modal title="Backup Recovery Phrase" onBack={onBack}>
         <div>
            <p className="text-gray-300 mb-4">
               This is your wallet recovery phrase. Write it down and store it
               in a safe place. You'll need this to recover your wallet if you
               forget your password.
            </p>

            <div className="bg-gray-800 rounded-lg p-4 mb-6">
               <div className="grid grid-cols-3 gap-2">
                  {seedWords.map((word, index) => (
                     <div key={index} className="flex items-center">
                        <span className="text-gray-500 text-sm mr-2">
                           {index + 1}.
                        </span>
                        <span className="text-white">{word}</span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="flex flex-col space-y-4">
               <Button variant="outline" onClick={handleCopyToClipboard}>
                  Copy to Clipboard
               </Button>

               <Button onClick={() => onNext(seedPhrase)}>
                  I've Backed Up My Recovery Phrase
               </Button>
            </div>
         </div>
      </Modal>
   );
};

export default BackupSeedPhrase;
