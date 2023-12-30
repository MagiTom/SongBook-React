import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { SonglistProvider } from "./context/SongListContext";
import { TransposeProvider } from "./context/TransposeContext";
import { SongsDbProvider } from "./context/firebaseContext";
import { ErrorProvider } from "./context/ErrorContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorProvider>
        <SongsDbProvider>
          <TransposeProvider>
            <SonglistProvider>
              <App />
            </SonglistProvider>
          </TransposeProvider>
        </SongsDbProvider>
      </ErrorProvider>
    </BrowserRouter>
  </React.StrictMode>
);
