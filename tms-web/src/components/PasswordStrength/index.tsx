import type { PasswordStrengthProps } from "@/interface/components"
import { getPasswordStrength, type PasswordStrengthLevel } from "@/pages/login/passwordStrength"

export type { PasswordStrengthProps }



const SEGMENTS: Array<Exclude<PasswordStrengthLevel, "empty">> = ["weak", "medium", "strong"]



const LEVEL_INDEX: Record<Exclude<PasswordStrengthLevel, "empty">, number> = {

  weak: 1,

  medium: 2,

  strong: 3,

}



const LEVEL_COLOR: Record<Exclude<PasswordStrengthLevel, "empty">, string> = {

  weak: "var(--td-error-color)",

  medium: "var(--td-warning-color)",

  strong: "var(--td-success-color)",

}

/** 密码强度三段指示条（输入后显示） */

export default function PasswordStrength(props: PasswordStrengthProps) {

  const { password = "", className } = props

  const strength = getPasswordStrength(password)

  if (strength.level === "empty") return null



  const active = LEVEL_INDEX[strength.level]

  const color = LEVEL_COLOR[strength.level]



  return (

    <div className={className}>

      <div className="flex items-center gap-2">

        <div className="grid flex-1 grid-cols-3 gap-1">

          {SEGMENTS.map((segment, index) => (

            <span

              key={segment}

              className="h-1.5 rounded"

              style={{

                background:

                  index < active ? color : "var(--td-bg-color-component)",

              }}

            />

          ))}

        </div>

        <span className="shrink-0 text-xs" style={{ color }}>

          强度：{strength.label}

        </span>

      </div>

      <p className="mt-1 text-xs leading-5 text-(--td-text-color-placeholder)">

        {strength.tips.length > 0

          ? `建议：${strength.tips.slice(0, 3).join("、")}`

          : "密码强度较好"}

      </p>

    </div>

  )

}

