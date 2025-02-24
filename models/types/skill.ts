export interface SelectedSkill {
  name: string;
  level: number;
}

export interface SkillLevelEffect {
  level: number;
  addAttack?: number;
  addElement?: number;
  addAffinity?: number;
  addAffinity2?: number;
  multipyAttack?: number;
  multipyElement?: number;
  setCritFactor?: number;
}

export interface Skill {
  name: string;
  levels: SkillLevelEffect[];
}
