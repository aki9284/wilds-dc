import { atom } from 'jotai';
import { CalculationResults } from '@/lib/calculations/damageCalculator'; // Import CalculationResults

export interface ComparisonRow {
  id: string;
  equipmentPresetName: string;
  targetPresetName: string;
  motionPresetName: string;
  conditionPresetName: string;
  results?: CalculationResults | null; // Add results property, optional and can be null
}

export const comparisonRowsAtom = atom<ComparisonRow[]>([]);
