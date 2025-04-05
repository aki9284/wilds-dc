import { multiply } from "lodash";
import { EFFECT_ORDER_CRITICAL, EFFECT_ORDER_ELEMENTATTACK } from "./effectOrder";
import { DamageElemntTypeKey } from "./damageTypes";

export type AddDamageParams = {
  fixedDamage?: number;
  elementType?: DamageElemntTypeKey;
  elementValue?: number;
}

export type SkillEffect = {
  addAttack?: number;
  addAffinity?: number;
  addAffinity2?: number;  // 弱点特効の第2条件時などに使用
  setCritFactor?: number;
  multiplyAttack?: number;
  addElement?: number;
  multiplyElement?: number;
  additionalHit?: AddDamageParams;
}

export type SkillLevel = {
  level: number;
  effects: SkillEffect;
}

export type Skill = {
  label: string;
  levels: SkillLevel[];
  requirements?: string[];
  accompanies?: SkillKey[];
  order: number;
  hidden?: boolean;
}

export interface SelectedSkill {
  skillKey: SkillKey
  level: number
}

export const SKILL_DATA: { [key: string]: Skill } = {
  attackBoost: {
    label: "攻撃",
    levels: [
      { level: 1, effects: { addAttack: 3 } },
      { level: 2, effects: { addAttack: 5 } },
      { level: 3, effects: { addAttack: 7 } },
      { level: 4, effects: { addAttack: 8, multiplyAttack: 1.02 } },
      { level: 5, effects: { addAttack: 9, multiplyAttack: 1.04 } },
    ],
    order: 201
  },
  criticalEye: {
    label: "見切り",
    levels: [
      { level: 1, effects: { addAffinity: 4 } },
      { level: 2, effects: { addAffinity: 8 } },
      { level: 3, effects: { addAffinity: 12 } },
      { level: 4, effects: { addAffinity: 16 } },
      { level: 5, effects: { addAffinity: 20 } }
    ],
    order: 202
  },
  maximumMight: {
    label: "渾身",
    levels: [
      { level: 1, effects: { addAffinity: 10 } },
      { level: 2, effects: { addAffinity: 20 } },
      { level: 3, effects: { addAffinity: 30 } },
    ],
    requirements: ["skillMaximumMightEnabled"],
    order: 202
  },
  criticalBoost: {
    label: "超会心",
    levels: [
      { level: 1, effects: { setCritFactor: 1.28 } },
      { level: 2, effects: { setCritFactor: 1.31 } },
      { level: 3, effects: { setCritFactor: 1.34 } },
      { level: 4, effects: { setCritFactor: 1.37 } },
      { level: 5, effects: { setCritFactor: 1.40 } }
    ],
    order: 203
  },
  weaknessExploit: {
    label: "弱点特効",
    levels: [
      { level: 1, effects: { addAffinity: 5, addAffinity2: 3 } },
      { level: 2, effects: { addAffinity: 10, addAffinity2: 5 } },
      { level: 3, effects: { addAffinity: 15, addAffinity2: 10 } },
      { level: 4, effects: { addAffinity: 20, addAffinity2: 15 } },
      { level: 5, effects: { addAffinity: 30, addAffinity2: 20 } }
    ],
    requirements: ["weakPart"],
    order: 204
  },
  peakPerformance: {
    label: "フルチャージ",
    levels: [
      { level: 1, effects: { addAttack: 3 } },
      { level: 2, effects: { addAttack: 6 } },
      { level: 3, effects: { addAttack: 10 } },
      { level: 4, effects: { addAttack: 15 } },
      { level: 5, effects: { addAttack: 20 } }
    ],
    requirements: ["skillPeakPerformanceEnabled"],
    order: 205
  },
  agitator: {
    label: "挑戦者",
    levels: [
      { level: 1, effects: { addAttack: 4, addAffinity: 3 } },
      { level: 2, effects: { addAttack: 8, addAffinity: 5 } },
      { level: 3, effects: { addAttack: 12, addAffinity: 7 } },
      { level: 4, effects: { addAttack: 16, addAffinity: 10 } },
      { level: 5, effects: { addAttack: 20, addAffinity: 15 } }
    ],
    requirements: ["enraged"],
    order: 206
  },
  adrenalineRush: {
    label: "巧撃",
    levels: [
      { level: 1, effects: { addAttack: 10 } },
      { level: 2, effects: { addAttack: 15 } },
      { level: 3, effects: { addAttack: 20 } },
      { level: 4, effects: { addAttack: 25 } },
      { level: 5, effects: { addAttack: 30 } }
    ],
    requirements: ["skillAdrenalineRushEnabled"],
    order: 207
  },
  counterstrike: {
    label: "逆襲",
    levels: [
      { level: 1, effects: { addAttack: 10 } },
      { level: 2, effects: { addAttack: 15 } },
      { level: 3, effects: { addAttack: 25 } },
    ],
    requirements: ["skillCounterstrikeEnabled"],
    order: 208
  },
  burstHH: {
    label: "連撃(笛)",
    levels: [
      { level: 1, effects: { addAttack: 10, addElement: 80 } },
      { level: 2, effects: { addAttack: 12, addElement: 100 } },
      { level: 3, effects: { addAttack: 14, addElement: 120 } },
      { level: 4, effects: { addAttack: 16, addElement: 160 } },
      { level: 5, effects: { addAttack: 18, addElement: 200 } }
    ],
    requirements: ["skillBurstEnabled"],
    order: 602
  },
  burstImproved: {
    label: "連撃強化",
    levels: [
      { level: 1, effects: { addAttack: 3 } },
      { level: 2, effects: { addAttack: 10 } },
    ],
    requirements: ["skillBurstActive"],
    order: 603
  },
  goreMagalasTyranny: {
    label: "黒蝕一体",
    levels: [
      { level: 1, effects: { addAttack: 0 } },
      { level: 2, effects: { addAttack: 10 } },
    ],
    accompanies: ["goreMagalasTyranny2"],
    order: 302
  },
  goreMagalasTyranny2: {
    label: "黒蝕一体_克服状態",
    levels: [
      { level: 1, effects: { addAttack: 0, addAffinity: 15 } },
      { level: 2, effects: { addAttack: 5, addAffinity: 15 } },
    ],
    requirements: ["frenzyRecovered"],
    order: 302,
    hidden: true
  },
  antivirus: {
    label: "無我の境地",
    levels: [
      { level: 1, effects: { addAffinity: 3 } },
      { level: 2, effects: { addAffinity: 6 } },
      { level: 3, effects: { addAffinity: 10 } }
    ],
    requirements: ["frenzyRecovered"],
    order: 303,
  },
  elementAttack: {
    label: "属性攻撃強化",
    levels: [
      { level: 1, effects: { addElement: 40 } },
      { level: 2, effects: { addElement: 50, multiplyElement: 1.1 } },
      { level: 3, effects: { addElement: 60, multiplyElement: 1.2 } },
    ],
    requirements: ["elementTypeIsWeapon"],
    order: EFFECT_ORDER_ELEMENTATTACK
  },
  elementAttackFire: {
    label: "火属性攻撃強化",
    levels: [
      { level: 1, effects: { addElement: 40 } },
      { level: 2, effects: { addElement: 50, multiplyElement: 1.1 } },
      { level: 3, effects: { addElement: 60, multiplyElement: 1.2 } },
    ],
    requirements: ["elementTypeIsFire"],
    order: EFFECT_ORDER_ELEMENTATTACK
  },
  criticalElement: {
    label: "会心撃【属性】",
    levels: [
      { level: 1, effects: { setCritFactor: 1.07 } },
      { level: 2, effects: { setCritFactor: 1.14 } },
      { level: 3, effects: { setCritFactor: 1.21 } },
    ],
    requirements: ["critical"],
    order: EFFECT_ORDER_CRITICAL + 1
  },
  coalescence: {
    label: "災禍転福",
    levels: [
      { level: 1, effects: { multiplyElement: 1.1 } },
      { level: 2, effects: { multiplyElement: 1.2 } },
      { level: 3, effects: { multiplyElement: 1.3 } },
    ],
    requirements: ["coalescenceEnabled"],
    order: 202
  },
  whiteflame: {
    label: "白熾の奔流",
    levels: [
      { level: 1, effects: { additionalHit: { fixedDamage: 50 } } },
    ],
    order: 800
  },
  whiteflameFlare: {
    label: "白熾＋灼熱化",
    levels: [
      { level: 1, effects: { additionalHit: { fixedDamage: 60, elementType: "fire", elementValue: 300 } } },
      { level: 2, effects: { additionalHit: { fixedDamage: 80, elementType: "fire", elementValue: 800 } } },
    ],
    order: 800
  }
} as const;

export type SkillKey = keyof typeof SKILL_DATA & string;
