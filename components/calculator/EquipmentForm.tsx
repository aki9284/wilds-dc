'use client'

import { SkillSelector } from "./SkillSelector"
import { WeaponForm } from "./WeaponForm"

export function EquipmentForm() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">武器設定</h2>
        <WeaponForm />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">スキル設定</h2>
        <SkillSelector />
      </div>
    </div>
  )
}
