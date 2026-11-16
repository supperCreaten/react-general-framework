import { useState, type MouseEvent, type ReactNode } from "react"
import { Button, Dialog, type DialogProps } from "tdesign-react"
import { clsx } from "clsx"
import "./index.css"

export type BasicDialogProps = Omit<DialogProps, "onConfirm"> & {
  /** 异步确认；传入后由组件管理 loading（可用 confirmLoading 覆盖展示） */
  onSubmit?: () => void | Promise<void>
  onConfirm?: DialogProps["onConfirm"]
  confirmText?: string
  cancelText?: string
}

function renderHeader(header: DialogProps["header"]): ReactNode {
  if (header === false || header == null) return false
  if (header === true) return true
  if (typeof header === "string" || typeof header === "number") {
    return (
      <div className="basic-dialog__header-inner">
        <span className="basic-dialog__title">{header}</span>
      </div>
    )
  }
  return <div className="basic-dialog__header-inner">{header as ReactNode}</div>
}

export default function BasicDialog(props: BasicDialogProps) {
  const {
    visible,
    header,
    children,
    footer,
    onClose,
    onSubmit,
    onConfirm,
    confirmLoading: confirmLoadingProp,
    confirmText = "确认",
    cancelText = "取消",
    dialogClassName,
    destroyOnClose = true,
    placement = "center",
    closeOnEscKeydown = false,
    closeOnOverlayClick = false,
    ...rest
  } = props

  const [innerLoading, setInnerLoading] = useState(false)
  const confirmLoading = confirmLoadingProp ?? (onSubmit ? innerLoading : undefined)

  const handleConfirm = async (e: MouseEvent<HTMLElement>) => {
    if (onSubmit) {
      setInnerLoading(true)
      try {
        await onSubmit()
      } finally {
        setInnerLoading(false)
      }
      return
    }
    await onConfirm?.({ e: e as MouseEvent<HTMLButtonElement> })
  }

  const handleCancel = (e: MouseEvent<HTMLElement>) => {
    onClose?.({ e: e as unknown as MouseEvent<HTMLDivElement>, trigger: "cancel" })
  }

  const resolvedFooter: DialogProps["footer"] =
    footer === false
      ? false
      : footer !== undefined && footer !== true
        ? <div className="basic-dialog__footer-inner">{footer as ReactNode}</div>
        : (
          <div className="basic-dialog__footer-inner">
            <Button variant="outline" onClick={handleCancel}>
              {cancelText}
            </Button>
            <Button theme="primary" loading={Boolean(confirmLoading)} onClick={(e) => void handleConfirm(e)}>
              {confirmText}
            </Button>
          </div>
        )

  return (
    <Dialog
      {...rest}
      visible={visible}
      header={renderHeader(header)}
      footer={resolvedFooter}
      dialogClassName={clsx("basic-dialog", dialogClassName)}
      destroyOnClose={destroyOnClose}
      placement={placement}
      draggable
      closeOnEscKeydown={closeOnEscKeydown}
      closeOnOverlayClick={closeOnOverlayClick}
      confirmBtn={null}
      cancelBtn={null}
      onClose={onClose}
    >
      <div className="basic-dialog__body-inner">{children}</div>
    </Dialog>
  )
}
