import type { ComponentType, ReactElement } from "react";

export default function createComponent<P extends object = Record<string, never>>(
  Component: ComponentType<P>,
  props?: P,
): ReactElement {
  return <Component {...(props ?? ({} as P))} />;
}
