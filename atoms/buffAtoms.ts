import { atom } from 'jotai'
import { BuffKey } from '@/models/constants/buff'

export const selectedBuffsAtom = atom<BuffKey[]>([])
