import "tdesign-react/es/_util/react-19-adapter";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "@/store";
import "tdesign-react/es/style/index.css";
import "./styles/index.css";
import { HashRouter } from "react-router-dom";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    const base = import.meta.env.BASE_URL || "./";
    const swUrl = `${base.endsWith("/") ? base : `${base}/`}sw.js`;
    navigator.serviceWorker.register(swUrl).catch(() => {
      /* 注册失败不影响主流程 */
    });
  });
}

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error('Root element "#root" not found');
}

createRoot(rootEl).render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
);
