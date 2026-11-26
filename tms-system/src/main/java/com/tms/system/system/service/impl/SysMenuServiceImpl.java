package com.tms.system.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tms.common.constant.UserConstants;
import com.tms.common.core.domain.TreeSelect;
import com.tms.system.system.domain.vo.SysMenuVo;
import com.tms.system.system.domain.vo.SysRoleVo;
import com.tms.common.core.text.Convert;
import com.tms.common.exception.ServiceException;
import com.tms.common.utils.PageUtils;
import com.tms.common.utils.SecurityUtils;
import com.tms.common.utils.StringUtils;
import com.tms.system.system.domain.dto.SysMenuQuery;
import com.tms.system.system.domain.dto.SysMenuSaveReq;
import com.tms.system.system.domain.vo.AuthMenuVo;
import com.tms.system.system.mapper.SysMenuMapper;
import com.tms.system.system.mapper.SysRoleMapper;
import com.tms.system.system.mapper.SysRoleMenuMapper;
import com.tms.system.system.service.ISysMenuService;

/**
 * 菜单 业务层处理
 *
 * @author tms
 */
@Service
public class SysMenuServiceImpl implements ISysMenuService {
    private static final Logger log = LoggerFactory.getLogger(SysMenuServiceImpl.class);


    public static final Long MENU_ROOT_ID = 0L;

    @Autowired
    private SysMenuMapper menuMapper;

    @Autowired
    private SysRoleMapper roleMapper;

    @Autowired
    private SysRoleMenuMapper roleMenuMapper;

    /**
     * 根据用户查询系统菜单列表
     *
     * @param userId 用户ID
     * @return 菜单列表
     */
    @Override
    public List<SysMenuVo> selectMenuList(Long userId) {
        return selectMenuList(new SysMenuQuery(), userId);
    }

    /**
     * 查询系统菜单列表
     */
    @Override
    public List<SysMenuVo> selectMenuList(SysMenuQuery query, Long userId) {
        SysMenuQuery menu = query == null ? new SysMenuQuery() : query;
        List<SysMenuVo> menuList;
        if (SecurityUtils.isAdmin(userId)) {
            menuList = menuMapper.selectMenuList(menu);
        } else {
            menu.getParams().put("userId", userId);
            menuList = menuMapper.selectMenuListByUserId(menu);
        }
        return menuList;
    }

    /**
     * 菜单管理列表
     */
    @Override
    public List<SysMenuVo> selectMenuManageList(SysMenuQuery query, Long userId) {
        SysMenuQuery menu = query == null ? new SysMenuQuery() : query;
        boolean lazy = Boolean.TRUE.equals(menu.getLazy());
        if (lazy && menu.getParentId() == null) {
            menu.setParentId(MENU_ROOT_ID);
        }
        List<SysMenuVo> menus = selectMenuList(menu, userId);
        if (lazy) {
            return menus;
        }
        return buildMenuTree(menus);
    }

    /**
     * 查询所有菜单列表
     *
     * @return 菜单列表
     */
    @Override
    public List<SysMenuVo> selectAllMenuList() {
        List<SysMenuVo> menus = menuMapper.selectMenuAllList();
        return getChildPerms(menus, MENU_ROOT_ID);
    }

    /**
     * 根据用户ID查询权限
     *
     * @param userId 用户ID
     * @return 权限列表
     */
    @Override
    public Set<String> selectMenuPermsByUserId(Long userId) {
        List<String> perms = menuMapper.selectMenuPermsByUserId(userId);
        Set<String> permsSet = new HashSet<>();
        for (String perm : perms) {
            if (StringUtils.isNotEmpty(perm)) {
                permsSet.addAll(Arrays.asList(perm.trim().split(",")));
            }
        }
        return permsSet;
    }

    /**
     * 根据角色ID查询权限
     *
     * @param roleId 角色ID
     * @return 权限列表
     */
    @Override
    public Set<String> selectMenuPermsByRoleId(Long roleId) {
        List<String> perms = menuMapper.selectMenuPermsByRoleId(roleId);
        Set<String> permsSet = new HashSet<>();
        for (String perm : perms) {
            if (StringUtils.isNotEmpty(perm)) {
                permsSet.addAll(Arrays.asList(perm.trim().split(",")));
            }
        }
        return permsSet;
    }

    /**
     * 根据用户ID查询菜单
     *
     * @param userId 用户名称
     * @return 菜单列表
     */
    @Override
    public List<SysMenuVo> selectMenuTreeByUserId(Long userId) {
        // 路由树必须全量查询；清理可能残留的 PageHelper 分页（默认 pageSize=10 会只查出前 10 个顶级目录）
        PageUtils.clearPage();
        List<SysMenuVo> menus;
        if (SecurityUtils.isAdmin(userId)) {
            menus = menuMapper.selectMenuTreeAll();
        } else {
            menus = menuMapper.selectMenuTreeByUserId(userId);
        }
        return getChildPerms(menus, MENU_ROOT_ID);
    }

    /**
     * 根据角色ID查询菜单树信息
     *
     * @param roleId 角色ID
     * @return 选中菜单列表
     */
    @Override
    public List<Long> selectMenuListByRoleId(Long roleId) {
        SysRoleVo role = roleMapper.selectRoleById(roleId);
        return menuMapper.selectMenuListByRoleId(roleId, role.isMenuCheckStrictly());
    }

    /**
     * 构建授权路由（字段不变；顺序 menuId、menuName … children，对齐若依展示习惯）
     */
    @Override
    public List<AuthMenuVo> buildAuthRoutes(List<SysMenuVo> menus) {
        List<AuthMenuVo> result = new ArrayList<>();
        if (menus == null || menus.isEmpty()) {
            return result;
        }
        for (SysMenuVo menu : menus) {
            // 按钮不参与前端路由
            if (UserConstants.TYPE_BUTTON.equals(menu.getMenuType())) {
                continue;
            }
            AuthMenuVo node = new AuthMenuVo();
            node.setMenuId(menu.getMenuId());
            node.setPath(menu.getPath());
            node.setHidden("1".equals(String.valueOf(menu.getVisible())));
            node.setMenuType(parseMenuType(menu.getMenuType()));
            node.setMenuName(menu.getMenuName());
            node.setComponent(resolveAuthComponent(menu));
            // is_cache: 0=缓存 → keepAlive=1；与 Node keep_alive 一致
            int keepAlive = "0".equals(menu.getIsCache()) ? 1 : 0;
            node.setMeta(AuthMenuVo.buildMeta(menu.getMenuName(), menu.getIcon(), keepAlive));
            List<SysMenuVo> childMenus = menu.getChildren();
            if (StringUtils.isNotEmpty(childMenus)) {
                List<AuthMenuVo> children = buildAuthRoutes(childMenus);
                node.setChildren(children.isEmpty() ? null : children);
            } else {
                node.setChildren(null);
            }
            result.add(node);
        }
        return result;
    }

    private Integer parseMenuType(String menuType) {
        if (StringUtils.isEmpty(menuType)) {
            return 0;
        }
        try {
            return Integer.parseInt(menuType);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /**
     * 对齐 server resolveMenuComponent
     */
    private String resolveAuthComponent(SysMenuVo menu) {
        if (StringUtils.isNotEmpty(menu.getComponent())) {
            return menu.getComponent();
        }
        if (UserConstants.TYPE_DIR.equals(menu.getMenuType())) {
            long parentId = menu.getParentId() == null ? 0L : menu.getParentId();
            return parentId == 0L ? UserConstants.LAYOUT : UserConstants.PARENT_VIEW;
        }
        return null;
    }

    /**
     * 构建前端所需要树结构
     *
     * @param menus 菜单列表
     * @return 树结构列表
     */
    @Override
    public List<SysMenuVo> buildMenuTree(List<SysMenuVo> menus) {
        List<SysMenuVo> returnList = new ArrayList<>();
        List<Long> tempList = menus.stream().map(SysMenuVo::getMenuId).toList();
        for (SysMenuVo menu : menus) {
            // 如果是顶级节点, 遍历该父节点的所有子节点
            if (!tempList.contains(menu.getParentId())) {
                recursionFn(menus, menu);
                returnList.add(menu);
            }
        }
        if (returnList.isEmpty()) {
            returnList = menus;
        }
        return returnList;
    }

    /**
     * 构建前端所需要下拉树结构
     *
     * @param menus 菜单列表
     * @return 下拉树结构列表
     */
    @Override
    public List<TreeSelect> buildMenuTreeSelect(List<SysMenuVo> menus) {
        List<SysMenuVo> menuTrees = buildMenuTree(menus);
        return menuTrees.stream().map(this::toTreeSelect).collect(Collectors.toList());
    }

    /** 菜单节点转为树选择结构，并递归子节点 */
    private TreeSelect toTreeSelect(SysMenuVo menu) {
        TreeSelect node = new TreeSelect();
        node.setId(menu.getMenuId());
        node.setLabel(menu.getMenuName());
        List<SysMenuVo> children = menu.getChildren();
        if (children != null && !children.isEmpty()) {
            node.setChildren(children.stream().map(this::toTreeSelect).collect(Collectors.toList()));
        }
        return node;
    }

    /**
     * 根据菜单ID查询信息
     *
     * @param menuId 菜单ID
     * @return 菜单信息
     */
    @Override
    public SysMenuVo selectMenuById(Long menuId) {
        return menuMapper.selectMenuById(menuId);
    }

    /**
     * 菜单详情
     */
    @Override
    public SysMenuVo selectMenuVoById(Long menuId) {
        return selectMenuById(menuId);
    }

    /**
     * 是否存在菜单子节点
     *
     * @param menuId 菜单ID
     * @return 结果
     */
    @Override
    public boolean hasChildByMenuId(Long menuId) {
        int result = menuMapper.hasChildByMenuId(menuId);
        return result > 0;
    }

    /**
     * 查询菜单使用数量
     *
     * @param menuId 菜单ID
     * @return 结果
     */
    @Override
    public boolean checkMenuExistRole(Long menuId) {
        int result = roleMenuMapper.checkMenuExistRole(menuId);
        return result > 0;
    }

    /**
     * 新增保存菜单信息
     *
     * @param menu 菜单保存参数
     * @return 结果
     */
    @Override
    public int insertMenu(SysMenuSaveReq menu) {
        return menuMapper.insertMenu(menu);
    }

    /**
     * 修改保存菜单信息
     *
     * @param menu 菜单信息
     * @return 结果
     */
    @Override
    public int updateMenu(SysMenuVo menu) {
        SysMenuSaveReq req = new SysMenuSaveReq();
        req.setMenuId(menu.getMenuId());
        req.setParentId(menu.getParentId());
        req.setMenuType(menu.getMenuType());
        req.setIcon(menu.getIcon());
        req.setMenuName(menu.getMenuName());
        req.setOrderNum(menu.getOrderNum());
        req.setIsFrame(menu.getIsFrame());
        req.setPath(menu.getPath());
        req.setPerms(menu.getPerms());
        req.setIsCache(menu.getIsCache());
        req.setVisible(menu.getVisible());
        req.setStatus(menu.getStatus());
        req.setCreateBy(menu.getCreateBy());
        req.setUpdateBy(menu.getUpdateBy());
        req.setRemark(menu.getRemark());
        return updateMenu(req);
    }

    /**
     * 修改保存菜单信息
     */
    @Override
    public int updateMenu(SysMenuSaveReq menu) {
        if (menu.getOrderNum() == null) {
            menu.setOrderNum(0);
        }
        if (StringUtils.isEmpty(menu.getIsFrame())) {
            menu.setIsFrame("1");
        }
        return menuMapper.updateMenu(menu);
    }

    /**
     * 保存菜单排序
     *
     * @param menuIds   菜单ID
     * @param orderNums 排序ID
     */
    @Override
    @Transactional
    public void updateMenuSort(String[] menuIds, String[] orderNums) {
        try {
            for (int i = 0; i < menuIds.length; i++) {
                SysMenuSaveReq menu = new SysMenuSaveReq();
                menu.setMenuId(Convert.toLong(menuIds[i]));
                menu.setOrderNum(Convert.toInt(orderNums[i]));
                menuMapper.updateMenuSort(menu);
            }
        } catch (Exception e) {
            throw new ServiceException("保存排序异常，请联系管理员");
        }
    }

    /**
     * 删除菜单管理信息
     *
     * @param menuId 菜单ID
     * @return 结果
     */
    @Override
    public int deleteMenuById(Long menuId) {
        return menuMapper.deleteMenuById(menuId);
    }

    /**
     * 校验菜单名称是否唯一
     *
     * @param menu 菜单信息
     * @return 结果
     */
    @Override
    public boolean checkMenuNameUnique(SysMenuVo menu) {
        long menuId = StringUtils.isNull(menu.getMenuId()) ? -1L : menu.getMenuId();
        SysMenuVo info = menuMapper.checkMenuNameUnique(menu.getMenuName(), menu.getParentId());
        if (StringUtils.isNotNull(info) && info.getMenuId() != menuId) {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    /**
     * 校验菜单名称是否唯一
     */
    @Override
    public boolean checkMenuNameUnique(SysMenuSaveReq menu) {
        long menuId = StringUtils.isNull(menu.getMenuId()) ? -1L : menu.getMenuId();
        SysMenuVo info = menuMapper.checkMenuNameUnique(menu.getMenuName(), menu.getParentId());
        if (StringUtils.isNotNull(info) && info.getMenuId() != menuId) {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    /**
     * 校验路由名称是否唯一
     *
     * @param menu 菜单信息
     * @return 结果
     */
    @Override
    public boolean checkRouteConfigUnique(SysMenuVo menu) {
        String path = menu.getPath();
        String routeName = StringUtils.isEmpty(menu.getRouteName()) ? path : menu.getRouteName();
        return isRouteConfigUnique(menu.getMenuId(), menu.getParentId(), path, routeName);
    }

    private boolean isRouteConfigUnique(Long menuIdValue, Long parentId, String path, String routeName) {
        long menuId = StringUtils.isNull(menuIdValue) ? -1L : menuIdValue;
        List<SysMenuVo> sysMenuList = menuMapper.selectMenusByPathOrRouteName(path, routeName);
        for (SysMenuVo sysMenu : sysMenuList) {
            if (sysMenu.getMenuId() != menuId) {
                Long dbParentId = sysMenu.getParentId();
                String dbPath = sysMenu.getPath();
                if (StringUtils.equalsAnyIgnoreCase(path, dbPath) && parentId.longValue() == dbParentId.longValue()) {
                    log.warn("[同级路由冲突] 同级下已存在相同路由路径 '{}'，冲突菜单：{}", dbPath, sysMenu.getMenuName());
                    return UserConstants.NOT_UNIQUE;
                } else if (StringUtils.equalsAnyIgnoreCase(path, dbPath) && parentId.longValue() == MENU_ROOT_ID) {
                    log.warn("[根目录路由冲突] 根目录下路由 '{}' 必须唯一，已被菜单 '{}' 占用", path, sysMenu.getMenuName());
                    return UserConstants.NOT_UNIQUE;
                }
            }
        }
        return UserConstants.UNIQUE;
    }

    /**
     * 校验路由组合是否唯一
     */
    @Override
    public boolean checkRouteConfigUnique(SysMenuSaveReq menu) {
        return isRouteConfigUnique(menu.getMenuId(), menu.getParentId(), menu.getPath(), menu.getPath());
    }

    /**
     * 根据父节点的ID获取所有子节点
     *
     * @param list     分类表
     * @param parentId 传入的父节点ID
     * @return String
     */
    public List<SysMenuVo> getChildPerms(List<SysMenuVo> list, long parentId) {
        List<SysMenuVo> returnList = new ArrayList<>();
        for (SysMenuVo t : list) {
            // 一、根据传入的某个父节点ID,遍历该父节点的所有子节点
            if (t.getParentId() == parentId) {
                recursionFn(list, t);
                returnList.add(t);
            }
        }
        return returnList;
    }

    /**
     * 递归列表
     *
     * @param list 分类表
     * @param t    子节点
     */
    private void recursionFn(List<SysMenuVo> list, SysMenuVo t) {
        // 得到子节点列表
        List<SysMenuVo> childList = getChildList(list, t);
        t.setChildren(childList.isEmpty() ? null : childList);
        for (SysMenuVo tChild : childList) {
            if (hasChild(list, tChild)) {
                recursionFn(list, tChild);
            }
            else {
                tChild.setChildren(null);
            }
        }
    }

    /**
     * 得到子节点列表
     */
    private List<SysMenuVo> getChildList(List<SysMenuVo> list, SysMenuVo t) {
        List<SysMenuVo> tlist = new ArrayList<>();
        for (SysMenuVo n : list) {
            if (n.getParentId().longValue() == t.getMenuId().longValue()) {
                tlist.add(n);
            }
        }
        return tlist;
    }

    /**
     * 判断是否有子节点
     */
    private boolean hasChild(List<SysMenuVo> list, SysMenuVo t) {
        return !getChildList(list, t).isEmpty();
    }
}
