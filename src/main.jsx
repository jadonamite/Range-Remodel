import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { WalletProvider } from "./context/WalletContext";
import "./styles/App.css"; // your custom external CSS
import "./index.css"; // Tailwind base (if needed)

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <QueryClientProvider client={queryClient}>
         <WalletProvider>
            <App />
         </WalletProvider>
      </QueryClientProvider>
   </StrictMode>
);
