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
import WalletCreated from "./pages/WalletCreatedPage";
import BackupPage from "./pages/BackupPage.jsx";
import VerifyBackupPage from "./pages/VerifyPage";
import WalletPage from "./pages/WalletPage/WalletPage.jsx";
import SendPage from "./pages/SendPage";
import ReceivePage from "./pages/ReceivePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreatingWalletPage from "./pages/CreatingWalletPage";

function App() {
   return (
      <WalletProvider>
         <Router>
            <Routes>
               <Route path="/" element={<HomePage />} />
               <Route path="/create" element={<CreateWalletPage />} />
               <Route path="/import" element={<ImportWalletPage />} />
               <Route
                  path="/creating-wallet"
                  element={<CreatingWalletPage />}
               />
               ;<Route path="/backup" element={<BackupPage />} />
               <Route path="/verify" element={<VerifyBackupPage />} />
               <Route path="/created" element={<WalletCreated />} />
               <Route path="/wallet" element={<WalletPage />} />
               <Route path="/send" element={<SendPage />} />
               <Route path="/receive" element={<ReceivePage />} />
               <Route path="*" element={<Navigate to="/" />} />
            </Routes>
         </Router>
      </WalletProvider>
   );
}

export default App;
