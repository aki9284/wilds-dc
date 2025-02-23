'use client'
import { useState } from 'react'
import { WeaponStats, WeaponType } from '@/models/types/weapon'

export function WeaponForm() {
  const [stats, setStats] = useState<WeaponStats>({
    attack: 0,
    affinity: 0,
    elementType: '無',
    elementValue: 0
  })

  return (
    <form className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="w-32">Attack</label>
        <input
          type="number"
          value={stats.attack}
          onChange={(e) => setStats({ ...stats, attack: Number(e.target.value) })}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="flex items-center gap-4">
        <label className="w-32">Affinity</label>
        <input
          type="number"
          value={stats.affinity}
          onChange={(e) => setStats({ ...stats, affinity: Number(e.target.value) })}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="flex items-center gap-4">
        <label className="w-32">Element Type</label>
        <select
          value={stats.elementType}
          onChange={(e) => setStats({ ...stats, elementType: e.target.value as WeaponStats['elementType'] })}
          className="border rounded px-2 py-1"
        >
          <option value="無">無</option>
          <option value="火">火</option>
          <option value="水">水</option>
          <option value="雷">雷</option>
          <option value="氷">氷</option>
          <option value="龍">龍</option>
        </select>
      </div>
      <div className="flex items-center gap-4">
        <label className="w-32">Element Value</label>
        <input
          type="number"
          value={stats.elementValue}
          onChange={(e) => setStats({ ...stats, elementValue: Number(e.target.value) })}
          className="border rounded px-2 py-1"
        />
      </div>
    </form>
  )
}
