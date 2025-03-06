import { SingleMotionAndTargetParams } from "./damageCalculator";
import { BUFF_DATA, BuffKey } from "@/models/constants/buff";
import { SelectedSkill, SKILL_DATA, SkillKey } from "@/models/constants/skill";
import { getCachedMonsterData } from '@/utils/dataFetch';
import { WeaponStats } from "@/models/types/weapon";
import { Monster } from "@/models/types/monster";
import { get } from "http";
import { SHARPNESS_DATA } from "@/models/constants/sharpness";

// 物理ダメージ
export function calculatePhysicalDamages(params: SingleMotionAndTargetParams): { min: number, max: number, expected: number } {
    const attack = calculatePhysicalAttacks(params);
    const effectiveness = calculatePhysicalEffectiveness(params);
    const modifier = calculatePhysicalDamageModifier(params);

    console.log(attack, effectiveness, modifier);

    return {
      min: Math.round(attack.min * effectiveness.min/100 * modifier.min * 10) / 10,
      max: Math.round(attack.max * effectiveness.max/100 * modifier.max * 10) / 10,
      expected: Math.round(attack.expected * effectiveness.expected/100 * modifier.expected * 10) /10
    };
}
  // 物理攻撃力
  function calculatePhysicalAttacks(params: SingleMotionAndTargetParams): { min: number, max: number, expected: number } {
      let physicalAttack = params.weaponStats.attack;

      // スキルとバフを統合したリストを作成し、orderプロパティを持たせる
      const effects = [
          ...params.selectedSkills.map(skill => ({
              type: 'skill',
              data: skill,
              order: SKILL_DATA[skill.skillKey as SkillKey].order
          })),
          ...params.selectedBuffs.map(buff => ({
              type: 'buff',
              data: buff,
              order: BUFF_DATA[buff as BuffKey].order
          }))
      ];

      // orderプロパティに基づいてソート
      effects.sort((a, b) => a.order - b.order);

      // ソートされたリストを基に計算を実行
      effects.forEach(effect => {
          if (effect.type === 'skill') {
              const skill = SKILL_DATA[(effect.data as SelectedSkill).skillKey as SkillKey];
              const skillLevel = skill.levels[(effect.data as SelectedSkill).level - 1];
              if ('multiplyAttack' in skillLevel.effects) {
                //physicalAttack = Math.round(physicalAttack * skillLevel.effects.multiplyAttack * 10) / 10;
                //physicalAttack = physicalAttack * skillLevel.effects.multiplyAttack;
                physicalAttack = Math.floor(physicalAttack * skillLevel.effects.multiplyAttack * 10) / 10;
              }
              if ('addAttack' in skillLevel.effects) {
                  physicalAttack += skillLevel.effects.addAttack;
              }
          } else if (effect.type === 'buff') {
              const buff = BUFF_DATA[effect.data as BuffKey];
              if ('multiplyAttack' in buff) {
                //physicalAttack = Math.round(physicalAttack * buff.multiplyAttack * 10) / 10;
                physicalAttack = Math.floor(physicalAttack * buff.multiplyAttack * 10) / 10;
              }
              if ('addAttack' in buff) {
                  physicalAttack += buff.addAttack;
              }
          }
      });

      return {
          min: physicalAttack,
          max: physicalAttack,
          expected: physicalAttack
      };
  }
  
// 物理肉質
function calculatePhysicalEffectiveness(params: SingleMotionAndTargetParams): { min: number, max: number, expected: number } {
    // 肉質無視モーション
    if (params.motion.ignoreEffectiveness) {
        return {
            min: 100,
            max: 100,
            expected: 100
        };
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

    return {
      min: effectiveness,
      max: effectiveness,
      expected: effectiveness
    };
}
  
// 物理ダメージ補正
function calculatePhysicalDamageModifier(params: SingleMotionAndTargetParams): { min: number, max: number, expected: number } {
    const motionValueModifier = params.motion.value/100;

    // 斬れ味補正
    const sharpness = params.weaponStats.sharpness;
    let sharpnessModifier = SHARPNESS_DATA[sharpness].physical;
    if (params.motion.ignoreSharpness !== undefined && params.motion.ignoreSharpness) {
        sharpnessModifier = 1.0;
    }

    // 会心補正 Todo:会心期待値計算
    let critModifierMin = 1;
    let critModifierEx = 1;
    let critModifierMax = 1;
    if (params.weaponStats.affinity > 0 && !params.motion.cannotCrit) {
        critModifierMax = 1.25;
    }

    // 全体防御率
    const totalDefenseModifier = params.conditionValues.damageCut/100;

    return {
      min: motionValueModifier * sharpnessModifier * critModifierMin * totalDefenseModifier,
      max: motionValueModifier * sharpnessModifier * critModifierMax * totalDefenseModifier,
      expected: motionValueModifier * sharpnessModifier * critModifierEx * totalDefenseModifier
    };
}