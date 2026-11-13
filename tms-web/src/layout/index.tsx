import { useMemo } from "react";
import LayoutMenu from "./LayoutMenu";
import { cn } from "@/utils/methods";
import LayoutHeader from "./LayoutHeader";
import { Logo } from "./components/logo";
import useMenu from "@/hooks/use-menu";
import { useLayout } from "@/hooks/use-layout";
import { useDeviceType } from "@/hooks/use-device-type";
import { usePreferences } from "@/hooks/use-preferences";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import LayoutSidebar from "./LayoutSidebar";
import LayoutContent from "./LayoutContent";
import LayoutTabbar from "./LayoutTabbar";
import LayoutMixedSidebar from "./layoutMixedSidebar";
import LayoutMobileMenu from "./layoutMobileMenu";
import { BackTop, Watermark } from "tdesign-react";

export default function LayoutContainer() {
  const { topNavItems, sideNavItems, wholeMenus, sideNavMenuKeyInSplitMode, handleMenuSelect } =
    useMenu();
  const {
    isTopNav,
    isMixedNav,
    isTwoColumnNav,
    firstColumnWidthInTwoColumnNavigation,
    sideCollapsedWidth,
    sidebarWidth,
  } = useLayout();
  const { isMobile } = useDeviceType();
  const {
    sidebarEnable,
    sidebarCollapsed,
    tabbarEnable,
    watermark,
    enableBackTop,
    isDark,
  } = usePreferences();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const watermarkText = useMemo(() => {
    const candidates = [userInfo.account, userInfo.userName, userInfo.nickName];
    for (const value of candidates) {
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "tms";
  }, [userInfo]);
  const watermarkContent = useMemo(
    () => ({
      text: watermarkText,
      fontSize: 14,
      fontColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
    }),
    [watermarkText, isDark],
  );
  const sidebarEnableState = useMemo(() => !isTopNav && sidebarEnable, [isTopNav, sidebarEnable]);
  const computedSidebarWidth = useMemo(() => {
    if (isMobile) {
      return 0;
    }
    const currentSidebarWidth = sidebarCollapsed ? sideCollapsedWidth : sidebarWidth;
    if (isTwoColumnNav) {
      /* 双列导航，第一列默认宽度 */
      return currentSidebarWidth + (firstColumnWidthInTwoColumnNavigation ?? 0);
    }
    if (sidebarEnableState) {
      return currentSidebarWidth;
    }
    return 0;
  }, [
    isMobile,
    isTwoColumnNav,
    sidebarEnableState,
    sidebarWidth,
    sidebarCollapsed,
    sideCollapsedWidth,
    firstColumnWidthInTwoColumnNavigation,
  ]);

  const layoutBody = (
    <>
      {sidebarEnableState && !isTwoColumnNav && !isMobile && sideNavItems?.length ? (
        <LayoutSidebar computedSidebarWidth={computedSidebarWidth}>
          <LayoutMenu
            autoExpandCurrentMenu
            menus={sideNavItems}
            handleMenuSelect={handleMenuSelect}
            wholeMenus={wholeMenus}
          />
        </LayoutSidebar>
      ) : null}
      {sidebarEnableState && !isTopNav ? <LayoutMobileMenu /> : null}
      <section
        style={{
          paddingLeft: computedSidebarWidth,
        }}
        className={cn(
          "layout-main-section transition-[padding-left] flex h-full min-h-0 flex-col overflow-hidden",
        )}
      >
        <LayoutHeader>
          {(isTopNav || isMixedNav) && topNavItems?.length ? (
            <>
              {isTopNav ? <Logo sidebarCollapsed={false} className="mr-4 shrink-0" /> : null}
              <LayoutMenu
                mode="horizontal"
                menus={topNavItems}
                handleMenuSelect={handleMenuSelect}
              />
            </>
          ) : null}
        </LayoutHeader>
        {tabbarEnable ? <LayoutTabbar /> : null}
        {isTwoColumnNav ? (
          <LayoutMixedSidebar
            sideNavMenuKeyInSplitMode={sideNavMenuKeyInSplitMode}
            computedSidebarWidth={computedSidebarWidth}
            sideNavItems={sideNavItems}
            topNavItems={topNavItems}
            handleMenuSelect={handleMenuSelect}
          />
        ) : null}
        <LayoutContent />
      </section>
    </>
  );

  const body = <div className="h-full min-h-0">{layoutBody}</div>;

  return (
    <div className="h-full min-h-0 overflow-hidden">
      {watermark ? (
        <Watermark
          className="block h-full min-h-0"
          watermarkContent={watermarkContent}
          width={140}
          height={64}
          x={100}
          y={80}
          rotate={-22}
          zIndex={60}
          removable={false}
        >
          {body}
        </Watermark>
      ) : (
        body
      )}
      {enableBackTop ? <BackTop visibleHeight={240} /> : null}
    </div>
  );
}
