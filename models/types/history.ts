import { WeaponStats } from "./weapon";
import { Skill } from "./skill";
import { Target } from "./target";
import { MotionSelection } from "./motion";
import { CalculationResults } from "@/lib/calculations/damageCalculator";

export interface CalculationHistory {
  id: string;
  weaponStats: WeaponStats;
  result: CalculationResults;
  savedState: {
    selectedSkills: Skill[];
    selectedBuffs: string[];
    targets: Target[];
    selectedMotions: MotionSelection[];
    isEnraged: boolean;
  };
}
