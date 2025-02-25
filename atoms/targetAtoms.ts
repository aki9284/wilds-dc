import { atom } from 'jotai'
import { Target } from '@/models/types/target'

export const selectedMonsterAtom = atom<string>('')

export const isEnragedAtom = atom<boolean>(false)

export const selectedTargetsAtom = atom<Target[]>([])

