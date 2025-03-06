'use client'

import { useAtom } from 'jotai'
import { useState } from 'react'
import { currentWeaponStatsAtom } from '@/models/atoms/weaponAtom'
import { selectedSkillsAtom } from '@/models/atoms/skillAtoms'
import { selectedBuffsAtom } from '@/models/atoms/buffAtoms'
import { selectedTargetsAtom } from '@/models/atoms/targetAtoms'
import { selectedMotionsAtom } from '@/models/atoms/motionAtom'
import { conditionsAtom } from '@/models/atoms/conditionAtoms'
import { calculateDamage, CalculationResults, MotionDamage } from '@/lib/calculations/damageCalculator'
import { historyStorage } from '@/utils/historyStorage'
import { updateTriggerAtom } from '@/models/atoms/historyAtom'
import { nanoid } from 'nanoid'

export function ResultPanel() {
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [expandedMotionIndex, setExpandedMotionIndex] = useState<number | null>(null)
  const [weaponStats] = useAtom(currentWeaponStatsAtom)
  const [selectedSkills] = useAtom(selectedSkillsAtom)
  const [selectedBuffs] = useAtom(selectedBuffsAtom)
  const [selectedTargets] = useAtom(selectedTargetsAtom)
  const [selectedMotions] = useAtom(selectedMotionsAtom)
  const [conditionValues] = useAtom(conditionsAtom);
  const [, setUpdateTrigger] = useAtom(updateTriggerAtom)

  const handleCalculate = () => {
    const calculationResults = calculateDamage({
      weaponStats,
      selectedSkills,
      selectedBuffs,
      selectedTargets: selectedTargets,
      selectedMotions,
      conditionValues: conditionValues
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
          selectedTargets: selectedTargets,
          selectedMotions,
          conditionValues
        }
      }
      historyStorage.save(history)
      setUpdateTrigger(prev => prev + 1)
    }
  }

  const toggleMotionDetails = (index: number) => {
    setExpandedMotionIndex(expandedMotionIndex === index ? null : index)
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

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">モーション内訳</h3>
            {results.motionDamages.map((motionDamage, index) => (
              <div key={index} className="border-t py-2">
                <button
                  onClick={() => toggleMotionDetails(index)}
                  className="w-full text-left text-sm font-bold text-blue-500"
                >
                  {motionDamage.motion.name} ダメージ: {motionDamage.expectedDamage.total}
                </button>
                {expandedMotionIndex === index && (
                  <div className="mt-2 pl-4 text-sm">
                    <div>物理ダメージ: {motionDamage.expectedDamage.physical}</div>
                    <div>属性ダメージ: {motionDamage.expectedDamage.elemental}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}