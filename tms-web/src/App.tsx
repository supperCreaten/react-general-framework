import { useEffect } from "react";
import Router from "./router";
import { hideLoading } from "@/plugins/hide-loading";
import { useTheme } from "@/hooks/use-theme";

export default function App() {
  useTheme();

  useEffect(() => {
    // 登录等白名单页不会挂 LoadingScreen，需在应用挂载后关闭 index.html 首屏 loading
    hideLoading();
  }, []);

  return <Router />;
}
