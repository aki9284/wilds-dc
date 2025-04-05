import { ElementTypeKey, PhysicalTypeKey } from "../constants/damageTypes";
import { SharpnessKey } from "../constants/sharpness";
import { WeaponTypeKey } from "./weapon";

export interface Motion {
  weaponType: WeaponTypeKey;
  name: string;
  value: number;
  damageType: PhysicalTypeKey;
  motionTime: number;
  multiplyElement?: number;
  cannotCrit?: boolean;
  cannotTriggerWhiteflame?: boolean;
  ignoreEffectiveness?: boolean;
  ignoreSharpness?: boolean;
  elementTypeOverride?: ElementTypeKey;
  elementValueOverride?: number;
  fixedPhysicalDamage?: number;
  fixedElementalDamage?: number;
  skipRate?: number; // 追加ヒットなどモーション自体が確率発動する場合、無視する割合（無視の場合は0ダメージとして期待値計算）
}

export interface SelectedMotion {
  id: string;
  motion: Motion | null;
}