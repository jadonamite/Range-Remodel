import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "./pages.css";
import EyeIcon from "../Components/EyeIcon/EyeIcon";

const CreateWalletPage = () => {
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const { createWallet } = useContext(WalletContext);
   const navigate = useNavigate();
   const [passwordMatch, setPasswordMatch] = useState(true);
   const [passwordLength, setPasswordLength] = useState(true);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [termsAccepted, setTermsAccepted] = useState(false);
   const [passwordVisible, setPasswordVisible] = useState(false);
   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

   useEffect(() => {
      let timer;
      if (!passwordLength || !passwordMatch) {
         timer = setTimeout(() => {
            setPasswordLength(true);
            setPasswordMatch(true);
         }, 2000);
      }
      return () => clearTimeout(timer);
   }, [passwordLength, passwordMatch]);
   const handleGoBack = () => {
      navigate("/");
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (password.length < 8) {
         setPasswordLength(false);
         return;
      }

      if (password !== confirmPassword) {
         setPasswordMatch(false);
         return;
      }

      setLoading(true);
      try {
         const success = await createWallet(password);
         if (success) {
            navigate("/creating-wallet");
         } else {
            setError("Failed to create wallet.");
         }
      } catch (err) {
         setError(err.message || "An error occurred.");
      } finally {
         setLoading(false);
      }
   };
   const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
   };

   const toggleConfirmPasswordVisibility = () => {
      setConfirmPasswordVisible(!confirmPasswordVisible);
   };
   const handleTermsChange = (e) => {
      setTermsAccepted(e.target.checked);
   };

   return (
      <div className="full-background">
         <div className="o-container">
            <div className="text">
               <h1 className="text-xl font-bold mb-4">Create New Password</h1>
               <p className="text-sm">
                  You'll need this to unlock your wallet and access your
                  recovery phrase. Your password should be at least 8 characters
                  long.
               </p>
            </div>
            <form onSubmit={handleSubmit} className="submit-form">
               <div className="space-y-4 w-full">
                  <div className="relative password-input mx-auto">
                     <input
                        type={passwordVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="focus:outline-none"
                        placeholder="Enter your password"
                        disabled={loading}
                     />
                     <EyeIcon
                        isVisible={passwordVisible}
                        toggleVisibility={togglePasswordVisibility}
                     />
                  </div>
                  <div className="relative password-input mx-auto">
                     <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="focus:outline-none"
                        placeholder="Confirm your password"
                        disabled={loading}
                     />
                     <EyeIcon
                        isVisible={confirmPasswordVisible}
                        toggleVisibility={toggleConfirmPasswordVisibility}
                     />
                  </div>
                  {!passwordLength && (
                     <p className="text-red-500 text-sm mt-1 error">
                        Password should be at least 8 characters long.
                     </p>
                  )}
                  {!passwordMatch && (
                     <p className="text-red-500 text-sm mt-1 error">
                        Passwords do not match.
                     </p>
                  )}
                  {error && (
                     <p className="text-red-500 text-sm mt-1 error">{error}</p>
                  )}
               </div>

               <button
                  type="submit"
                  className="primary-btn offset-btn"
                  style={{
                     opacity: loading || !termsAccepted ? 0.3 : 1,
                  }}
                  disabled={loading || !termsAccepted}>
                  {loading ? (
                     <AiOutlineLoading3Quarters className="loader animate-spin" />
                  ) : (
                     "Continue"
                  )}
               </button>
            </form>
            <button
               onClick={handleGoBack}
               className="secondary-btn w-full mt-2">
               Back
            </button>{" "}
         </div>

         <div className="TandC">
            <input
               type="checkbox"
               name="TandC"
               id=""
               onChange={handleTermsChange}
               checked={termsAccepted}
            />
            <p className="bottom-text">
               By continuing, I agree to the
               <span>
                  <a href="/terms"> Terms of Service </a>
               </span>
               and consent to the
               <span>
                  <a href="/privacy"> Privacy Policy </a>
               </span>
            </p>
         </div>
      </div>
   );
};

export default CreateWalletPage;
