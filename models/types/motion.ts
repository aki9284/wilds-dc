import { WeaponType } from "./weapon";

export interface Motion {
  weaponType: WeaponType;
  name: string;
  value: number;
  damageType: string;
  multiplyElement: number;
  duration: number;
}

export interface SelectedMotion {
  id: string;
  motion: Motion | null;
}