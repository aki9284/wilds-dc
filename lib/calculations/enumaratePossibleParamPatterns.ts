import _ from 'lodash';
import { SingleHitParams } from "./damageCalculator";

export interface PossibleParamPattern {
    params: SingleHitParams, 
    possibility: number
}

export function enumeratePossibleParamPatterns(params: SingleHitParams): PossibleParamPattern[] {
    let patterns: PossibleParamPattern[] = [];

    // conditionValuesからありうる発動中スキルの組み合わせと確率を列挙

    // 会心

    if (params.motion.cannotCrit !== undefined && params.motion.cannotCrit) {
        patterns.push({params:params, possibility:1.0});
    } else {
        let critRate = params.weaponStats.affinity/100;
        const critParams = _.cloneDeep(params);
        critParams.critical = 1;
        
        // ToDo: 会心率上昇に関するスキル・バフを考慮してパターン分け
        patterns.push({params:params, possibility:1.0 - critRate});
        patterns.push({params:critParams, possibility:critRate});
    }

    return patterns;
}