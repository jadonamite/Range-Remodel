import React, { useState, useEffect } from "react";
import { WalletProvider, useWallet } from "./context/WalletContext";
import Layout from "./components/layout/Layout";
import CreatePassword from "./components/modals/CreateWalletFlow/CreatePassword";
import BackupSeedPhrase from "./components/modals/CreateWalletFlow/BackupSeedPhrase";
import ConfirmBackup from "./components/modals/CreateWalletFlow/ConfirmBackup";
import ImportChoice from "./components/modals/ImportWalletFlow/ImportChoice";
import ImportSeedPhrase from "./components/modals/ImportWalletFlow/ImportSeedPhrase";
import ImportPrivateKey from "./components/modals/ImportWalletFlow/ImportPrivateKey";
import SetPassword from "./components/modals/ImportWalletFlow/SetPassword";
import Login from "./components/modals/Login";
import Dashboard from "./components/wallet/Dashboard";
import Loading from "./components/common/Loading";
import "./styles/global.css";

const AppContent = () => {
   const { isConnected, loading } = useWallet();
   const [currentScreen, setCurrentScreen] = useState("welcome");
   const [tempData, setTempData] = useState({});

   useEffect(() => {
      const checkForExistingWallet = () => {
         const walletData = localStorage.getItem("scrollWallet");
         if (walletData) {
            setCurrentScreen("login");
         }
      };

      checkForExistingWallet();
   }, []);

   useEffect(() => {
      if (isConnected) {
         setCurrentScreen("dashboard");
      }
   }, [isConnected]);

   const handleCreateWallet = () => {
      setCurrentScreen("createPassword");
   };

   const handleImportWallet = () => {
      setCurrentScreen("importChoice");
   };

   const handleBack = () => {
      switch (currentScreen) {
         case "createPassword":
         case "importChoice":
            setCurrentScreen("welcome");
            break;
         case "backupSeedPhrase":
            setCurrentScreen("createPassword");
            break;
         case "confirmBackup":
            setCurrentScreen("backupSeedPhrase");
            break;
         case "importSeedPhrase":
         case "importPrivateKey":
            setCurrentScreen("importChoice");
            break;
         case "setPassword":
            if (tempData.importType === "seedPhrase") {
               setCurrentScreen("importSeedPhrase");
            } else {
               setCurrentScreen("importPrivateKey");
            }
            break;
         case "login":
            setCurrentScreen("welcome");
            break;
         default:
            setCurrentScreen("welcome");
      }
   };

   const renderScreen = () => {
      if (loading.wallet) {
         return <Loading message="Processing wallet operation..." />;
      }

      switch (currentScreen) {
         case "welcome":
            return (
               <div className="full-background">
                  <div className="o-container py-8">
                     <div className="text-center mb-8">
                        <img
                           src="/logo.png"
                           alt="Range Wallet"
                           className="mx-auto w-24 h-24"
                        />
                        <h1 className="text-2xl font-bold text-white mt-4">
                           Connect to your Wallet
                        </h1>
                        <p className="text-gray-300 mt-2">
                           Connect an existing wallet or create a new one.
                        </p>
                     </div>
                     <div className="flex flex-col space-y-4 mt-12">
                        <button
                           className="py-3 px-6 rounded-full bg-gradient-to-r from-purple-500 to-teal-400 text-white font-medium"
                           onClick={handleCreateWallet}>
                           Create Wallet
                        </button>
                        <button
                           className="py-3 px-6 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 text-white font-medium"
                           onClick={handleImportWallet}>
                           Import Existing Wallet
                        </button>
                     </div>
                  </div>
               </div>
            );
         case "createPassword":
            return (
               <CreatePassword
                  onBack={handleBack}
                  onNext={(password) => {
                     setTempData({ ...tempData, password });
                     setCurrentScreen("backupSeedPhrase");
                  }}
               />
            );
         case "backupSeedPhrase":
            return (
               <BackupSeedPhrase
                  password={tempData.password}
                  onBack={handleBack}
                  onNext={(seedPhrase) => {
                     setTempData({ ...tempData, seedPhrase });
                     setCurrentScreen("confirmBackup");
                  }}
               />
            );
         case "confirmBackup":
            return (
               <ConfirmBackup
                  seedPhrase={tempData.seedPhrase}
                  password={tempData.password}
                  onBack={handleBack}
               />
            );
         case "importChoice":
            return (
               <ImportChoice
                  onBack={handleBack}
                  onChooseSeedPhrase={() => {
                     setTempData({ ...tempData, importType: "seedPhrase" });
                     setCurrentScreen("importSeedPhrase");
                  }}
                  onChoosePrivateKey={() => {
                     setTempData({ ...tempData, importType: "privateKey" });
                     setCurrentScreen("importPrivateKey");
                  }}
               />
            );
         case "importSeedPhrase":
            return (
               <ImportSeedPhrase
                  onBack={handleBack}
                  onNext={(seedPhrase) => {
                     setTempData({ ...tempData, seedPhrase });
                     setCurrentScreen("setPassword");
                  }}
               />
            );
         case "importPrivateKey":
            return (
               <ImportPrivateKey
                  onBack={handleBack}
                  onNext={(privateKey) => {
                     setTempData({ ...tempData, privateKey });
                     setCurrentScreen("setPassword");
                  }}
               />
            );
         case "setPassword":
            return (
               <SetPassword
                  onBack={handleBack}
                  seedPhrase={tempData.seedPhrase}
                  privateKey={tempData.privateKey}
                  importType={tempData.importType}
               />
            );
         case "login":
            return <Login onBack={handleBack} />;
         case "dashboard":
            return <Dashboard />;
         default:
            return <div>Unknown screen</div>;
      }
   };

   return <Layout>{renderScreen()}</Layout>;
};

const App = () => {
   return (
      <WalletProvider>
         <AppContent />
      </WalletProvider>
   );
};

export default App;
