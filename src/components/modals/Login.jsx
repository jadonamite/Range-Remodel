// src/components/modals/Login.jsx
import React, { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { useWallet } from "../../context/WalletContext";

const Login = ({ onBack }) => {
   const { loadWallet } = useWallet();
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");

   const handleLogin = async (e) => {
      e.preventDefault();
      if (!password.trim()) {
         setError("Password is required.");
         return;
      }
      setError("");
      const result = await loadWallet(password);
      if (!result.success) {
         setError(
            result.error ||
               "Failed to decrypt wallet. Please try again or import your wallet."
         );
      }
      // Successful login will trigger navigation to dashboard via context update.
   };

   return (
      <Modal title="Unlock Wallet" onBack={onBack}>
         <form onSubmit={handleLogin}>
            <p className="text-gray-300 mb-4">
               Enter your password to access your wallet.
            </p>
            <Input
               label="Password"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Enter your password"
               showPasswordToggle={true}
               error={error}
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button className="w-full" type="submit">
               Unlock Wallet
            </Button>
         </form>
      </Modal>
   );
};

export default Login;
