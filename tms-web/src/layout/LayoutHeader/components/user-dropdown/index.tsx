import type { RootState } from "@/store";
import { userLogout } from "@/store/modules/user";
import { resolvePublicUrl } from "@/utils/image";
import { useAppDispatch } from "@/utils/methods";
import { ChevronDownIcon, LogoutIcon, UserIcon } from "tdesign-icons-react";
import { Avatar, DialogPlugin, Dropdown, type DropdownProps } from "tdesign-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PROFILE_PATH = "/personal-center/my-profile";

function pickDisplayName(userInfo: Record<string, unknown>) {
  const candidates = [userInfo.nickName, userInfo.userName, userInfo.realName, userInfo.name];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "用户";
}

export default function UserDropdown() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const fallbackAvatar = useSelector((state: RootState) => state.user.avatar);

  const displayName = useMemo(() => pickDisplayName(userInfo), [userInfo]);
  const avatarUrl =
    resolvePublicUrl(userInfo.avatar) || resolvePublicUrl(fallbackAvatar) || fallbackAvatar;

  const options = useMemo<NonNullable<DropdownProps["options"]>>(
    () => [
      {
        content: "个人中心",
        value: "profile",
        prefixIcon: <UserIcon />,
        divider: true,
      },
      {
        content: "退出登录",
        value: "logout",
        theme: "error",
        prefixIcon: <LogoutIcon />,
      },
    ],
    [],
  );

  const handleLogout = () => {
    const dialog = DialogPlugin.confirm({
      header: "退出登录",
      body: "确认退出当前账号吗？",
      confirmBtn: "退出",
      cancelBtn: "取消",
      theme: "warning",
      onConfirm: async () => {
        dialog.setConfirmLoading(true);
        try {
          await dispatch(userLogout());
        } finally {
          dialog.setConfirmLoading(false);
          dialog.hide();
          dialog.destroy();
        }
      },
      onClose: () => {
        dialog.hide();
        dialog.destroy();
      },
    });
  };

  const onClick: DropdownProps["onClick"] = (dropdownItem) => {
    if (dropdownItem.value === "profile") {
      navigate(PROFILE_PATH);
      return;
    }
    if (dropdownItem.value === "logout") {
      handleLogout();
    }
  };

  return (
    <Dropdown
      trigger="click"
      placement="bottom-right"
      minColumnWidth={148}
      options={options}
      onClick={onClick}
    >
      <button
        type="button"
        className="inline-flex max-w-44 items-center gap-2 rounded-full border-0 bg-transparent px-1 py-0.5 text-left cursor-pointer hover:bg-black/5"
      >
        <Avatar image={avatarUrl} alt={displayName} size="32px">
          {displayName.slice(0, 1)}
        </Avatar>
        <span className="hidden max-w-24 truncate text-sm text-slate-700 md:inline">{displayName}</span>
        <ChevronDownIcon size={14} className="text-slate-400" />
      </button>
    </Dropdown>
  );
}
