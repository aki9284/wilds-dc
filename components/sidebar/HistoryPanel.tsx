'use client'
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { historiesAtom, updateTriggerAtom } from '@/atoms/historyAtom'
import { selectedSkillsAtom } from '@/atoms/skillAtoms'
import { targetsAtom, isEnragedAtom } from '@/atoms/targetAtoms'
import { selectedMotionsAtom } from '@/atoms/motionAtom'
import { selectedBuffsAtom } from '@/atoms/buffAtoms'
import { weaponStatsAtom } from '@/atoms/weaponAtom'
import { historyStorage } from '@/utils/historyStorage'
import { CalculationHistory } from '@/models/types/history'

export function HistoryPanel() {
  const [histories, setHistories] = useAtom(historiesAtom)
  const [updateTrigger] = useAtom(updateTriggerAtom)
  const [, setWeaponStats] = useAtom(weaponStatsAtom)
  const [, setSelectedSkills] = useAtom(selectedSkillsAtom)
  const [, setSelectedBuffs] = useAtom(selectedBuffsAtom)
  const [, setTargets] = useAtom(targetsAtom)
  const [, setSelectedMotions] = useAtom(selectedMotionsAtom)
  const [, setIsEnraged] = useAtom(isEnragedAtom)

  useEffect(() => {
    setHistories(historyStorage.getAll())
  }, [updateTrigger, setHistories])

  const restoreState = (history: CalculationHistory) => {
    setWeaponStats(history.weaponStats)
    setSelectedSkills(history.savedState.selectedSkills)
    setSelectedBuffs(history.savedState.selectedBuffs || []) // デフォルト値を設定
    setTargets(history.savedState.targets)
    setSelectedMotions(history.savedState.selectedMotions)
    setIsEnraged(history.savedState.isEnraged)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">計算履歴</h2>
      <div className="space-y-2">
        {histories.map(history => (
          <div 
            key={history.id} 
            className="p-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={() => restoreState(history)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">
                攻撃力: {history.weaponStats.attack} / {history.weaponStats.elementType} {history.weaponStats.elementValue}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <div>会心率: {history.weaponStats.affinity}%</div>
              <div>斬れ味: {history.weaponStats.sharpness}</div>
              <div className="mt-2">
                <div className="font-bold">計算結果:</div>
                <div>期待値: {history.result.expectedDamage.total}</div>
                <div>DPS: {history.result.dps}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}