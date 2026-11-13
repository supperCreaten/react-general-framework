import type { RootState } from "@/store"
import { setPreferences } from "@/store/modules/preferences"
import { useAppDispatch } from "@/utils/methods"
import { startTransition } from "react"
import { useSelector } from "react-redux"
import { Divider, Switch } from "tdesign-react"
import { SettingRow } from "../SettingRow"

export default function UniversalSetting() {
  const dispatch = useAppDispatch()
  const { enableBackTop, watermark } = useSelector((state: RootState) => state.preferences)

  function patch(partial: Partial<RootState["preferences"]>) {
    startTransition(() => {
      dispatch(setPreferences(partial))
    })
  }

  return (
    <>
      <Divider align="center" style={{ marginTop: 0, marginBottom: 16 }}>
        通用
      </Divider>

      <SettingRow label="显示返回顶部按钮">
        <Switch value={enableBackTop} onChange={(value) => patch({ enableBackTop: value })} />
      </SettingRow>

      <SettingRow label="水印" tip="开启后在页面上显示当前登录账号作为水印，可用于版权标识或防截图溯源。">
        <Switch value={watermark} onChange={(value) => patch({ watermark: value })} />
      </SettingRow>
    </>
  )
}
