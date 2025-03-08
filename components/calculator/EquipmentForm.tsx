'use client'

import { SkillSelector } from "./SkillSelector"
import { WeaponForm } from "./WeaponForm"
import { BuffSelector } from "./BuffSelector"
import { SaveLoadPanel } from "../common/SaveLoadPanel"
import { useAtom } from 'jotai'
import { currentWeaponStatsAtom } from '@/models/atoms/weaponAtom'
import { selectedSkillsAtom } from '@/models/atoms/skillAtoms'
import { selectedBuffsAtom } from '@/models/atoms/buffAtoms'
import { SaveLoadableTabLayout } from "../navigation/TabNavigation"

export function EquipmentForm() {
  const [weaponStats, setWeaponStats] = useAtom(currentWeaponStatsAtom)
  const [selectedSkills, setSelectedSkills] = useAtom(selectedSkillsAtom)
  const [selectedBuffs, setSelectedBuffs] = useAtom(selectedBuffsAtom)
  
  const handleSave = (name: string) => {
    return {
      weaponStats,
      selectedSkills,
      selectedBuffs: selectedBuffs,
    }
  }

  const handleLoad = (data: any) => {
    setWeaponStats(data.weaponStats)
    setSelectedSkills(data.selectedSkills)
    setSelectedBuffs(data.selectedBuffs)
  }

  return (
    <SaveLoadableTabLayout
      saveLoadPanel={
        <SaveLoadPanel 
          storageKey="equipment-settings"
          presetFilePath="/data/equipmentPresets.json"
          onSave={handleSave}
          onLoad={handleLoad}
        />
      }
    >
      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-4">武器設定</h2>
          <WeaponForm />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">スキル設定</h2>
          <SkillSelector />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">バフ設定</h2>
          <BuffSelector />
        </div>
      </div>
    </SaveLoadableTabLayout>
  )
}