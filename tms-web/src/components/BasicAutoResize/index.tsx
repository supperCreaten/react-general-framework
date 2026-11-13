import type { ReactElement } from "react"
import { useRef } from "react"

export default function BasicAutoResize(props: {
  children: ReactElement
  offSet?: number
}) {
  const { children } = props
  const currentRef = useRef(null)
  return <div ref={currentRef}>{children}</div>
}
