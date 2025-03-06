import { atom } from 'jotai'
import { SelectedTarget } from '@/models/types/target'

export const selectedMonsterAtom = atom<string>('')
export const selectedTargetsAtom = atom<SelectedTarget[]>([])
