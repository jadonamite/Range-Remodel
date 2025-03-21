import React, { useState, useEffect } from "react";
import Modal from "../../common/Modal";
import Input from "../../common/Input";
import Button from "../../common/Button";

const CreatePassword = ({ onBack, onNext }) => {
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [error, setError] = useState("");
   const [passwordValid, setPasswordValid] = useState(false);
   const [confirmValid, setConfirmValid] = useState(false);

   useEffect(() => {
      // Check password validity
      if (password.length >= 8) {
         setPasswordValid(true);
      } else {
         setPasswordValid(false);
      }

      // Check confirmation validity
      if (password === confirmPassword && password.length >= 8) {
         setConfirmValid(true);
      } else {
         setConfirmValid(false);
      }
   }, [password, confirmPassword]);

   const handleSubmit = (e) => {
      e.preventDefault();

      if (password.length < 8) {
         setError("Password must be at least 8 characters long");
         return;
      }

      if (password !== confirmPassword) {
         setError("Passwords do not match");
         return;
      }

      onNext(password);
   };

   return (
      <Modal title="Create Password" onBack={onBack}>
         <form onSubmit={handleSubmit}>
            <p className="text-gray-300 mb-6">
               Create a strong password to secure your wallet. You'll need this
               password to access your wallet.
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
               Continue
            </Button>
         </form>
      </Modal>
   );
};

export default CreatePassword;
