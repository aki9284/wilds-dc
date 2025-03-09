import { CalculationHistory } from "@/models/types/history";
import { historiesAtom } from '@/models/atoms/historyAtom'
import { getDefaultStore } from 'jotai'

const store = getDefaultStore()

export const historyStorage = {
  getAll: (): CalculationHistory[] => {
    const histories = JSON.parse(localStorage.getItem('histories') || '[]')
    store.set(historiesAtom, histories)
    return histories
  },

  save: (history: CalculationHistory) => {
    const histories = historyStorage.getAll()
    histories.unshift(history)
    localStorage.setItem('histories', JSON.stringify(histories))
    store.set(historiesAtom, histories)
  },
  
  clear: () => {
    localStorage.removeItem('histories')
    store.set(historiesAtom, [])
  }
}