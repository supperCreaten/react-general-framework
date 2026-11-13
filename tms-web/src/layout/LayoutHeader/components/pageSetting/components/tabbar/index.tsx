import type { TabsStyleType } from "@/interface"
import type { RootState } from "@/store"
import { setPreferences } from "@/store/modules/preferences"
import { useAppDispatch } from "@/utils/methods"
import { startTransition } from "react"
import { useSelector } from "react-redux"
import { Divider, Select, Switch } from "tdesign-react"
import { SettingRow } from "../SettingRow"

const TAB_STYLE_OPTIONS: Array<{ label: string; value: TabsStyleType }> = [
  { label: "谷歌", value: "chrome" },
  { label: "卡片", value: "card" },
  { label: "灵动", value: "brisk" },
  { label: "朴素", value: "plain" },
]

export default function TabbarSetting() {
  const dispatch = useAppDispatch()
  const { tabbarEnable, tabbarPersist, tabbarDraggable, tabbarShowIcon, tabbarStyleType } =
    useSelector((state: RootState) => state.preferences)

  function patch(partial: Partial<RootState["preferences"]>) {
    startTransition(() => {
      dispatch(setPreferences(partial))
    })
  }

  return (
    <>
      <Divider align="center" style={{ marginTop: 16, marginBottom: 16 }}>
        标签栏
      </Divider>

      <SettingRow label="启用标签栏">
        <Switch value={tabbarEnable} onChange={(value) => patch({ tabbarEnable: value })} />
      </SettingRow>

      <SettingRow label="持久化标签页" tip="刷新页面后尽量恢复已打开的标签。">
        <Switch
          value={tabbarPersist}
          disabled={!tabbarEnable}
          onChange={(value) => patch({ tabbarPersist: value })}
        />
      </SettingRow>

      <SettingRow label="启动拖拽排序">
        <Switch
          value={tabbarDraggable}
          disabled={!tabbarEnable}
          onChange={(value) => patch({ tabbarDraggable: value })}
        />
      </SettingRow>

      <SettingRow label="显示标签栏图标">
        <Switch
          value={tabbarShowIcon}
          disabled={!tabbarEnable}
          onChange={(value) => patch({ tabbarShowIcon: value })}
        />
      </SettingRow>

      <SettingRow label="标签页风格">
        <Select
          value={tabbarStyleType}
          disabled={!tabbarEnable}
          options={TAB_STYLE_OPTIONS}
          className="w-36"
          onChange={(value) => patch({ tabbarStyleType: value as TabsStyleType })}
        />
      </SettingRow>
    </>
  )
}
