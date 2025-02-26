'use client'

import { useAtom } from 'jotai'
import { CONDITION_LABELS } from '@/models/constants/conditionLabels'
import { conditionsAtom } from '@/atoms/conditionAtoms'

export function ConditionSelector() {
  const [conditionValues, setConditionValues] = useAtom(conditionsAtom)

  const handleValueChange = (key: string, value: number) => {
    setConditionValues(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">計算条件設定</h2>
      <div className="space-y-4">
        {Object.entries(CONDITION_LABELS).map(([key, condition]) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {condition.label}
            </label>
            {condition.type === 'percentage' ? (
              <input
                type="number"
                min={0}
                max={100}
                value={conditionValues[key as keyof typeof conditionValues]}
                onChange={(e) => handleValueChange(key, Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={conditionValues[key as keyof typeof conditionValues]}
                  onChange={(e) => handleValueChange(key, Number(e.target.value))}
                  className="w-full"
                />
                <span className="w-12 text-sm">{conditionValues[key as keyof typeof conditionValues]}%</span>
              </div>
            )}
          </div>
        ))}      </div>
    </div>
  )
}
