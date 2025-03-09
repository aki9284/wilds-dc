import { atom } from 'jotai'
import { CalculationHistory } from '@/models/types/history'

export const historiesAtom = atom<CalculationHistory[]>([])
