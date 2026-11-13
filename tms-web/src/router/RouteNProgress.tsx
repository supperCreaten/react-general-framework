import type { RootState } from "@/store";
import { cancelPendingRequestsOnRouteChange } from "@/utils/service";
import { NProgress } from "@/utils/progress";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

/**
 * 路由进度条：跳转时 start，路由落地后 done
 */
export default function RouteNProgress() {
  const { pathname, search } = useLocation();
  const transitionProgress = useSelector(
    (state: RootState) => state.preferences.transitionProgress,
  );
  const cancelPrevRef = useRef<string | null>(null);
  const progressPathRef = useRef<string | null>(null);

  /** 路径变化时取消在途请求（与进度条解耦） */
  useEffect(() => {
    const key = pathname + search;
    if (cancelPrevRef.current === null) {
      cancelPrevRef.current = key;
      return;
    }
    if (cancelPrevRef.current === key) return;
    cancelPrevRef.current = key;
    cancelPendingRequestsOnRouteChange();
  }, [pathname, search]);

  /** 路由开始变化时 start */
  useLayoutEffect(() => {
    const prev = progressPathRef.current;
    const pathChanged = prev !== null && prev !== pathname;
    progressPathRef.current = pathname;

    if (!transitionProgress) return;
    // 首屏或路由跳转都触发进度条
    if (prev === null || pathChanged) {
      NProgress.start();
    }
  }, [pathname, transitionProgress]);

  /** 路由落地后 done */
  useEffect(() => {
    if (!transitionProgress) {
      NProgress.done();
      return;
    }
    NProgress.done();
  }, [pathname, transitionProgress]);

  return null;
}
