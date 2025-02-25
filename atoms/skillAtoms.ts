import { atom } from 'jotai'
import { SKILL_DATA, SkillKey } from '@/models/constants/skill'

export interface SelectedSkill {
  skillKey: SkillKey
  level: number
}

export const selectedSkillsAtom = atom<SelectedSkill[]>([])
