import logo from "@/assets/svg/logo.svg?url";

import { clsx } from "clsx";
import { useNavigate } from "react-router-dom";

import type { LogoProps } from "@/interface";
import { headerHeight } from "../../constants";

export type { LogoProps } from "@/interface";

/**
 * @zh 高度 48px
 * @en The height is 48px
 */
export function Logo({ sidebarCollapsed, className }: LogoProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{ height: headerHeight }}
      className={clsx("flex items-center justify-center gap-2 cursor-pointer", className)}
      onClick={() => navigate(import.meta.env.VITE_BASE_HOME_PATH)}
    >
      <img src={logo} alt="logo" width={32} height={32} />

      <h1
        className={clsx(
          "m-0 max-w-40 truncate text-sm font-semibold text-[var(--app-menu-text,var(--td-text-color-primary))]",
          {
            hidden: sidebarCollapsed,
          },
        )}
      >
        {import.meta.env.VITE_GLOB_APP_TITLE}
      </h1>
    </div>
  );
}
