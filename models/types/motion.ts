import { PhysicalTypeKey } from "../constants/damageTypes";
import { WeaponTypeKey } from "./weapon";

export interface Motion {
  weaponType: WeaponTypeKey;
  name: string;
  value: number;
  damageType: PhysicalTypeKey;
  ignoreEffectiveness: boolean;
  multiplyElement: number;
  duration: number;
}

export interface SelectedMotion {
  id: string;
  motion: Motion | null;
}