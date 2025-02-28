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
import BackupPage from "./pages/BackupPage.jsx";
import WalletPage from "./pages/WalletPage";
import SendPage from "./pages/SendPage";
import ReceivePage from "./pages/ReceivePage";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
   return (
      <WalletProvider>
         <Router>
            <Routes>
               <Route path="/" element={<HomePage />} />
               <Route path="/create" element={<CreateWalletPage />} />
               <Route path="/import" element={<ImportWalletPage />} />
               <Route path="/backup" element={<BackupPage />} />
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
