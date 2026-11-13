import { createUseStyles } from "react-jss";

/** 跟随主题 CSS Variables；未选中文字优先用侧栏注入的 --app-menu-text */
const ACTIVE_COLOR = "var(--td-brand-color)";
const ACTIVE_BG = "var(--td-brand-color-light)";
const INACTIVE_COLOR = "var(--app-menu-text, var(--td-text-color-primary))";
const HOVER_BG = "color-mix(in srgb, var(--td-brand-color) 10%, transparent)";

const menuIconColorRules = {
  "& svg.app-menu-themed-icon, & .t-icon": {
    color: "inherit",
    width: 16,
    height: 16,
    fontSize: 16,
    transition: "color 0.2s ease",
  },
  "& svg.app-menu-themed-icon [fill]:not([fill='none']), & svg.app-menu-themed-icon path, & svg.app-menu-themed-icon circle, & svg.app-menu-themed-icon rect":
    {
      fill: "currentColor !important",
    },
  "& svg.app-menu-themed-icon [stroke]:not([stroke='none'])": {
    stroke: "currentColor !important",
  },
};

/**
 * 顶栏选中（参考图1）：
 * 透明底 + 主题色字/图标 + 底部短指示条
 */
const activeHorizontal = {
  position: "relative",
  color: `${ACTIVE_COLOR} !important`,
  fontWeight: 500,
  background: "transparent !important",
  boxShadow: "none !important",
  borderRadius: "0 !important",
  "&::after": {
    content: '""',
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 0,
    height: 2,
    backgroundColor: ACTIVE_COLOR,
    borderRadius: 1,
  },
  "& svg.app-menu-themed-icon, & .t-icon": {
    color: ACTIVE_COLOR,
  },
};

/**
 * 侧栏选中（参考特写）：
 * 圆角浅蓝块悬浮于侧栏内，无右侧蓝条
 */
const activeVertical = {
  color: `${ACTIVE_COLOR} !important`,
  fontWeight: 500,
  background: `${ACTIVE_BG} !important`,
  borderRadius: "8px !important",
  boxShadow: "none !important",
  "& svg.app-menu-themed-icon, & .t-icon": {
    color: ACTIVE_COLOR,
  },
};

export const useStyles = createUseStyles({
  horizontalMenu: {
    height: "100%",
    minWidth: 0,
    display: "flex",
    alignItems: "stretch",
    "& .t-head-menu": {
      height: "100%",
      width: "max-content",
      minWidth: "100%",
      background: "transparent",
      boxShadow: "none",
    },
    "& .t-head-menu__inner": {
      height: "100%",
      width: "max-content",
      minWidth: "100%",
    },
    "& .t-head-menu .t-menu": {
      height: "100%",
      width: "max-content",
      background: "transparent",
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "stretch",
      gap: 0,
      padding: "0 !important",
    },
    "& .t-head-menu .t-menu__item": {
      position: "relative",
      height: "100%",
      margin: 0,
      padding: "0 16px",
      borderRadius: 0,
      background: "transparent !important",
      color: `${INACTIVE_COLOR} !important`,
      fontWeight: 500,
      boxShadow: "none !important",
      transition: "color 0.2s ease, background-color 0.2s ease",
      gap: 8,
      flex: "0 0 auto",
      whiteSpace: "nowrap",
      ...menuIconColorRules,
      "&::after": {
        content: '""',
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 0,
        height: 2,
        backgroundColor: "transparent",
        transition: "background-color 0.2s ease",
      },
    },
    "& .t-head-menu .t-menu__item:hover:not(.t-is-active):not(.t-is-disabled)": {
      background: "transparent !important",
      color: ACTIVE_COLOR,
    },
    "& .t-head-menu .t-menu__item.t-is-active": activeHorizontal,
    "& .t-head-menu .t-submenu.t-is-active > .t-menu__item, & .t-head-menu .t-menu__item.t-is-active.t-is-opened":
      activeHorizontal,
  },
  horizontalScrollShell: {
    display: "flex",
    alignItems: "stretch",
    width: "100%",
    minWidth: 0,
    height: "100%",
    gap: 2,
  },
  horizontalScrollViewport: {
    position: "relative",
    flex: 1,
    minWidth: 0,
    height: "100%",
    overflowX: "auto",
    overflowY: "hidden",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  fadeLeft: {
    maskImage: "linear-gradient(90deg, transparent 0, #000 24px, #000 100%)",
    WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 24px, #000 100%)",
  },
  fadeRight: {
    maskImage: "linear-gradient(90deg, #000 0, #000 calc(100% - 24px), transparent 100%)",
    WebkitMaskImage: "linear-gradient(90deg, #000 0, #000 calc(100% - 24px), transparent 100%)",
  },
  fadeBoth: {
    maskImage: "linear-gradient(90deg, transparent 0, #000 24px, #000 calc(100% - 24px), transparent 100%)",
    WebkitMaskImage:
      "linear-gradient(90deg, transparent 0, #000 24px, #000 calc(100% - 24px), transparent 100%)",
  },
  scrollBtn: {
    alignSelf: "center",
    flexShrink: 0,
    width: "28px !important",
    height: "28px !important",
    color: "var(--td-text-color-secondary) !important",
    "&:hover:not(.t-is-disabled)": {
      color: `${ACTIVE_COLOR} !important`,
      background: `${HOVER_BG} !important`,
    },
  },
  verticalMenu: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    "& .t-default-menu": {
      background: "transparent",
      display: "block",
      width: "100% !important",
      maxWidth: "100%",
      padding: "8px 0 !important",
      boxSizing: "border-box",
    },
    "& .t-default-menu .t-menu, & .t-default-menu .t-menu--scroll": {
      width: "100% !important",
      maxWidth: "100%",
      padding: "0 !important",
      boxSizing: "border-box",
    },
    "& .t-default-menu .t-menu__item": {
      color: `${INACTIVE_COLOR} !important`,
      fontWeight: 500,
      margin: "4px 8px !important",
      borderRadius: 8,
      maxWidth: "calc(100% - 16px)",
      boxSizing: "border-box",
      paddingLeft: "16px !important",
      paddingRight: "16px !important",
      gap: 10,
      transition: "color 0.2s ease, background-color 0.2s ease",
      ...menuIconColorRules,
      "& svg.app-menu-themed-icon, & .t-icon": {
        ...menuIconColorRules["& svg.app-menu-themed-icon, & .t-icon"],
        width: 16,
        height: 16,
        fontSize: 16,
        marginRight: 0,
        flexShrink: 0,
      },
    },
    "& .t-default-menu .t-menu__item:hover:not(.t-is-active):not(.t-is-disabled)": {
      color: ACTIVE_COLOR,
      background: `${HOVER_BG} !important`,
      borderRadius: 8,
    },
    "& .t-default-menu .t-menu__item.t-is-active:not(.t-is-opened)": activeVertical,
    /* 展开的父级：仅主题色文字，不铺选中底（对齐双列参考） */
    "& .t-default-menu .t-menu__item.t-is-opened": {
      color: `${ACTIVE_COLOR} !important`,
      background: "transparent !important",
      fontWeight: 500,
    },
    "& .t-default-menu .t-submenu.t-is-active > .t-menu__item": {
      color: ACTIVE_COLOR,
      fontWeight: 500,
      background: "transparent !important",
    },
  },
  verticalMenuCollapsed: {
    "& .t-default-menu": {
      width: "100% !important",
      padding: "8px 0 !important",
    },
    "& .t-default-menu .t-menu__item": {
      margin: "4px 6px !important",
      paddingLeft: "0 !important",
      paddingRight: "0 !important",
      justifyContent: "center",
      gap: 0,
      maxWidth: "calc(100% - 12px)",
    },
    "& .t-default-menu .t-menu__content": {
      display: "none",
    },
    "& .t-default-menu .t-fake-arrow": {
      display: "none",
    },
  },
});

