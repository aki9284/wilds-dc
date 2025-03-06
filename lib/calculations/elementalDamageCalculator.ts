import { getCachedMonsterData } from "@/utils/dataFetch";
import { SingleMotionAndTargetParams } from "./damageCalculator";
import { SKILL_DATA, SkillKey } from "@/models/constants/skill";
import { BUFF_DATA, BuffKey } from "@/models/constants/buff";
import { SHARPNESS_DATA } from "@/models/constants/sharpness";

// 属性ダメージ
export function calculateElementalDamages(params: SingleMotionAndTargetParams): { min: number, max: number, expected: number }{
    if (params.weaponStats.elementType === 'none') {
        return { min: 0, max: 0, expected: 0 };
    }

    const elementalValue = calculateElementalValue(params);
    const effectiveness = calculateElementalEffectiveness(params);
    const modifier = calculateElementalDamageModifier(params);

    console.log(elementalValue, effectiveness, modifier);

    return {
        min: Math.round(elementalValue.min/10 * effectiveness.min/100 * modifier.min * 10) / 10,
        max: Math.round(elementalValue.max/10 * effectiveness.max/100 * modifier.max * 10) / 10,
        expected: Math.round(elementalValue.expected/10 * effectiveness.expected/100 * modifier.expected * 10) / 10
    };
}



// 属性値
function calculateElementalValue(params: SingleMotionAndTargetParams): { min: number, max: number, expected: number } {
    let elementValue = params.weaponStats.elementValue;
    if (params.motion.elementValueOverride !== undefined && params.motion.elementValueOverride !== null) {
        elementValue = params.motion.elementValueOverride;
    }
    
    // スキルによる属性値加算と乗算
    params.selectedSkills.forEach(selectedSkill => {
        const skill = SKILL_DATA[selectedSkill.skillKey as SkillKey];
        const skillLevel = skill.levels[selectedSkill.level - 1];
        if ('addElement' in skillLevel.effects) {
            elementValue += skillLevel.effects.addElement;
        }
        if ('multiplyElement' in skillLevel.effects && typeof skillLevel.effects.multiplyElement === 'number') {
            elementValue = Math.round(elementValue * skillLevel.effects.multiplyElement * 10) / 10;
        }
    });

    // バフによる属性値加算と乗算
    params.selectedBuffs.forEach(buffKey => {
        const buff = BUFF_DATA[buffKey as BuffKey];
        if ('addElement' in buff && typeof buff.addElement === 'number') {
            elementValue += buff.addElement;
        }
        if ('multiplyElement' in buff) {
            elementValue = Math.round(elementValue * buff.multiplyElement * 10) / 10;
        }
    });

    return {
        min: elementValue,
        max: elementValue,
        expected: elementValue
    };
}

// 属性肉質
function calculateElementalEffectiveness(params: SingleMotionAndTargetParams): { min: number, max: number, expected: number } {
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

    const damageType = params.weaponStats.elementType;
    if (damageType === 'none') {
        throw new Error(`Elemental damage type is none`);
    }
    const effectiveness = part.effectiveness[damageType];

    return {
        min: effectiveness,
        max: effectiveness,
        expected: effectiveness
    };
}

// 属性ダメージ補正
function calculateElementalDamageModifier(params: SingleMotionAndTargetParams): { min: number, max: number, expected: number } {

    // 斬れ味補正
    const sharpness = params.weaponStats.sharpness;
    let sharpnessModifier = SHARPNESS_DATA[sharpness].elemental;
    if (params.motion.ignoreSharpness !== undefined && params.motion.ignoreSharpness) {
        sharpnessModifier = 1.0;
    }

    // モーションによる属性補正
    let motionModifier = 1.0;
    if (params.motion.multiplyElement !== undefined && params.motion.multiplyElement !== null) {
        motionModifier = params.motion.multiplyElement;
    }

    // 全体防御率
    const totalDefenseModifier = params.conditionValues.damageCut/100;
    
    return {
        min: sharpnessModifier * motionModifier * totalDefenseModifier,
        max: sharpnessModifier * motionModifier * totalDefenseModifier,
        expected: sharpnessModifier * motionModifier * totalDefenseModifier
    };
}