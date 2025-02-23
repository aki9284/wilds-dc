import { CalculationHistory } from "@/models/types/history";

export const historyStorage = {
  save: (history: CalculationHistory) => {
    const histories = localStorage.getItem('damage-calc-histories');
    const existingHistories = histories ? JSON.parse(histories) : [];
    localStorage.setItem('damage-calc-histories', JSON.stringify([history, ...existingHistories]));
  },
  
  getAll: (): CalculationHistory[] => {
    const histories = localStorage.getItem('damage-calc-histories');
    return histories ? JSON.parse(histories) : [];
  },
  
  clear: () => {
    localStorage.removeItem('damage-calc-histories');
  }
};
