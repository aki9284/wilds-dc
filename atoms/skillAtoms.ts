import { Skill } from '@/models/types/skill'
import { atom } from 'jotai'

export const selectedSkillsAtom = atom<Skill[]>([])
