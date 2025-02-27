import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import backgroundImage from "./assets/DesktopBackground.png"; // Make sure this path is correct
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <App />
   </StrictMode>
);
