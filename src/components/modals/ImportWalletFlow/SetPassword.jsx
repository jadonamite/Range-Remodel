import React, { useState, useEffect } from "react";
import Modal from "../../common/Modal";
import Input from "../../common/Input";
import Button from "../../common/Button";
import { useWallet } from "../../../context/WalletContext";

const SetPassword = ({ onBack, seedPhrase, privateKey, importType }) => {
   const { importWallet, importWalletByPrivateKey } = useWallet();
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [error, setError] = useState("");
   const [passwordValid, setPasswordValid] = useState(false);
   const [confirmValid, setConfirmValid] = useState(false);

   useEffect(() => {
      // Validate password (min 8 characters)
      if (password.length >= 8) {
         setPasswordValid(true);
      } else {
         setPasswordValid(false);
      }
      // Validate confirm password matches
      if (password === confirmPassword && password.length >= 8) {
         setConfirmValid(true);
      } else {
         setConfirmValid(false);
      }
   }, [password, confirmPassword]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!passwordValid) {
         setError("Password must be at least 8 characters.");
         return;
      }
      if (!confirmValid) {
         setError("Passwords do not match.");
         return;
      }
      setError("");
      let result;
      if (importType === "seedPhrase") {
         result = await importWallet(seedPhrase, password);
      } else {
         result = await importWalletByPrivateKey(privateKey, password);
      }
      if (!result.success) {
         setError(result.error || "Failed to import wallet.");
      }
      // If successful, the context will trigger navigation to dashboard.
   };

   return (
      <Modal title="Set Password" onBack={onBack}>
         <form onSubmit={handleSubmit}>
            <p className="text-gray-300 mb-6">
               Create and confirm a password to secure your imported wallet.
            </p>
            <Input
               label="Password"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Enter password (min 8 characters)"
               showPasswordToggle={true}
               valid={passwordValid}
            />
            <Input
               label="Confirm Password"
               type="password"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               placeholder="Confirm your password"
               showPasswordToggle={true}
               valid={confirmValid}
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button
               className="w-full mt-4"
               disabled={!passwordValid || !confirmValid}>
               Import Wallet
            </Button>
         </form>
      </Modal>
   );
};

export default SetPassword;
