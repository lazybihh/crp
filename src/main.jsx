// main.jsx - starts the React app and loads the global styles.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/theme.css";
import "./styles/global.css";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SiteSettingsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SiteSettingsProvider>
  </StrictMode>
);
