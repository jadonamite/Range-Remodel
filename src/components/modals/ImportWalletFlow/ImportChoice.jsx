// src/components/modals/ImportWalletFlow/ImportChoice.jsx
import React from "react";
import Modal from "../../common/Modal";
import Button from "../../common/Button";

const ImportChoice = ({ onBack, onChooseSeedPhrase, onChoosePrivateKey }) => {
   return (
      <Modal title="Import Wallet" onBack={onBack}>
         <p className="text-gray-300 mb-6">
            Choose how you’d like to import your wallet.
         </p>
         <div className="flex flex-col space-y-4">
            <Button onClick={onChooseSeedPhrase}>Import via Seed Phrase</Button>
            <Button variant="secondary" onClick={onChoosePrivateKey}>
               Import via Private Key
            </Button>
         </div>
      </Modal>
   );
};

export default ImportChoice;
