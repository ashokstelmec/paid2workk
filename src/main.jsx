import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/authContext";
import { CollapseProvider } from "./contexts/collapseContext";
import { ToggleDrawerProvider } from "./contexts/drawerContext";
import { SupportProvider } from "./contexts/supportContext";
import { ChatProvider } from "./contexts/chatContext";
import { ToastContainer } from "react-toastify";
import { CookiesProvider } from "react-cookie";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <ChatProvider>
          <AuthProvider>
            <SupportProvider>
              <CollapseProvider>
                <ToggleDrawerProvider>
                  <App />
                  <ToastContainer style={{ marginTop: "6rem" }} />
                </ToggleDrawerProvider>
              </CollapseProvider>
            </SupportProvider>
          </AuthProvider>
        </ChatProvider>
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
