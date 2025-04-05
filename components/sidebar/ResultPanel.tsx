'use client'

import { useAtom } from 'jotai'
import { useState } from 'react'
import { currentWeaponStatsAtom } from '@/models/atoms/weaponAtom'
import { selectedSkillsAtom } from '@/models/atoms/skillAtoms'
import { selectedBuffsAtom } from '@/models/atoms/buffAtoms'
import { selectedMonsterAtom, selectedTargetsAtom } from '@/models/atoms/targetAtoms'
import { selectedMotionsAtom } from '@/models/atoms/motionAtom'
import { conditionsAtom } from '@/models/atoms/conditionAtoms'
import { calculateDamage, CalculationResults, MotionDamage } from '@/lib/calculations/damageCalculator'
import { historyStorage } from '@/utils/historyStorage'
import { nanoid } from 'nanoid'

export function ResultPanel() {
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [expandedMotionIndex, setExpandedMotionIndex] = useState<number | null>(null)
  const [weaponStats] = useAtom(currentWeaponStatsAtom)
  const [selectedSkills] = useAtom(selectedSkillsAtom)
  const [selectedBuffs] = useAtom(selectedBuffsAtom)
  const [selectedMonster] = useAtom(selectedMonsterAtom)
  const [selectedTargets] = useAtom(selectedTargetsAtom)
  const [selectedMotions] = useAtom(selectedMotionsAtom)
  const [conditionValues] = useAtom(conditionsAtom);

  const handleCalculate = () => {
    if (selectedTargets.length === 0) {
      alert('攻撃対象が選択されていません。')
      return
    }
    if (selectedMotions.length === 0 || selectedMotions[0].motion === undefined || selectedMotions[0].motion === null) {
      alert('モーションが選択されていません。')
      return
    }
    const calculationResults = calculateDamage({
      weaponStats,
      selectedSkills,
      selectedBuffs,
      selectedTargets,
      selectedMotions,
      conditionValues
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
          selectedMonster,
          selectedTargets,
          selectedMotions,
          conditionValues
        }
      }
      historyStorage.save(history)
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
              <span className="font-mono">({results.minDamage.physical}+{results.minDamage.elemental}+{results.minDamage.additional})</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">期待ダメージ</span>
            <div className="flex gap-3 text-sm">
              <span className="font-mono">{results.expectedDamage.total}</span>
              <span className="font-mono">({results.expectedDamage.physical}+{results.expectedDamage.elemental}+{results.expectedDamage.additional})</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">最大ダメージ</span>
            <div className="flex gap-3 text-sm">
              <span className="font-mono">{results.maxDamage.total}</span>
              <span className="font-mono">({results.maxDamage.physical}+{results.maxDamage.elemental}+{results.maxDamage.additional})</span>
            </div>
          </div>

          

          <div className="mt-4">
            <h4 className="font-semibold mt-8 mb-2">モーション内訳</h4>
            {results.motionDamages.map((motionDamage, index) => (
              <div key={index} className="border-t py-2">
                <button
                  onClick={() => toggleMotionDetails(index)}
                  className="w-full text-left text-sm font-bold text-blue-500"
                >
                  {motionDamage.motion.name} : {motionDamage.minDamage.total}～{motionDamage.expectedDamage.total}～{motionDamage.maxDamage.total}
                </button>
                {expandedMotionIndex === index && (
                  <div className="mt-2 pl-4 text-sm">
                    <div>最小: {motionDamage.minDamage.total}（{motionDamage.minDamage.physical}+{motionDamage.minDamage.elemental}+{motionDamage.minDamage.additional}）</div>
                    <div>期待値:{motionDamage.expectedDamage.total}（{motionDamage.expectedDamage.physical}+{motionDamage.expectedDamage.elemental}+{motionDamage.expectedDamage.additional}）</div>
                    <div>最大: {motionDamage.maxDamage.total}（{motionDamage.maxDamage.physical}+{motionDamage.maxDamage.elemental}+{motionDamage.maxDamage.additional}）</div>
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