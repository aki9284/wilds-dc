import { getCachedMonsterData } from "@/utils/dataFetch";
import { SingleHitParams } from "./damageCalculator";
import { SelectedSkill, SKILL_DATA, SkillKey } from "@/models/constants/skill";
import { BUFF_DATA, BuffKey } from "@/models/constants/buff";
import { SHARPNESS_DATA } from "@/models/constants/sharpness";

// 属性ダメージ
export function calculateElementalDamage(params: SingleHitParams): number {
    if (params.weaponStats.elementType === 'none') {
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
            if ('multiplyElement' in skillLevel.effects) {
                elementValue = Math.floor(elementValue * skillLevel.effects.multiplyElement * 10) / 10;
            }
            if ('addElement' in skillLevel.effects) {
                elementValue += skillLevel.effects.addElement;
            }
        } else if (effect.type === 'buff') {
            const buff = BUFF_DATA[effect.data as BuffKey];
            if ('multiplyElement' in buff) {
                elementValue = Math.floor(elementValue * buff.multiplyElement * 10) / 10;
            }
            //属性値加算のバフが思いつかないのでコメントアウト
            //if ('addElement' in buff) {
            //    elementValue += buff.addElement;
            //}
        }
    });

    return elementValue;
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
    if (damageType === 'none') {
        throw new Error(`Elemental damage type is none`);
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

    // 全体防御率
    const totalDefenseModifier = params.conditionValues.damageCut/100;
    
    return sharpnessModifier * motionModifier * totalDefenseModifier;
}