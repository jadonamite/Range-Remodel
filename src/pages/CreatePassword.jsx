// pages/CreateWalletPage.jsx

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import "./pages.css";

const CreateWalletPage = () => {
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const { createWallet } = useContext(WalletContext);
   const navigate = useNavigate();
   const [passwordMatch, setPasswordMatch] = useState(true);

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (password !== confirmPassword) {
         setPasswordMatch(false);
         return;
      }

      setPasswordMatch(true); // Reset in case it was previously false

      const success = await createWallet(password);
      if (success) {
         navigate("/backup");
      } else {
         alert("Failed to create wallet.");
      }
   };

   return (
      <div className="full-background ">
         <div className="o-container">
            <div className="text">
               <h1 className="text-xl font-bold mb-4">Create New Password</h1>
               <p className="text-sm">
                  You’ll need this to unlock your wallet and access your
                  recovery phrase
               </p>
            </div>
            <form onSubmit={handleSubmit} className="submit-form">
               <div className="space-y-4 ">
                  <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="password-input"
                     placeholder="Enter your password"
                  />

                  <input
                     type="password"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     className="password-input"
                     placeholder="Confirm your password"
                  />
                  {!passwordMatch && (
                     <p className="text-red-500 text-sm mt-1 error">
                        Passwords do not match.
                     </p>
                  )}
               </div>

               <button type="submit" className="primary-btn offset-btn">
                  Continue
               </button>
            </form>
         </div>

         <div className="TandC">
            <input type="checkbox" name="TandC" id="" />
            <p className="bottom-text">
               By continuing, I agree to the
               <span>
                  <a href="http://"> Terms of Service </a>
               </span>
               and consent to the
               <span>
                  <a href="http://"> Privacy Policy </a>
               </span>
            </p>
         </div>
      </div>
   );
};

export default CreateWalletPage;
