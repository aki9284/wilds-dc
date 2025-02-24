import { WeaponStats } from "./weapon";
import { SelectedSkill } from "./skill";
import { Target } from "./target";
import { MotionSelection } from "./motion";
import { CalculationResults } from "@/lib/calculations/damageCalculator";

export interface CalculationHistory {
  id: string;
  weaponStats: WeaponStats;
  result: CalculationResults;
  savedState: {
    selectedSkills: SelectedSkill[];
    selectedBuffs: string[];
    targets: Target[];
    selectedMotions: MotionSelection[];
    isEnraged: boolean;
  };
}
