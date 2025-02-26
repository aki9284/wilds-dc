export type SkillEffect = {
  addAttack?: number;
  addAffinity?: number;
  addAffinity2?: number;  // 弱点特効の第2条件時などに使用
  setCritFactor?: number;
  multiplyAttack?: number;
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
  }
} as const;

export type SkillKey = keyof typeof SKILL_DATA;
