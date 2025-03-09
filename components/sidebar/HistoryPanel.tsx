'use client'
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { historiesAtom } from '@/models/atoms/historyAtom'
import { selectedSkillsAtom } from '@/models/atoms/skillAtoms'
import { selectedMonsterAtom, selectedTargetsAtom } from '@/models/atoms/targetAtoms'
import { selectedMotionsAtom } from '@/models/atoms/motionAtom'
import { selectedBuffsAtom } from '@/models/atoms/buffAtoms'
import { currentWeaponStatsAtom } from '@/models/atoms/weaponAtom'
import { conditionsAtom } from '@/models/atoms/conditionAtoms'
import { historyStorage } from '@/utils/historyStorage'
import { CalculationHistory } from '@/models/types/history'
import { BuffKey } from '@/models/constants/buff'
import { SelectedSkill } from '@/models/constants/skill'
import { ELEMENT_TYPES } from '@/models/constants/damageTypes'

export function HistoryPanel() {
  const [histories] = useAtom(historiesAtom)
  const [, setWeaponStats] = useAtom(currentWeaponStatsAtom)
  const [, setSelectedSkills] = useAtom(selectedSkillsAtom)
  const [, setSelectedBuffs] = useAtom(selectedBuffsAtom)
  const [, setSelectedMonster] = useAtom(selectedMonsterAtom)
  const [, setSelectedTargets] = useAtom(selectedTargetsAtom)
  const [, setSelectedMotions] = useAtom(selectedMotionsAtom)
  const [, setConditionValues] = useAtom(conditionsAtom)

  useEffect(() => {
    historyStorage.getAll()
  }, [])

  const restoreState = (history: CalculationHistory) => {
    setWeaponStats(history.weaponStats)
    setSelectedSkills(history.savedState.selectedSkills as SelectedSkill[])
    setSelectedBuffs(history.savedState.selectedBuffs as BuffKey[])
    setSelectedMonster(history.savedState.selectedMonster)
    setSelectedTargets(history.savedState.selectedTargets)
    setSelectedMotions(history.savedState.selectedMotions)
    setConditionValues(history.savedState.conditionValues)
  }

  const clearAllHistories = () => {
    historyStorage.clear()
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">計算履歴</h2>
        <button
          onClick={clearAllHistories}
          className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
        >
          クリア
        </button>
      </div>
      <div className="space-y-2">
        {histories.map(history => (
          <div 
            key={history.id} 
            className="p-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={() => restoreState(JSON.parse(JSON.stringify(history)))}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">
                攻撃力{history.weaponStats.attack} / {ELEMENT_TYPES[history.weaponStats.elementType].label} {history.weaponStats.elementValue} / 会心{history.weaponStats.affinity}%
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <div className="mt-2">
                <div>対象: {history.savedState.selectedMonster}</div>
                <div>計算結果: {history.result.minDamage.total}～{history.result.expectedDamage.total}～{history.result.maxDamage.total}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}