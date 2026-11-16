import CreateComponent from "@/components/CreateComponent";
import { MENU_TYPE } from "@/constants/menu";
import { createIconifyIcon } from "@/icons";
import type { MenuInfo, MenuItemType } from "@/interface";

/**
 * 是否为目录菜单。
 * 目录只负责分组展开子项，路由生成时不注册自身 path（避免出现无页面的 `/system`）。
 */
export function isDirectoryMenu(menuType?: number) {
  return menuType === MENU_TYPE.DIRECTORY;
}

/**
 * 递归查找第一个子菜单路径下的最深层级的第一个菜单项
 *
 * @param splitSideNavItems 菜单列表
 * @returns 找到的最深层级的第一个菜单项
 */
export function findDeepestFirstItem(splitSideNavItems: MenuItemType[]): MenuItemType | null {
  if (!splitSideNavItems || splitSideNavItems.length === 0) {
    return null;
  }
  // 只取未隐藏项；全部隐藏时返回 null，由调用方回退到父菜单自身（避免跳到隐藏页面）
  const currentItem = splitSideNavItems.find((v) => !v?.hidden);
  if (!currentItem) {
    return null;
  }
  const children = currentItem.children ?? [];
  const firstVisibleChild = children.find((v) => !v?.hidden);

  // children 中无未隐藏项时，返回当前项本身
  if (!firstVisibleChild) {
    return currentItem;
  }

  // 存在未隐藏子项时，继续在子菜单中向下查找
  return findDeepestFirstItem(children);
}
/**
 * 获取菜单项的父级键
 *
 * @param menuItems 菜单项数组
 * @returns 返回记录每个菜单项键对应的父级键数组的对象
 */
export function getParentKeys(menuItems: MenuItemType[]): Record<string, string[]> {
  const parentKeyMap: Record<string, string[]> = {};

  function traverse(items: MenuItemType[], parentKeys: string[] = []) {
    for (const item of items) {
      // 记录当前 key 的父级 key 数组
      parentKeyMap[item.key] = [...parentKeys];

      // 如果有子节点，递归遍历
      if (Array.isArray(item.children) && item.children.length) {
        traverse(item.children, [...parentKeys, item.key]);
      }
    }
  }
  traverse(menuItems);
  return parentKeyMap;
}
/**
 * @zh 菜单 key 为完整路径（如 /system/menu/list），子路由 path 必须用相对段，否则以 / 开头会被 RR6 当成绝对路径，匹配不到嵌套子级而一直渲染父级组件。
 */
function toRootRoutePath(fullKey: string): string {
  const s = fullKey.trim().replace(/\/+$/, "");
  return s.startsWith("/") ? s.slice(1) : s;
}
/**
 * 根据后端返回菜单树生成菜单项数组
 *
 * @param routeList 路由列表，类型为 AppRouteRecordRaw 数组
 * @returns 返回菜单项数组，数组元素类型为 MenuItemType
 */
export const generateMenuItemsFromMenuTree = (
  data: MenuInfo[] = [],
  parentPath: string = "",
  currentLevel: number = 1,
): MenuItemType[] | undefined => {
  if (!data?.length) return;
  return data.map((item) => {
    const key = parentPath ? `${parentPath}/${item.path}` : `/${item.path}`;
    const component = key + "/index";
    const temp: MenuItemType = {
      label: item.meta?.title,
      component,
      meta: item.meta,
      level: currentLevel,
      hidden: item.hidden,
      // 透传后端数字类型，供路由按目录/菜单决定是否挂自身页
      menuType: item.menuType,
      children: undefined,
      key,
      path: toRootRoutePath(item?.path),
    };
    // 若当前菜单项包含子菜单，则递归处理子菜单并赋值，层级 +1
    if (item?.children?.length) {
      temp.children = generateMenuItemsFromMenuTree(item.children, key, currentLevel + 1);
    }
    return temp;
  });
};
/**
 * 通过路径查找根菜单
 *
 * @param menus 菜单列表
 * @param path 菜单路径，可选
 * @returns 包含查找到的菜单、根菜单和根菜单路径的对象
 */
export function findRootMenuByPath(
  menus: MenuItemType[],
  path?: string,
): {
  findMenu: MenuItemType | null;
  rootMenu: MenuItemType | null;
  rootMenuPath: string | null;
} {
  // 初始化返回值
  let findMenu: MenuItemType | null = null;
  let rootMenu: MenuItemType | null = null;
  let rootMenuPath: string | null = null;

  // 如果没有提供路径，返回默认值
  if (!path) {
    return {
      findMenu: null,
      rootMenu: null,
      rootMenuPath: null,
    };
  }

  // 递归查找函数
  const find = (
    list: MenuItemType[],
    targetPath: string,
    parents: MenuItemType[] = [],
  ): boolean => {
    for (const menu of list) {
      // 如果找到目标菜单
      if (menu.key === targetPath) {
        findMenu = menu;
        // 如果没有父级菜单，说明当前菜单就是根菜单
        if (parents.length === 0) {
          rootMenu = menu;
          rootMenuPath = menu.key;
        } else {
          // 获取最顶层的父级菜单
          rootMenu = parents[0];
          rootMenuPath = parents[0].key;
        }
        return true;
      }

      // 如果有子菜单，继续递归查找
      if (menu.children && menu.children.length > 0) {
        // 将当前菜单加入父级菜单数组
        const found = find(menu.children, targetPath, [...parents, menu]);
        if (found) {
          return true;
        }
      }
    }
    return false;
  };

  // 开始查找
  find(menus, path);

  return {
    findMenu,
    rootMenu,
    rootMenuPath,
  };
}
export function addMenuIcon(data: MenuItemType[]): MenuItemType[] | undefined {
  const menuList = data?.filter((v) => !v.hidden) || [];
  if (!menuList?.length) return;
  return menuList?.map((item) => {
    const temp: MenuItemType & { icon: React.ReactNode } = { ...item, icon: null };
    temp.icon = CreateComponent(createIconifyIcon(`svg:${item.meta?.icon}`));
    if (item.children?.length) {
      temp.children = addMenuIcon(item.children);
    }
    return temp;
  });
}
export function getPathToMenuTitle(menuList: MenuItemType[], url: string): string | undefined {
  if (!menuList.length) return;
  return menuList.reduce((pre, cur) => {
    if (cur.key === url) {
      pre = cur.label as string;
    } else {
      const childTitle = getPathToMenuTitle(cur.children || [], url);
      if (childTitle) {
        pre = childTitle;
      }
    }
    return pre;
  }, "");
}
