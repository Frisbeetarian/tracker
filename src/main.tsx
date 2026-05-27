import { StrictMode } from "react";
import { ViteReactSSG } from "vite-react-ssg/single-page";
import "./index.css";
import App from "./App.tsx";

// vite-react-ssg prerenders this to static HTML at build time and hydrates
// it on the client, so crawlers see real content in the initial HTML.
export const createRoot = ViteReactSSG(
  <StrictMode>
    <App />
  </StrictMode>,
);
