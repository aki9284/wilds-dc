import { atom } from 'jotai'
import { SelectedSkill } from '@/models/constants/skill'



export const selectedSkillsAtom = atom<SelectedSkill[]>([])
