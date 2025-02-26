import { SingleMotionAndTargetParams } from "./damageCalculator";

// 属性ダメージ
export function calculateElementalDamages(params: SingleMotionAndTargetParams): { min: number, max: number, expected: number }{
    return {
        min: calculateElementalValue(params).min * calculateElementalEffectiveness(params).min * calculateElementalDamageModifier(params).min,
        max: calculateElementalValue(params).max * calculateElementalEffectiveness(params).max * calculateElementalDamageModifier(params).max,
        expected: calculateElementalValue(params).expected * calculateElementalEffectiveness(params).expected * calculateElementalDamageModifier(params).expected
    };
}



// 属性値
function calculateElementalValue(params: SingleMotionAndTargetParams): { min: number, max: number, expected: number } {
    return {
        min: params.weaponStats.elementValue,
        max: params.weaponStats.elementValue,
        expected: params.weaponStats.elementValue
    };
}

// 属性肉質
function calculateElementalEffectiveness(params: SingleMotionAndTargetParams): { min: number, max: number, expected: number } {
    return {
        min: 10,
        max: 50,
        expected: 30
    };
}

// 属性ダメージ補正
function calculateElementalDamageModifier(params: SingleMotionAndTargetParams): { min: number, max: number, expected: number } {
    return {
        min: 1,
        max: 1,
        expected: 1
    };
}