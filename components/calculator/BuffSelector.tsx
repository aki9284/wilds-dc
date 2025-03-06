'use client'

import { useAtom } from 'jotai'
import { selectedBuffsAtom } from '@/models/atoms/buffAtoms'
import { BUFF_DATA } from '@/models/constants/buff'

export function BuffSelector() {
  const [selectedBuffs, setSelectedBuffs] = useAtom(selectedBuffsAtom)

  const toggleBuff = (buffKey: keyof typeof BUFF_DATA) => {
    if (selectedBuffs.includes(buffKey)) {
      setSelectedBuffs(selectedBuffs.filter(b => b !== buffKey))
    } else {
      setSelectedBuffs([...selectedBuffs, buffKey])
    }
  }

  return (
    <div className="space-y-4">
      {Object.entries(BUFF_DATA).map(([key, buff]) => (
        <label key={key} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded">
          <input
            type="checkbox"
            checked={selectedBuffs.includes(key as keyof typeof BUFF_DATA)}
            onChange={() => toggleBuff(key as keyof typeof BUFF_DATA)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm">
            {buff.label}
            <span className="text-gray-500 text-xs ml-2">
              {'multiplyAttack' in buff && `(攻撃力×${buff.multiplyAttack})`}
              {'addAttack' in buff && `(攻撃力+${buff.addAttack})`}
            </span>
          </span>
        </label>
      ))}
    </div>  )
}