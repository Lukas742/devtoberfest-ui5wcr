import { ThemeProvider } from "@ui5/webcomponents-react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@ui5/webcomponents-react/dist/Assets";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
