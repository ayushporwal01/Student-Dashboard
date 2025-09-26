import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AttendanceProvider } from "./contexts/attendance-context.jsx";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AttendanceProvider>
        <App />
        <Toaster />
      </AttendanceProvider>
    </BrowserRouter>
  </React.StrictMode>
);