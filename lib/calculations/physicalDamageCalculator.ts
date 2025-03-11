import { SingleHitParams } from "./damageCalculator";
import { BUFF_DATA, BuffKey } from "@/models/constants/buff";
import { SelectedSkill, SKILL_DATA, SkillKey } from "@/models/constants/skill";
import { getCachedMonsterData } from '@/utils/dataFetch';
import { WeaponStats } from "@/models/types/weapon";
import { Monster } from "@/models/types/monster";
import { get } from "http";
import { SHARPNESS_DATA } from "@/models/constants/sharpness";

// 物理ダメージ
export function calculatePhysicalDamage(params: SingleHitParams): number {
    if (params.motion.fixedDamage !== undefined) {
        return params.motion.fixedDamage;
    }

    const attack = calculatePhysicalAttack(params);
    const effectiveness = calculatePhysicalEffectiveness(params);
    const modifier = calculatePhysicalDamageModifier(params);

    console.log(attack, effectiveness, modifier);

    return Math.round(attack * effectiveness/100 * modifier * 10) / 10;
}

// 物理攻撃力
function calculatePhysicalAttack(params: SingleHitParams): number {
      let physicalAttack = params.weaponStats.attack;

      params.activeEffects.forEach(effect => {
          if (effect.type === 'skill') {
              const skill = SKILL_DATA[(effect.data as SelectedSkill).skillKey as SkillKey];
              const skillLevel = skill.levels[(effect.data as SelectedSkill).level - 1];
              if (skillLevel.effects.multiplyAttack !== undefined) {
                //physicalAttack = Math.round(physicalAttack * skillLevel.effects.multiplyAttack * 10) / 10;
                //physicalAttack = physicalAttack * skillLevel.effects.multiplyAttack;
                //表示攻撃力は整数切り捨てだが内部は小数点1まで持っていないと計算が合わない それもroundではなくfloorに思われるが要追加検証
                physicalAttack = Math.floor(physicalAttack * skillLevel.effects.multiplyAttack * 10) / 10;
              }
              if (skillLevel.effects.addAttack !== undefined) {
                  physicalAttack += skillLevel.effects.addAttack;
              }
          } else if (effect.type === 'buff') {
              const buff = BUFF_DATA[effect.data as BuffKey];
              if (buff.multiplyAttack !== undefined) {
                //physicalAttack = Math.round(physicalAttack * buff.multiplyAttack * 10) / 10;
                physicalAttack = Math.floor(physicalAttack * buff.multiplyAttack * 10) / 10;
              }
              if (buff.addAttack !== undefined) {
                  physicalAttack += buff.addAttack;
              }
          }
      });

      return physicalAttack;
  }
  
// 物理肉質
function calculatePhysicalEffectiveness(params: SingleHitParams): number {
    // 肉質無視モーション
    if (params.motion.ignoreEffectiveness) {
        return 100;
    }

    const { monsterName, partName } = params.selectedTarget;
    const monstersData = getCachedMonsterData();
    const monster = monstersData.find(m => m.name === monsterName);

    if (!monster) {
      throw new Error(`Monster with name ${monsterName} not found`);
    }

    const part = monster.parts.find(p => p.name === partName);

    if (!part) {
      throw new Error(`Part with name ${partName} not found for monster ${monsterName}`);
    }

    const damageType = params.motion.damageType; // 例えば 'slash', 'impact', 'shot' など
    const effectiveness = part.effectiveness[damageType];

    return effectiveness;
}
  
// 物理ダメージ補正
function calculatePhysicalDamageModifier(params: SingleHitParams): number {
    const motionValueModifier = params.motion.value/100;

    // 斬れ味補正
    const sharpness = params.weaponStats.sharpness;
    let sharpnessModifier = SHARPNESS_DATA[sharpness].physical;
    if (params.motion.ignoreSharpness !== undefined && params.motion.ignoreSharpness) {
        sharpnessModifier = 1.0;
    }

    // 会心補正
    let critModifier = 1.0;
    if (params.activeEffects.some(effect => effect.type === 'critical')) {
        // 超会心専用処理
        const criticalBoostEffect = params.activeEffects.find(
            effect => effect.type === 'skill' && 
            (effect.data as SelectedSkill).skillKey === 'criticalBoost');
        if (criticalBoostEffect) {
            const skillLevel = SKILL_DATA['criticalBoost'].levels[(criticalBoostEffect.data as SelectedSkill).level - 1];
            critModifier = skillLevel.effects.setCritFactor || 1.25;
        } else {
            critModifier = 1.25;
        }
    } else if (params.activeEffects.some(effect => effect.type === 'negaCritical')) {
        critModifier = 0.75;
    }

    // 全体防御率
    const totalDefenseModifier = params.conditionValues.damageCut/100;

    return motionValueModifier * sharpnessModifier * critModifier * totalDefenseModifier;
}