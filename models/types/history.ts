import { WeaponStats } from "./weapon";
import { SelectedSkill } from "@/models/constants/skill";
import { SelectedTarget } from "./target";
import { SelectedMotion } from "./motion";
import { CalculationResults } from "@/lib/calculations/damageCalculator";
import { ConditionValues } from "@/models/atoms/conditionAtoms";
import { BuffKey } from "../constants/buff";

export interface CalculationHistory {
  id: string;
  weaponStats: WeaponStats;
  result: CalculationResults;
  savedState: {
    selectedSkills: SelectedSkill[];
    selectedBuffs: BuffKey[];
    selectedMonster: string;
    selectedTargets: SelectedTarget[];
    selectedMotions: SelectedMotion[];
    conditionValues: ConditionValues;
  };
}
