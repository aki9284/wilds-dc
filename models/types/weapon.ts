import { SharpnessKey } from '../constants/sharpness';
import { ElementTypeKey } from '../constants/damageTypes';

export const WEAPON_TYPES = {
  greatSword: {
    label: '大剣'
  },
  longSword: {
    label: '太刀' 
  },
  swordAndShield: {
    label: '片手剣'
  },
  dualBlades: {
    label: '双剣'
  },
  hammer: {
    label: 'ハンマー'
  },
  huntingHorn: {
    label: '狩猟笛'
  },
  lance: {
    label: 'ランス'
  },
  gunlance: {
    label: 'ガンランス'
  },
  switchAxe: {
    label: 'スラッシュアックス'
  },
  chargeBlade: {
    label: 'チャージアックス'
  },
  insectGlaive: {
    label: '虫剣'
  },
  lightBowgun: {
    label: 'ライトボウガン'
  },
  heavyBowgun: {
    label: 'ヘビィボウガン'
  },
  bow: {
    label: '弓'
  }
} as const;

export type WeaponTypeKey = keyof typeof WEAPON_TYPES;

export type WeaponStats = {
  //weaponType: WeaponTypeKey; //モーション側で管理しているため今のところ不要、必要なシチュエーションがあれば追加
  attack: number;
  affinity: number;
  elementType: ElementTypeKey;
  elementValue: number;
  sharpness: SharpnessKey;
};

export type NamedWeaponData = {
  id: string;
  name: string;
  type: WeaponTypeKey;
  stats: WeaponStats;
}