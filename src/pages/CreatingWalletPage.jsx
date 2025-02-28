// pages/CreatingWalletPage.jsx
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const CreatingWalletPage = () => {
   const { createWallet } = useContext(WalletContext);
   const navigate = useNavigate();

   useEffect(() => {
      // Get the password we saved in the previous page
      const password = sessionStorage.getItem("wallet-password");

      // Create the wallet (the slow part)
      const createAndNavigate = async () => {
         try {
            const success = await createWallet(password);

            sessionStorage.removeItem("wallet-password");

            if (success) {
               navigate("/backup");
            } else {
               navigate("/create", {
                  state: { error: "Failed to create wallet" },
               });
            }
         } catch (error) {
            navigate("/create", { state: { error: "Error creating wallet" } });
         }
      };

      createAndNavigate();
   }, []);

   return (
      <div className="full-background">
         <div className="o-container text-center">
            <h1 className="text-xl font-bold mb-4">Creating Your Wallet</h1>

            <div className="loader-box">
               <p className="text-base mb-8">
                  Securing your Wallet , Fetching your recovery phrase...
               </p>{" "}
               <AiOutlineLoading3Quarters className="loader animate-spin text-4xl" />
               <p className="mt-8 text-base ">This may take a few moments</p>
            </div>
         </div>
      </div>
   );
};

export default CreatingWalletPage;
