'use client'

import { useAtom } from 'jotai'
import { CONDITION_LABELS } from '@/models/constants/conditionLabels'
import { conditionsAtom } from '@/models/atoms/conditionAtoms'
import { SaveLoadPanel } from '@/components/common/SaveLoadPanel'
import { SaveLoadableTabLayout } from '../navigation/TabNavigation'

export function ConditionSelector() {
  const [conditionValues, setConditionValues] = useAtom(conditionsAtom)

  const handleValueChange = (key: string, value: number) => {
    setConditionValues(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveConditions = (name: string) => {
    // 保存時に現在の条件値を返す
    return conditionValues
  }

  const handleLoadConditions = (data: any) => {
    // 読み込まれたデータで条件値を更新
    setConditionValues(data)
  }

  return (
    <SaveLoadableTabLayout
      saveLoadPanel = {
        <SaveLoadPanel
          storageKey="condition-settings"
          presetFilePath="/data/conditionPresets.json"
          onSave={handleSaveConditions}
          onLoad={handleLoadConditions}
        />
      }
    >
      <h2 className="text-xl font-semibold">計算条件設定</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
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
          ))}
        </div>
      </div>
    </SaveLoadableTabLayout>
  )
}
