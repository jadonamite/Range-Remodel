import React, { useState } from "react";

const SwapBridgeApp = () => {
   const [] = useState("ETH");
   const [] = useState("USDT");
   const [] = useState("");
   const [] = useState("");

   const [] = useState("Ethereum");
   const [] = useState("ETH");
   const [] = useState("Binance Smart Chain");
   const [] = useState("BNB");
   const [] = useState("");
   const [] = useState("");

   const handleSwap = () => {
      // Placeholder logic for swap calculation
      const rate = 1500; // Example rate
      const estimated = parseFloat(swapAmount) * rate;
      setEstimatedSwapAmount(isNaN(estimated) ? "" : estimated.toFixed(2));
      alert(
         `Swapping ${swapAmount} ${fromSwapToken} to ${estimated} ${toSwapToken}`
      );
   };

   const handleBridge = () => {
      // Placeholder logic for bridge calculation (including fees)
      const rate = 1; // Example rate
      const fee = 0.01; // 1% fee
      const estimated = parseFloat(bridgeAmount) * rate * (1 - fee);
      setEstimatedBridgeAmount(isNaN(estimated) ? "" : estimated.toFixed(2));
      alert(
         `Bridging ${bridgeAmount} ${fromBridgeToken} from ${fromBridgeNetwork} to ${estimated} ${toBridgeToken} on ${toBridgeNetwork}`
      );
   };

   const containerStyle = {
      fontFamily: "Arial, sans-serif",
      background: "#121212", // Dark background
      color: "#f0f0f0", // Light text
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
   };

   const headerStyle = {
      textAlign: "center",
      marginBottom: "30px",
   };

   const navigationStyle = {
      display: "flex",
      gap: "20px",
      marginBottom: "20px",
   };

   const navItemStyle = {
      color: "#64ffda", // Bright accent color
      textDecoration: "none",
      fontSize: "1.2em",
      fontWeight: "bold",
   };

   const sectionStyle = {
      background: "#1e1e1e", // Slightly lighter dark background
      padding: "30px",
      borderRadius: "15px",
      marginBottom: "30px",
      width: "80%",
      maxWidth: "600px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
   };

   const titleStyle = {
      color: "#f0f0f0",
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "1.5em",
   };

   const inputGroupStyle = {
      marginBottom: "20px",
   };

   const labelStyle = {
      display: "block",
      color: "#9e9e9e",
      marginBottom: "5px",
   };

   const inputStyle = {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #424242",
      background: "#2c2c2c",
      color: "#f0f0f0",
      fontSize: "1em",
      boxSizing: "border-box",
   };

   const selectStyle = {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #424242",
      background: "#2c2c2c",
      color: "#f0f0f0",
      fontSize: "1em",
      boxSizing: "border-box",
   };

   const buttonStyle = {
      background: "#64ffda", // Bright accent color
      color: "#121212",
      padding: "15px 30px",
      borderRadius: "10px",
      border: "none",
      fontSize: "1.1em",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
   };

   const buttonHoverStyle = {
      backgroundColor: "#45a29e", // Slightly darker accent color on hover
   };

   const estimatedStyle = {
      marginTop: "10px",
      color: "#64ffda",
      fontSize: "1.1em",
   };

   const footerStyle = {
      marginTop: "50px",
      textAlign: "center",
      color: "#9e9e9e",
   };

   return (
      <div style={containerStyle}>
         <header style={headerStyle}>
            <h1
               style={{
                  color: "#64ffda",
                  fontSize: "2.5em",
                  marginBottom: "10px",
               }}>
               Decentralized Hub
            </h1>
            <nav style={navigationStyle}>
               <a href="#swap" style={navItemStyle}>
                  Swap
               </a>
               <a href="#bridge" style={navItemStyle}>
                  Bridge
               </a>
            </nav>
         </header>

         <section id="swap" style={sectionStyle}>
            <h2 style={titleStyle}>Swap Tokens</h2>
            <div style={inputGroupStyle}>
               <label style={labelStyle}>From Token</label>
               <select
                  value={fromSwapToken}
                  onChange={(e) => setFromSwapToken(e.target.value)}
                  style={selectStyle}>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">Tether (USDT)</option>
                  {/* Add more tokens as needed */}
               </select>
            </div>
            <div style={inputGroupStyle}>
               <label style={labelStyle}>To Token</label>
               <select
                  value={toSwapToken}
                  onChange={(e) => setToSwapToken(e.target.value)}
                  style={selectStyle}>
                  <option value="USDT">Tether (USDT)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  {/* Add more tokens as needed */}
               </select>
            </div>
            <div style={inputGroupStyle}>
               <label style={labelStyle}>Amount</label>
               <input
                  type="number"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  style={inputStyle}
               />
            </div>
            <button
               onClick={handleSwap}
               style={buttonStyle}
               onMouseOver={(e) =>
                  Object.assign(e.target.style, buttonHoverStyle)
               }
               onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}>
               Swap
            </button>
            {estimatedSwapAmount && (
               <p style={estimatedStyle}>
                  Estimated: {estimatedSwapAmount} {toSwapToken}
               </p>
            )}
         </section>

         <section id="bridge" style={sectionStyle}>
            <h2 style={titleStyle}>Bridge Tokens</h2>
            <div style={inputGroupStyle}>
               <label style={labelStyle}>From Network</label>
               <select
                  value={fromBridgeNetwork}
                  onChange={(e) => setFromBridgeNetwork(e.target.value)}
                  style={selectStyle}>
                  <option value="Ethereum">Ethereum</option>
                  <option value="Binance Smart Chain">
                     Binance Smart Chain
                  </option>
                  {/* Add more networks as needed */}
               </select>
            </div>
            <div style={inputGroupStyle}>
               <label style={labelStyle}>From Token</label>
               <select
                  value={fromBridgeToken}
                  onChange={(e) => setFromBridgeToken(e.target.value)}
                  style={selectStyle}>
                  <option value="ETH">ETH</option>
                  <option value="BNB">BNB</option>
                  {/* Add more tokens as needed */}
               </select>
            </div>
            <div style={inputGroupStyle}>
               <label style={labelStyle}>To Network</label>
               <select
                  value={toBridgeNetwork}
                  onChange={(e) => setToBridgeNetwork(e.target.value)}
                  style={selectStyle}>
                  <option value="Binance Smart Chain">
                     Binance Smart Chain
                  </option>
                  <option value="Ethereum">Ethereum</option>
                  {/* Add more networks as needed */}
               </select>
            </div>
            <div style={inputGroupStyle}>
               <label style={labelStyle}>To Token</label>
               <select
                  value={toBridgeToken}
                  onChange={(e) => setToBridgeToken(e.target.value)}
                  style={selectStyle}>
                  <option value="BNB">BNB</option>
                  <option value="ETH">ETH</option>
                  {/* Add more tokens as needed */}
               </select>
            </div>
            <div style={inputGroupStyle}>
               <label style={labelStyle}>Amount</label>
               <input
                  type="number"
                  value={bridgeAmount}
                  onChange={(e) => setBridgeAmount(e.target.value)}
                  style={inputStyle}
               />
            </div>
            <button
               onClick={handleBridge}
               style={buttonStyle}
               onMouseOver={(e) =>
                  Object.assign(e.target.style, buttonHoverStyle)
               }
               onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}>
               Bridge
            </button>
            {estimatedBridgeAmount && (
               <p style={estimatedStyle}>
                  Estimated: {estimatedBridgeAmount} {toBridgeToken}
               </p>
            )}
         </section>

         <footer style={footerStyle}>
            <p>
               &copy; {new Date().getFullYear()} Decentralized Hub. All rights
               reserved.
            </p>
         </footer>
      </div>
   );
};

export default SwapBridgeApp;
