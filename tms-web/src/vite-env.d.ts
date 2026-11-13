/// <reference types="vite/client" />

/// <reference types="vite-plugin-svgr/client" />

declare module "*.svg?react" {
  import type { FC, SVGProps } from "react";
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_MAX_CONCURRENT?: string;
  readonly VITE_BASE_HOME_PATH: string;
  readonly VITE_BASE_Title: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
