import { WeaponStats } from "./weapon";

export interface CalculationHistory {
  id: string;
  timestamp: number;
  weaponStats: WeaponStats;
  motionValue: number;
  result: number;
}
