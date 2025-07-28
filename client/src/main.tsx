import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeGlobalErrorHandler } from "@/utils/globalErrorHandler";

// Initialize global error handler to prevent console spam
initializeGlobalErrorHandler();

createRoot(document.getElementById("root")!).render(<App />);
