'use client'
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { historiesAtom, updateTriggerAtom } from '@/atoms/historyAtom'
import { historyStorage } from '@/utils/historyStorage'
import { CalculationHistory } from '@/models/types/history'

export function HistoryPanel() {
  const [histories, setHistories] = useAtom(historiesAtom)
  const [updateTrigger] = useAtom(updateTriggerAtom)

  useEffect(() => {
    setHistories(historyStorage.getAll())
  }, [updateTrigger, setHistories])

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">History</h2>
      <div className="space-y-2">
        {histories.map(history => (
          <div key={history.id} className="text-sm border-b pb-2">
            <div className="flex justify-between">
              <span>{new Date(history.timestamp).toLocaleTimeString()}</span>
              <span className="font-mono">{history.result}</span>
            </div>
            <div className="text-gray-600">
              ATK: {history.weaponStats.attack}, MV: {history.motionValue}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

