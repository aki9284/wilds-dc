import { atom } from 'jotai'
import { WeaponStats } from '@/models/types/weapon'

export const currentWeaponStatsAtom = atom<WeaponStats>({
  attack: 0,
  affinity: 0,
  elementType: "none",
  elementValue: 0,
  sharpness: 'red'
})
