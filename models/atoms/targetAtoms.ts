import { atom } from 'jotai'
import { SelectedTarget } from '@/models/types/target'

export const selectedMonsterAtom = atom<string>('トレーニングダミー')
export const selectedTargetsAtom = atom<SelectedTarget[]>([])
