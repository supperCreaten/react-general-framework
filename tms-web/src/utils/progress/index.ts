import NProgress from "nprogress";
import "nprogress/nprogress.css";

/** 顶部路由切换进度条（NProgress 全局单例，已配置动画参数） */
NProgress.configure({
  easing: "ease",
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3,
});

export { NProgress };
