import { atom } from 'jotai'

export interface SelectedSkill {
  name: string
  level: number
}

export const selectedSkillsAtom = atom<SelectedSkill[]>([])
