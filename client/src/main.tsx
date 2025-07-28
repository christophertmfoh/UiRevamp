import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeGlobalErrorHandler } from "@/utils/globalErrorHandler";

// Initialize global error handler to prevent console spam
initializeGlobalErrorHandler();

// Memory analysis in development (disabled to save memory)
// if (process.env.NODE_ENV === 'development') {
//   import('@/utils/memoryAnalyzer').then(({ logMemoryReport }) => {
//     // Log initial memory state
//     setTimeout(() => logMemoryReport(), 2000);
//     
//     // Log memory every 30 seconds to track growth
//     setInterval(() => logMemoryReport(), 30000);
//   });
// }

createRoot(document.getElementById("root")!).render(<App />);
