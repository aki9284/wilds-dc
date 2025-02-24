'use client'
import { useAtom } from 'jotai'
import { weaponStatsAtom } from '@/atoms/weaponAtom'
import { WeaponStats } from '@/models/types/weapon'
import { WEAPON_LABELS } from '@/models/types/labels'

const FormLabel = ({ name, required = false }: { name: keyof typeof WEAPON_LABELS, required?: boolean }) => (
  <div className="flex items-center w-32">
    <span>{WEAPON_LABELS[name].label}</span>
    <span 
      className="ml-1 text-red-500 cursor-help"
      title={WEAPON_LABELS[name].note}
    >
      *
    </span>
  </div>
)

export function WeaponForm() {
  const [stats, setStats] = useAtom(weaponStatsAtom)

  return (
    <form className="space-y-4">
      <div className="flex items-center gap-4">
        <FormLabel name="attack" />
        <input
          type="number"
          value={stats.attack}
          onChange={(e) => setStats({ ...stats, attack: Number(e.target.value) })}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="flex items-center gap-4">
        <FormLabel name="affinity" />
        <input
          type="number"
          value={stats.affinity}
          onChange={(e) => setStats({ ...stats, affinity: Number(e.target.value) })}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="flex items-center gap-4">
        <FormLabel name="elementType" />
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
        <FormLabel name="elementValue" />
        <input
          type="number"
          value={stats.elementValue}
          onChange={(e) => setStats({ ...stats, elementValue: Number(e.target.value) })}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="flex items-center gap-4">
        <FormLabel name="sharpness" />
        <select
          value={stats.sharpness}
          onChange={(e) => setStats({ ...stats, sharpness: e.target.value as WeaponStats['sharpness'] })}
          className="border rounded px-2 py-1"
        >
          <option value="赤">赤</option>
          <option value="橙">橙</option>
          <option value="黄">黄</option>
          <option value="緑">緑</option>
          <option value="青">青</option>
          <option value="白">白</option>
          <option value="紫">紫</option>
        </select>
      </div>
    </form>
  )
}
