import { createUseStyles } from "react-jss";

/** 标签栏样式（TDesign Tag），颜色跟随主题 token */
export const useStyles = createUseStyles({
  tabsContainer: {
    position: "relative",
    backgroundColor: "var(--td-bg-color-container)",
    borderTop: "1px solid var(--td-component-border)",
    borderBottom: "1px solid var(--td-component-border)",
  },
  resetTabs: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
    margin: 0,
    padding: "6px 10px",
    overflowX: "auto",
  },
  chrome: {
    padding: "6px 10px 4px",
  },
  tagWrap: {
    display: "inline-flex",
    flexShrink: 0,
    cursor: "pointer",
  },
  tabTag: {
    cursor: "pointer",
    userSelect: "none",
  },
  tabTagActive: {
    fontWeight: 600,
  },
  contextMenu: {
    position: "fixed",
    zIndex: 50,
    minWidth: 144,
    padding: "4px 0",
    border: "1px solid var(--td-component-border)",
    borderRadius: 6,
    background: "var(--td-bg-color-container)",
    boxShadow: "var(--td-shadow-2)",
    color: "var(--td-text-color-primary)",
  },
  contextMenuItem: {
    display: "block",
    width: "100%",
    padding: "6px 12px",
    border: 0,
    background: "transparent",
    color: "var(--td-text-color-primary)",
    cursor: "pointer",
    fontSize: 13,
    textAlign: "left",
    "&:hover": {
      background: "var(--td-bg-color-container-hover)",
    },
  },
  contextMenuItemDisabled: {
    color: "var(--td-text-color-disabled)",
    cursor: "not-allowed",
    "&:hover": {
      background: "transparent",
    },
  },
});
