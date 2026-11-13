import type { ReactNode } from "react";
import { Children, isValidElement } from "react"
type SlotProps = { children?: ReactNode }
export function findSlot(children: ReactNode, slotName: string): ReactNode {
  const slot = Children.toArray(children).find((child) => {
    if (!isValidElement<SlotProps>(child)) return false
    const type = child.type as { displayName?: string }
    return type?.displayName === slotName
  })

  return isValidElement<SlotProps>(slot) ? slot.props.children : null
}
