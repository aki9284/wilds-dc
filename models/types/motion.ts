import { PhysicalTypeKey } from "../constants/damageTypes";
import { SharpnessKey } from "../constants/sharpness";
import { WeaponTypeKey } from "./weapon";

export interface Motion {
  weaponType: WeaponTypeKey;
  name: string;
  value: number;
  damageType: PhysicalTypeKey;
  duration: number;
  multiplyElement?: number;
  cannotCrit?: boolean;
  ignoreEffectiveness?: boolean;
  ignoreSharpness?: boolean;
  elementValueOverride?: number;
  fixedDamage?: number;
  whiteflame?: number;
}

export interface SelectedMotion {
  id: string;
  motion: Motion | null;
}