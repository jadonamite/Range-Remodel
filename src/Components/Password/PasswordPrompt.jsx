import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import zxcvbn from "zxcvbn";
import "./PasswordPrompt.css";

const PasswordPrompt = ({ onConnect }) => {
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const passwordStrength = zxcvbn(password);

   const handleConnectClick = async () => {
      setLoading(true);
      setError("");
      try {
         await onConnect(password);
      } catch (err) {
         setError("Incorrect password or wallet loading error.");
      } finally {
         setLoading(false);
      }
   };

   const toggleShowPassword = () => {
      setShowPassword(!showPassword);
   };

   const getPasswordStrengthColor = () => {
      switch (passwordStrength.score) {
         case 0:
            return "red";
         case 1:
            return "orange";
         case 2:
            return "yellow";
         case 3:
            return "lightgreen";
         case 4:
            return "green";
         default:
            return "gray";
      }
   };

   return (
      <div className="password-prompt-container">
         <div className="password-input-container">
            <input
               type={showPassword ? "text" : "password"}
               placeholder="Enter password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="password-input"
            />
            <button
               className="show-password-toggle"
               onClick={toggleShowPassword}>
               {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
         </div>
         <div
            className="password-strength-bar"
            style={{
               width: `${passwordStrength.score * 25}%`,
               backgroundColor: getPasswordStrengthColor(),
            }}
         />
         <button
            onClick={handleConnectClick}
            disabled={loading}
            className="connect-button">
            {loading ? (
               <AiOutlineLoading3Quarters className="loader animate-spin" />
            ) : (
               "Connect"
            )}
         </button>
         {error && <p className="error-message">{error}</p>}
      </div>
   );
};

export default PasswordPrompt;
