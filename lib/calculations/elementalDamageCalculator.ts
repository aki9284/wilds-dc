import { getCachedMonsterData } from "@/utils/dataFetch";
import { SingleHitParams } from "./damageCalculator";
import { SelectedSkill, SKILL_DATA, SkillKey } from "@/models/constants/skill";
import { BUFF_DATA, BuffKey } from "@/models/constants/buff";
import { SHARPNESS_DATA } from "@/models/constants/sharpness";
import { DamageElemntTypeKey, isDamageElementType } from "@/models/constants/damageTypes";

// 属性ダメージ
export function calculateElementalDamage(params: SingleHitParams): number {
    if (!isDamageElementType(params.weaponStats.elementType)) {
        return 0;
    }

    const elementalValue = calculateElementalValue(params);
    const effectiveness = calculateElementalEffectiveness(params);
    const modifier = calculateElementalDamageModifier(params);

    console.log(elementalValue, effectiveness, modifier);

    return Math.round(elementalValue/10 * effectiveness/100 * modifier * 10) / 10;
}



// 属性値
function calculateElementalValue(params: SingleHitParams): number {
    let elementValue = params.weaponStats.elementValue;
    if (params.motion.elementValueOverride !== undefined && params.motion.elementValueOverride !== null) {
        elementValue = params.motion.elementValueOverride;
    }
    const elementValueMax = Math.max(elementValue + 350, elementValue * 1.9);

    params.activeEffects.forEach(effect => {
        if (effect.type === 'skill') {
            const skill = SKILL_DATA[(effect.data as SelectedSkill).skillKey as SkillKey];
            const skillLevel = skill.levels[(effect.data as SelectedSkill).level - 1];
            if (skillLevel.effects.multiplyElement !== undefined) {
                elementValue = Math.floor(elementValue * skillLevel.effects.multiplyElement * 10) / 10;
            }
            if (skillLevel.effects.addElement !== undefined) {
                elementValue += skillLevel.effects.addElement;
            }
        } else if (effect.type === 'buff') {
            const buff = BUFF_DATA[effect.data as BuffKey];
            if (buff.multiplyElement !== undefined) {
                elementValue = Math.floor(elementValue * buff.multiplyElement * 10) / 10;
            }
            if (buff.addElement !== undefined) {
                elementValue += buff.addElement;
            }
        }
    });

    return Math.min(elementValue, elementValueMax);
}

// 属性肉質
function calculateElementalEffectiveness(params: SingleHitParams): number {
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
    if (!isDamageElementType(damageType)) {
        throw new Error(`Element type is not valid: ${damageType}`);
    }
    const effectiveness = part.effectiveness[damageType];

    return effectiveness;
}

// 属性ダメージ補正
function calculateElementalDamageModifier(params: SingleHitParams): number {

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

    // 会心補正（属性会心のみ）
    let critModifier = 1.0;
    if (params.activeEffects.some(effect => effect.type === 'critical')) {
        const criticalElementEffect = params.activeEffects.find(
            effect => effect.type === 'skill' && 
            (effect.data as SelectedSkill).skillKey === 'criticalElement');
        if (criticalElementEffect) {
            const skillLevel = SKILL_DATA['criticalElement'].levels[(criticalElementEffect.data as SelectedSkill).level - 1];
            critModifier = skillLevel.effects.setCritFactor || 1;
        } else {
            critModifier = 1;
        }
    }

    // 全体防御率
    const totalDefenseModifier = params.conditionValues.damageCut/100;
    
    return sharpnessModifier * motionModifier * critModifier * totalDefenseModifier;
}