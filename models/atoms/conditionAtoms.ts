import { atom } from 'jotai'
import { CONDITION_LABELS } from '@/models/constants/conditionLabels'

export type ConditionValues = {
  [K in keyof typeof CONDITION_LABELS]: number
}

const initialConditions: ConditionValues = Object.keys(CONDITION_LABELS).reduce((acc, key) => ({
  ...acc,
  [key]: 100
}), {} as ConditionValues)

export const conditionsAtom = atom(initialConditions)
