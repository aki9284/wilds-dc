'use client'

import { useAtom } from 'jotai'
import { useState } from 'react'
import { weaponStatsAtom } from '@/atoms/weaponAtom'
import { selectedSkillsAtom } from '@/atoms/skillAtoms'
import { selectedBuffsAtom } from '@/atoms/buffAtoms'
import { targetsAtom, isEnragedAtom } from '@/atoms/targetAtoms'
import { selectedMotionsAtom } from '@/atoms/motionAtom'
import { calculateDamage, CalculationResults } from '@/lib/calculations/damageCalculator'
import { historyStorage } from '@/utils/historyStorage'
import { updateTriggerAtom } from '@/atoms/historyAtom'
import { nanoid } from 'nanoid'

export function ResultPanel() {
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [weaponStats] = useAtom(weaponStatsAtom)
  const [selectedSkills] = useAtom(selectedSkillsAtom)
  const [selectedBuffs] = useAtom(selectedBuffsAtom)
  const [targets] = useAtom(targetsAtom)
  const [selectedMotions] = useAtom(selectedMotionsAtom)
  const [isEnraged] = useAtom(isEnragedAtom)
  const [, setUpdateTrigger] = useAtom(updateTriggerAtom)

  const handleCalculate = () => {
    const calculationResults = calculateDamage({
      weaponStats,
      selectedSkills,
      selectedBuffs,
      targets,
      selectedMotions,
      isEnraged
    })
    setResults(calculationResults)

    // 履歴を保存
    if (calculationResults) {
      const history = {
        id: nanoid(),
        weaponStats,
        result: calculationResults,
        savedState: {
          selectedSkills,
          selectedBuffs,
          targets,
          selectedMotions,
          isEnraged
        }
      }
      historyStorage.save(history)
      setUpdateTrigger(prev => prev + 1)
    }
  }

  return (
    <div className="p-4 border-b">
      <h2 className="text-xl font-semibold mb-4">計算結果</h2>
      
      <button 
        onClick={handleCalculate}
        className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        計算実行
      </button>

      {results && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">最小ダメージ</span>
            <div className="flex gap-3 text-sm">
              <span className="font-mono">{results.minDamage.total}</span>
              <span className="font-mono">({results.minDamage.physical}/{results.minDamage.elemental})</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">最大ダメージ</span>
            <div className="flex gap-3 text-sm">
              <span className="font-mono">{results.maxDamage.total}</span>
              <span className="font-mono">({results.maxDamage.physical}/{results.maxDamage.elemental})</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">期待ダメージ</span>
            <div className="flex gap-3 text-sm">
              <span className="font-mono">{results.expectedDamage.total}</span>
              <span className="font-mono">({results.expectedDamage.physical}/{results.expectedDamage.elemental})</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">期待DPS</span>
            <span className="font-mono text-sm">{results.dps}</span>
          </div>
        </div>
      )}
    </div>
  )
}