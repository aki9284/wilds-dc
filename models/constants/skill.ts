export type SkillEffect = {
  addAttack?: number;
  addAffinity?: number;
  addAffinity2?: number;  // 弱点特効の第2条件時などに使用
  setCritFactor?: number;
  multiplyAttack?: number;
  addElement?: number;
  multiplyElement?: number;
}

export type SkillLevel = {
  level: number;
  effects: SkillEffect;
}

export type Skill = {
  label: string;
  levels: SkillLevel[];
}

export interface SelectedSkill {
  skillKey: SkillKey
  level: number
}

export const SKILL_DATA = {
  attackBoost: {
    label: "攻撃",
    levels: [
      { level: 1, effects: { addAttack: 10 } },
      { level: 2, effects: { addAttack: 15 } },
      { level: 3, effects: { addAttack: 20 } },
      { level: 4, effects: { addAttack: 25 , multiplyAttack: 1.05 } },
      { level: 5, effects: { addAttack: 30 , multiplyAttack: 1.1 } },
    ]
  },
  criticalEye: {
    label: "見切り",
    levels: [
      { level: 1, effects: { addAffinity: 10 } },
      { level: 2, effects: { addAffinity: 20 } },
      { level: 3, effects: { addAffinity: 30 } },
      { level: 4, effects: { addAffinity: 40 } },
      { level: 5, effects: { addAffinity: 50 } }
    ]
  },
  criticalBoost: {
    label: "超会心",
    levels: [
      { level: 1, effects: { setCritFactor: 1.3 } },
      { level: 2, effects: { setCritFactor: 1.35 } },
      { level: 3, effects: { setCritFactor: 1.4 } }
    ]
  },
  weaknessExploit: {
    label: "弱点特効",
    levels: [
      { level: 1, effects: { addAffinity: 10, addAffinity2: 15 } },
      { level: 2, effects: { addAffinity: 15, addAffinity2: 20 } },
      { level: 3, effects: { addAffinity: 20, addAffinity2: 30 } }
    ]
  },
  peakPerformance: {
    label: "フルチャージ",
    levels: [
      { level: 1, effects: { addAttack: 3 } },
      { level: 2, effects: { addAttack: 6 } },
      { level: 3, effects: { addAttack: 10 } },
      { level: 4, effects: { addAttack: 15 } },
      { level: 5, effects: { addAttack: 20 } }
    ]
  },
  agitator: {
    label: "挑戦者",
    levels: [
      { level: 1, effects: { addAttack: 4 , addAffinity: 3 } },
      { level: 2, effects: { addAttack: 8 , addAffinity: 5 } },
      { level: 3, effects: { addAttack: 12, addAffinity: 7 } },
      { level: 4, effects: { addAttack: 16, addAffinity: 10 } },
      { level: 5, effects: { addAttack: 20, addAffinity: 15 } }
    ]
  },
  burstHH: {
    label: "連撃(笛)",
    levels: [
      { level: 1, effects: { addAttack: 10, addElement: 80} },
      { level: 2, effects: { addAttack: 12, addElement: 100 } },
      { level: 3, effects: { addAttack: 14, addElement: 120 } },
      { level: 4, effects: { addAttack: 16, addElement: 160 } },
      { level: 5, effects: { addAttack: 18, addElement: 200 } }
    ]
  },
  burstImproved:{
    label: "連撃強化",
    levels: [
      { level: 1, effects: { addAttack: 3 } },
      { level: 2, effects: { addAttack: 10 } },
    ]
  }
} as const;

export type SkillKey = keyof typeof SKILL_DATA;
