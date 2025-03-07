'use client'
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { historiesAtom, updateTriggerAtom } from '@/models/atoms/historyAtom'
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

export function HistoryPanel() {
  const [histories, setHistories] = useAtom(historiesAtom)
  const [updateTrigger] = useAtom(updateTriggerAtom)
  const [, setWeaponStats] = useAtom(currentWeaponStatsAtom)
  const [, setSelectedSkills] = useAtom(selectedSkillsAtom)
  const [, setSelectedBuffs] = useAtom(selectedBuffsAtom)
  const [, setSelectedMonster] = useAtom(selectedMonsterAtom)
  const [, setSelectedTargets] = useAtom(selectedTargetsAtom)
  const [, setSelectedMotions] = useAtom(selectedMotionsAtom)
  const [, setConditionValues] = useAtom(conditionsAtom)

  useEffect(() => {
    setHistories(historyStorage.getAll())
  }, [updateTrigger, setHistories])

  const restoreState = (history: CalculationHistory) => {
    setWeaponStats(history.weaponStats)
    setSelectedSkills(history.savedState.selectedSkills as SelectedSkill[])
    setSelectedBuffs(history.savedState.selectedBuffs as BuffKey[])
    setSelectedMonster(history.savedState.selectedMonster)
    setSelectedTargets(history.savedState.selectedTargets)
    setSelectedMotions(history.savedState.selectedMotions)
    setConditionValues(history.savedState.conditionValues)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">計算履歴</h2>
      <div className="space-y-2">
        {histories.map(history => (
          <div 
            key={history.id} 
            className="p-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
            // ディープコピーを使って復元させることで復元後にUIを弄られてもメモリ上の履歴が変わらないようにする
            onClick={() => restoreState(JSON.parse(JSON.stringify(history)))}
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