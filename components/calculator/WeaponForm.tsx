'use client'
import { useAtom } from 'jotai'
import { currentWeaponStatsAtom } from '@/atoms/weaponAtom'
import { WeaponStats } from '@/models/types/weapon'
import { WEAPON_STATS_LABELS } from '@/models/constants/weaponLabels'
import { SHARPNESS_DATA } from '@/models/constants/sharpness';
import { ELEMENT_TYPES } from '@/models/constants/damageTypes';

const FormLabel = ({ name, required = false }: { name: keyof typeof WEAPON_STATS_LABELS, required?: boolean }) => (
  <div className="flex items-center w-32">
    <span>{WEAPON_STATS_LABELS[name].label}</span>
    <span 
      className="ml-1 text-red-500 cursor-help"
      title={WEAPON_STATS_LABELS[name].note}
    >
      *
    </span>
  </div>
)

export function WeaponForm() {
  const [stats, setStats] = useAtom(currentWeaponStatsAtom)

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
          {Object.entries(ELEMENT_TYPES).map(([key, element]) => (
            <option key={key} value={key}>
              {element.label}
            </option>
          ))}
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
          {Object.entries(SHARPNESS_DATA).map(([key, sharp]) => (
            <option key={key} value={key}>
              {sharp.label}
            </option>
          ))}
        </select>
      </div>
    </form>
  )
}
