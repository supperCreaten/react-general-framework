import { useEffect, useState, type ReactNode } from "react"
import {
  CheckCircleIcon,
  CloseCircleIcon,
  DeleteIcon,
  DownloadIcon,
  FileExcelIcon,
  UploadIcon,
} from "tdesign-icons-react"
import { Button, Upload, type UploadFile, type UploadProps } from "tdesign-react"
import { clsx } from "clsx"
import BasicDialog from "@/components/BasicDialog"
import { showMessage } from "@/utils/methods"
import "./index.css"

import type { ImportCommitResult, ImportDialogProps } from "@/interface/components"

export type { ImportCommitResult, ImportDialogProps }

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function downloadBase64File(base64: string, filename: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  downloadBlob(
    new Blob([bytes], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename,
  )
}

function StepBlock(props: {
  index: number
  title: string
  desc?: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  const { index, title, desc, required, error, children } = props
  return (
    <div className={clsx("import-dialog__step", error && "is-error")}>
      <div className="import-dialog__step-index">{index}</div>
      <div className="import-dialog__step-main">
        <div className="import-dialog__step-head">
          <div className="import-dialog__step-title">
            {title}
            {required ? <span className="import-dialog__required">*</span> : null}
          </div>
          {desc ? <div className="import-dialog__step-desc">{desc}</div> : null}
        </div>
        <div className="import-dialog__step-body">{children}</div>
        {error ? <div className="import-dialog__step-error">{error}</div> : null}
      </div>
    </div>
  )
}

/** 通用 Excel 导入弹窗：下载模板 / 校验策略 / 上传导入 / 下载错误日志 */
export default function ImportDialog(props: ImportDialogProps) {
  const { visible, title = "导入", templateFileName, onClose, downloadTemplate, importFile } = props
  const [partialCommit, setPartialCommit] = useState<boolean | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [files, setFiles] = useState<UploadFile[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [templateLoading, setTemplateLoading] = useState(false)
  const [result, setResult] = useState<ImportCommitResult | null>(null)
  const [strategyError, setStrategyError] = useState("")
  const [fileError, setFileError] = useState("")

  useEffect(() => {
    if (!visible) return
    setPartialCommit(null)
    setFile(null)
    setFiles([])
    setResult(null)
    setStrategyError("")
    setFileError("")
  }, [visible])

  const handleDownloadTemplate = async () => {
    setTemplateLoading(true)
    try {
      const blob = await downloadTemplate()
      downloadBlob(blob, templateFileName)
      showMessage("模板下载成功", "success")
    } catch {
      /* 请求层已提示 */
    } finally {
      setTemplateLoading(false)
    }
  }

  const handleDownloadErrorLog = () => {
    if (!result?.errorFileBase64) return
    downloadBase64File(result.errorFileBase64, result.errorFileName || "导入错误明细.xlsx")
  }

  const beforeUpload: UploadProps["beforeUpload"] = (uploadFile) => {
    const raw = (uploadFile as UploadFile).raw
    if (!raw) return false
    const name = raw.name.toLowerCase()
    if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
      showMessage("请上传 Excel 文件（.xlsx / .xls）", "warning")
      return false
    }
    setFile(raw)
    setFiles([{ ...uploadFile, name: raw.name, status: "success" }])
    setFileError("")
    setResult(null)
    return false
  }

  const clearFile = () => {
    setFile(null)
    setFiles([])
    setResult(null)
    setFileError("")
  }

  const validateRequired = () => {
    let valid = true
    if (partialCommit == null) {
      setStrategyError("请选择校验入库策略")
      valid = false
    } else {
      setStrategyError("")
    }
    if (!file) {
      setFileError("请上传 Excel 文件")
      valid = false
    } else {
      setFileError("")
    }
    return valid
  }

  const handleSubmit = async () => {
    if (!validateRequired()) {
      showMessage("请完善必填项后再导入", "warning")
      return
    }
    if (!file || partialCommit == null) return

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("partialCommit", String(partialCommit))
      const data = await importFile(formData)
      setResult(data)
      const imported = (data.successCount ?? 0) > 0
      if (data.message) {
        showMessage(data.message, imported && !(data.failCount ?? 0) ? "success" : imported ? "warning" : "error")
      }
      if (imported && !(data.failCount ?? 0)) {
        onClose(true)
      }
    } catch {
      /* 请求层已提示 */
    } finally {
      setSubmitting(false)
    }
  }

  const resultTone =
    (result?.failCount ?? 0) > 0 ? ((result?.successCount ?? 0) > 0 ? "warning" : "error") : "success"

  return (
    <BasicDialog
      visible={visible}
      header={title}
      width={640}
      confirmText="提交"
      confirmLoading={submitting}
      onClose={() => onClose((result?.successCount ?? 0) > 0)}
      onConfirm={() => void handleSubmit()}
    >
      <div className="import-dialog">
        <StepBlock index={1} title="下载导入模板" desc="按模板表头填写后上传，带 * 的列为必填项">
          <button
            type="button"
            className="import-dialog__template"
            disabled={templateLoading}
            onClick={() => void handleDownloadTemplate()}
          >
            <span className="import-dialog__template-icon">
              <FileExcelIcon />
            </span>
            <span className="import-dialog__template-text">
              <span className="import-dialog__template-name">{templateFileName}</span>
              <span className="import-dialog__template-tip">点击下载空白模板</span>
            </span>
            <span className="import-dialog__template-action">
              <DownloadIcon />
              {templateLoading ? "下载中..." : "下载"}
            </span>
          </button>
        </StepBlock>

        <StepBlock
          index={2}
          title="校验入库策略"
          desc="选择失败行的处理方式"
          required
          error={strategyError}
        >
          <div className="import-dialog__strategy">
            <button
              type="button"
              className={clsx("import-dialog__strategy-item", partialCommit === false && "is-active")}
              onClick={() => {
                setPartialCommit(false)
                setStrategyError("")
              }}
            >
              <span className="import-dialog__strategy-radio" />
              <span className="import-dialog__strategy-content">
                <span className="import-dialog__strategy-title">全部校验通过才入库</span>
                <span className="import-dialog__strategy-desc">任一失败则整批不入库，适合严格导入</span>
              </span>
            </button>
            <button
              type="button"
              className={clsx("import-dialog__strategy-item", partialCommit === true && "is-active")}
              onClick={() => {
                setPartialCommit(true)
                setStrategyError("")
              }}
            >
              <span className="import-dialog__strategy-radio" />
              <span className="import-dialog__strategy-content">
                <span className="import-dialog__strategy-title">部分校验通过入库</span>
                <span className="import-dialog__strategy-desc">失败行跳过，通过行入库并生成错误日志</span>
              </span>
            </button>
          </div>
        </StepBlock>

        <StepBlock index={3} title="上传 Excel 文件" desc="支持 .xlsx / .xls" required error={fileError}>
          {file ? (
            <div className="import-dialog__file">
              <span className="import-dialog__file-icon">
                <FileExcelIcon />
              </span>
              <span className="import-dialog__file-meta">
                <span className="import-dialog__file-name" title={file.name}>
                  {file.name}
                </span>
                <span className="import-dialog__file-size">{(file.size / 1024).toFixed(1)} KB</span>
              </span>
              <div className="import-dialog__file-actions">
                <button type="button" className="import-dialog__file-action" onClick={clearFile}>
                  重新选择
                </button>
                <button
                  type="button"
                  className="import-dialog__file-action import-dialog__file-action--danger"
                  onClick={clearFile}
                >
                  <DeleteIcon />
                  删除
                </button>
              </div>
            </div>
          ) : (
            <Upload
              className="import-dialog__upload"
              theme="custom"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              files={files}
              beforeUpload={beforeUpload}
              onRemove={clearFile}
              multiple={false}
              autoUpload={false}
              draggable
            >
              <div className="import-dialog__dropzone">
                <UploadIcon size="28px" />
                <div className="import-dialog__dropzone-title">点击或拖拽文件到此处</div>
                <div className="import-dialog__dropzone-tip">仅支持 Excel 文件</div>
              </div>
            </Upload>
          )}
        </StepBlock>

        {result ? (
          <div className={clsx("import-dialog__result", `is-${resultTone}`)}>
            <div className="import-dialog__result-icon">
              {resultTone === "error" ? <CloseCircleIcon /> : <CheckCircleIcon />}
            </div>
            <div className="import-dialog__result-main">
              <div className="import-dialog__result-msg">{result.message}</div>
              <div className="import-dialog__result-stats">
                <span>合计 {result.totalCount ?? 0}</span>
                <span>成功 {result.successCount ?? 0}</span>
                <span>失败 {result.failCount ?? 0}</span>
              </div>
              {result.errorFileBase64 ? (
                <Button size="small" variant="outline" icon={<DownloadIcon />} onClick={handleDownloadErrorLog}>
                  下载错误日志
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </BasicDialog>
  )
}
