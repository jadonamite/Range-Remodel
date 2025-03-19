import React from "react";
import { useWallet } from "./context/WalletContext";
import SetupWizard from "./pages/SetupWizard";
import Dashboard from "./components/Dashboard";

const App = () => {
   const { isConnected } = useWallet();

   return <>{isConnected ? <Dashboard /> : <SetupWizard />}</>;
};

export default App;

// For Observation Purposes

// import React from "react";
// import {
//    BrowserRouter as Router,
//    Routes,
//    Route,
//    Navigate,
// } from "react-router-dom";
// import { WalletProvider } from "./context/WalletContext.jsx";
// import WalletPage from "./pages/WalletPage/WalletPage.jsx";
// import Exchange from "./ExchangeComponent/Exchange.jsx";
// import SwapBridgeApp from "./pages/RSwap/RSwap.jsx";
// import AnimatedNavigation from "./pages/Explore.jsx";

// function App() {
//    return (
//       <WalletProvider>
//          <Router>
//             <Routes>
//                <Route path="/" element={<Navigate to="/wallet" />} />
//                <Route path="/created" element={<WalletCreated />} />
//                <Route path="/wallet" element={<WalletPage />} />
//                <Route path="/exchange" element={<Exchange />} />
//                <Route path="/explore" element={<AnimatedNavigation />} />
//                <Route path="/rswap" element={<SwapBridgeApp />} />
//                <Route path="/send" element={<SendPage />} />
//                <Route path="/receive" element={<ReceivePage />} />
//                <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//          </Router>
//       </WalletProvider>
//    );
// }

// export default App;
