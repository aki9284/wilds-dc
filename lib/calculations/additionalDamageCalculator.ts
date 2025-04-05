import { getCachedMonsterData } from "@/utils/dataFetch";
import { SingleHitParams } from "./damageCalculator";
import { AddDamageParams, SelectedSkill, SKILL_DATA, SkillKey } from "@/models/constants/skill";
import { BUFF_DATA, BuffKey } from "@/models/constants/buff";
import { SHARPNESS_DATA } from "@/models/constants/sharpness";
import { DamageElemntTypeKey, isDamageElementType } from "@/models/constants/damageTypes";
import { calculateElementalDamage } from "./elementalDamageCalculator";
import _ from 'lodash';
import { EFFECT_ORDER_ELEMENTATTACK } from "@/models/constants/effectOrder";

// 灼熱化・白熾の奔流による追加ヒットのダメージ
// あくまで親となるモーションのダメージ計算後にそのときのステータス（スキル・バフ発動状況）ベースで計算したいので
// 親モーションの計算パラメータの一部を追加ヒット用に書き換える形で後から計算させる
export function calculateAdditionalDamage(params: SingleHitParams): number {

    // 追加ダメージを発生させるスキルが有効な場合、そのダメージパラメータを先に取得しておく
    // 現状そのようなスキルは1個のみ対応（蝕攻に対応が難しい）
    let addDamageParams: AddDamageParams | undefined = undefined;
    params.activeEffects.forEach(effect => {
        const skill = effect.data as SelectedSkill;
        if (effect.type === 'skill' && SKILL_DATA[skill.skillKey].levels[skill.level - 1].effects.addDamage) {
            addDamageParams = SKILL_DATA[skill.skillKey].levels[skill.level - 1].effects.addDamage;
        }
    });

    // 追加ダメージのeffectが有効になっていない場合は0
    if (!addDamageParams) {
        return 0;
    }
    const addDamage: AddDamageParams = addDamageParams!;

    // 属性ダメージ計算用のパラメータをaddDamageの設定で書き換え
    const additionalHitParams = _.cloneDeep(params);

    // motionによる設定を追加ヒット専用に変更
    additionalHitParams.motion = { 
        "weaponType": additionalHitParams.motion.weaponType, 
        "name": "追加ヒット", 
        "value": 0,
        "damageType": additionalHitParams.motion.damageType, // 使わないと思うが一旦元のmotionから引き継ぎにしておく
        "duration": 0,
        "ignoreSharpness": true, // 追加ヒットは斬れ味無視
    };

    // 追加ヒットにcritはないため削除
    additionalHitParams.activeEffects = additionalHitParams.activeEffects.filter(effect => !(effect.type === 'critical')); 

    // 追加ヒットに属性が設定されている場合
    let elementalDamage = 0;
    if (addDamage.elementType && addDamage.elementValue) {
        // 元のparamsから属性が変更されている場合
        if (params.weaponStats.elementType !== addDamage.elementType) {
            additionalHitParams.weaponStats.elementType = addDamage.elementType;
            // 汎用の属性強化（武器属性の属性強化を意味する）がもしactiveEffectsに含まれていれば削除
            additionalHitParams.activeEffects = additionalHitParams.activeEffects.filter(effect => 
                !(effect.type === 'skill' && (effect.data as SelectedSkill).skillKey === 'elementAttack'));
        }
        additionalHitParams.weaponStats.elementValue = addDamage.elementValue;

        // 灼熱化で火属性強化を付けている場合activeEffectsに追加 ただし最初から火属性強化が含まれていればそれでよい
        if (addDamage.elementType === 'fire' && 
            !additionalHitParams.activeEffects.some(effect => effect.type === 'skill' && (effect.data as SelectedSkill).skillKey === 'elementAttackFire')) {
            const elementAttackFireSkill = additionalHitParams.selectedSkills.find(skill => skill.skillKey === 'elementAttackFire');
            if (elementAttackFireSkill) {
                additionalHitParams.activeEffects.push({
                    type: 'skill',
                    data: elementAttackFireSkill,
                    order: EFFECT_ORDER_ELEMENTATTACK,
                });
            }
        }

        // 追加削除があるのでeffectsのソートかけなおし
        additionalHitParams.activeEffects.sort((a, b) => a.order - b.order);

        elementalDamage = calculateElementalDamage(additionalHitParams);
    }

    return (addDamage.fixedDamage || 0) + elementalDamage;
}