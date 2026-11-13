import PreferencesLayout from "./components/layout"
import TabbarLayout from "./components/tabbar"
import ThemeLayout from "./components/theme"
import UniversalLayout from "./components/universal"

export default function PageSetting() {
  return (
    <>
      <UniversalLayout />
      <PreferencesLayout />
      <ThemeLayout />
      <TabbarLayout />
    </>
  )
}
