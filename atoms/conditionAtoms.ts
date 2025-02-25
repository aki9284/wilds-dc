import { atom } from 'jotai'
import { CONDITION_DATA } from '@/models/constants/condition'

type ConditionValues = {
  [K in keyof typeof CONDITION_DATA]: number
}

const initialConditions: ConditionValues = Object.keys(CONDITION_DATA).reduce((acc, key) => ({
  ...acc,
  [key]: 100
}), {} as ConditionValues)

export const conditionsAtom = atom(initialConditions)
