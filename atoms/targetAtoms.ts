import { atom } from 'jotai'

export interface Target {
  id: string
  partName: string
  percentage: number
}

export const selectedMonsterAtom = atom<string>('')

export const isEnragedAtom = atom<boolean>(false)

export const targetsAtom = atom<Target[]>([])

