'use client'

import { useAtom } from 'jotai'
import { useEffect, useState } from "react"
import { selectedBuffsAtom } from '@/atoms/buffAtoms'

interface Buff {
  name: string
  multiplyAttack?: number
  addAttack?: number
}

export function BuffSelector() {
  const [buffs, setBuffs] = useState<Buff[]>([])
  const [selectedBuffs, setSelectedBuffs] = useAtom(selectedBuffsAtom)

  useEffect(() => {
    fetch('/data/buffs.json')
      .then(res => res.json())
      .then(data => setBuffs(data.buffs))
  }, [])

  const toggleBuff = (buffName: string) => {
    if (selectedBuffs.includes(buffName)) {
      setSelectedBuffs(selectedBuffs.filter(b => b !== buffName))
    } else {
      setSelectedBuffs([...selectedBuffs, buffName])
    }
  }

  return (
    <div className="space-y-4">
      {buffs.map((buff) => (
        <label key={buff.name} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedBuffs.includes(buff.name)}
            onChange={() => toggleBuff(buff.name)}
            className="rounded"
          />
          <span>{buff.name}</span>
        </label>
      ))}
    </div>
  )
}