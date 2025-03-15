import React from "react";
import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
} from "react-router-dom";
import { WalletProvider } from "./context/WalletContext.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import CreateWalletPage from "./pages/CreatePassword.jsx";
import ImportWalletPage from "./pages/ImportWalletPage";
import WalletCreated from "./pages/WalletCreatedPage/WalletCreatedPage.jsx";
import BackupPage from "./pages/BackupPage.jsx";
import VerifyBackupPage from "./pages/VerifyPage";
import WalletPage from "./pages/WalletPage/WalletPage.jsx";
import SwapComponent from "./exchangePages/swapcomponent.jsx";
import SendPage from "./pages/SendPage";
import ReceivePage from "./pages/ReceivePage";
import CreatingWalletPage from "./pages/CreatingWalletPage";
import ConnectWallet from "./pages/ConnectWallet/ConnectWallet.jsx"; // Import ConnectWallet

function App() {
   return (
      <WalletProvider>
         <Router>
            <Routes>
               <Route path="/" element={<ConnectWallet />} />
               <Route path="/home" element={<HomePage />} />{" "}
               {/* Optionally keep HomePage as an accessible route */}
               <Route path="/create" element={<CreateWalletPage />} />
               <Route path="/import" element={<ImportWalletPage />} />
               <Route
                  path="/creating-wallet"
                  element={<CreatingWalletPage />}
               />
               <Route path="/backup" element={<BackupPage />} />
               <Route path="/verify" element={<VerifyBackupPage />} />
               <Route path="/created" element={<WalletCreated />} />
               <Route path="/wallet" element={<WalletPage />} />
               <Route path="/swap" element={<SwapComponent />} />
               <Route path="/send" element={<SendPage />} />
               <Route path="/receive" element={<ReceivePage />} />
               <Route path="*" element={<Navigate to="/" />} />
            </Routes>
         </Router>
      </WalletProvider>
   );
}

export default App;
