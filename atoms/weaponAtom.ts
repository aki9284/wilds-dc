import { atom } from 'jotai'
import { WeaponStats } from '@/models/types/weapon'

export const weaponStatsAtom = atom<WeaponStats>({
  attack: 0,
  affinity: 0,
  elementType: '無',
  elementValue: 0,
  sharpness: '赤'
})
