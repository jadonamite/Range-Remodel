// src/components/modals/ImportWalletFlow/ImportPrivateKey.jsx
import React, { useState } from "react";
import Modal from "../../common/Modal";
import Input from "../../common/Input";
import Button from "../../common/Button";

const ImportPrivateKey = ({ onBack, onNext }) => {
   const [privateKey, setPrivateKey] = useState("");
   const [error, setError] = useState("");

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!privateKey.trim()) {
         setError("Private key is required.");
         return;
      }
      // Basic validation could be added here (e.g. length check)
      onNext(privateKey.trim());
   };

   return (
      <Modal title="Import via Private Key" onBack={onBack}>
         <form onSubmit={handleSubmit}>
            <p className="text-gray-300 mb-4">
               Enter your wallet’s private key. Ensure you keep it secure.
            </p>
            <Input
               label="Private Key"
               type="text"
               value={privateKey}
               onChange={(e) => setPrivateKey(e.target.value)}
               placeholder="Enter private key"
               error={error}
            />
            <Button className="w-full mt-4" type="submit">
               Next
            </Button>
         </form>
      </Modal>
   );
};

export default ImportPrivateKey;
