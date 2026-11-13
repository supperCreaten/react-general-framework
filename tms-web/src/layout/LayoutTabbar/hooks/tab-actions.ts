export const TabActionKeys = {
  REFRESH: "refresh",
  CLOSE: "close",
  CLOSE_RIGHT: "closeRight",
  CLOSE_LEFT: "closeLeft",
  CLOSE_OTHERS: "closeOthers",
  CLOSE_ALL: "closeAll",
} as const;

export type TabActionKey = (typeof TabActionKeys)[keyof typeof TabActionKeys];

export type TabMenuItem = {
  key: string;
  label: string;
  disabled?: boolean;
};
