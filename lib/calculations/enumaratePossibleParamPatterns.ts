import _ from 'lodash';
import { Effect, SingleHitParams } from "./damageCalculator";
import { AddDamageParams, SelectedSkill, SKILL_DATA, SkillKey } from '@/models/constants/skill';
import { BUFF_DATA, BuffKey } from '@/models/constants/buff';
import { CONDITION_LABELS } from '@/models/constants/conditionLabels';
import { EFFECT_ORDER_CRITICAL } from '@/models/constants/effectOrder';
import { getCachedMonsterData } from '@/utils/dataFetch';

export interface PossibleParamPattern {
    params: SingleHitParams, 
    possibility: number,
}

export function enumeratePossibleParamPatterns(params: SingleHitParams): PossibleParamPattern[] {
    const patterns: PossibleParamPattern[] = [];

    // 付く可能性のあるスキルとバフに加えてクリティカル判定をまとめてeffectとし、orderでソート
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

    // バフが他と同時だと無効化する（disablesプロパティ持ち）場合ここで削除
    effects.forEach((effect, index) => {
        if (effect.type === 'buff') {
            const buff = BUFF_DATA[effect.data as BuffKey];
            if (buff.disables) {
                // disablesで指定されたBuffKeyを持つeffectを削除
                const disabledIndices = effects
                    .map((e, i) => e.type === 'buff' && buff.disables?.includes(e.data as BuffKey) ? i : -1)
                    .filter(i => i !== -1);
                
                // 後ろから削除することで、インデックスがずれるのを防ぐ
                disabledIndices.reverse().forEach(i => {
                    effects.splice(i, 1);
                });
            }
        }
    });

    // 付随スキルとして表現しているものがある場合もここで追加 付随スキルのレベルは元と一致させる
    params.selectedSkills.forEach(skill => {
        const skillData = SKILL_DATA[skill.skillKey as SkillKey];
        if (skillData && skillData.accompanies !== undefined) {
            skillData.accompanies.forEach(accompanySkill => {
                effects.push({
                    type: 'skill',
                    data: { skillKey: accompanySkill, level: skill.level } as SelectedSkill,
                    order: SKILL_DATA[accompanySkill as SkillKey].order
                });
            });
        }
    });

    // 会心判定の追加
    if (params.motion.cannotCrit !== undefined && params.motion.cannotCrit) {
        // 会心乗らないモーションはクリティカルのeffectを組み合わせに入れないことで表現
    } else {
        effects.push({
            type: 'critical',
            data: '',
            order: EFFECT_ORDER_CRITICAL
        });
    }

    effects.sort((a, b) => a.order - b.order);

    const effectCombinations: {effects: Effect[], possibility: number}[] = [];
    generateEffectCombinations(effects, 0, [], effectCombinations, 1.0, params);
       
    effectCombinations.forEach(effectCombination => {
        const newPrams = _.cloneDeep(params);
        newPrams.activeEffects = effectCombination.effects;
        patterns.push({params: newPrams, possibility: effectCombination.possibility});
    });

    return patterns;
}

// スキル・バフの組み合わせを再帰的に列挙
// 特定の順番にactive判定しないとおかしくなるものがあればeffectsがその順番で並んでいる前提とする
// 特にcriticalはorderで制御されており、criticalのeffectに差しかかかったタイミングでcritかそうでないかに分岐させてよいものとする
//
// effects: スキル・バフのリスト
// index: 現在処理中のスキル・バフのインデックス
// currentCombination: 現在の組み合わせ
// combinations: 出力用、effectsの中でactiveになっているもののリストとその組み合わせの発生確率のペア配列
// basePossibility: 現在の組み合わせの確率（初期値は1を入力）
// params: 計算設定全体 発動判定に色々使うのでとりあえず渡しておくがこの中では変更しない
function generateEffectCombinations(
    effects: Effect[], 
    index: number, 
    currentCombination: Effect[], 
    combinations: {effects: Effect[], possibility: number}[],
    basePossibility: number,
    params: SingleHitParams,
): void {
    if (index === effects.length) {
        combinations.push({effects: currentCombination, possibility: basePossibility});
        return;
    }
    const effect = effects[index];

    // 現在のスキル・バフが前提条件持ちかを判定
    let requirements: string[] =  [];
    if (effect.type === 'skill') {
        const skill = SKILL_DATA[(effect.data as SelectedSkill).skillKey as SkillKey];
        if (skill.requirements !== undefined) {
            requirements = skill.requirements;
        }
    } else if (effect.type === 'buff') {
        const buff = BUFF_DATA[effect.data as BuffKey];
        if (buff.requirements !== undefined) {
            requirements = buff.requirements;
        }
    }

    if (requirements.length > 0 || effect.type === 'critical') {
        // 前提条件がある場合はそのスキル・バフをactiveにした場合としない場合の2パターンを再帰的に列挙
        // 確率は2パターンに分散させる必要がある
        let newCombination = [...currentCombination, effect];
        let activePossibility: number = 1;
        let inactivePossibility: number = 0;
        // 会心判定の場合のみ、武器会心率とそこまでのスキル会心率上昇から会心をactiveにするか計算
        if (effect.type === 'critical') {
            activePossibility = (params.weaponStats.affinity + sumEffectAffinities(currentCombination, params))/100;
            // 会心率は-100～100％の範囲を出ないようにする
            if (activePossibility > 1) {
                activePossibility = 1;
            } else if (activePossibility < -1) {
                activePossibility = -1;
            }
            // マイナス会心の場合反転させて専用のeffectを代わりに挿入
            if (activePossibility < 0) {
                newCombination = [...currentCombination, {
                    type: 'negaCritical',
                    data: undefined,
                    order: EFFECT_ORDER_CRITICAL
                }];
                activePossibility = -activePossibility;
            }
            inactivePossibility = 1 - activePossibility;
        } else {
            activePossibility = calcEffectPossibility(requirements, currentCombination, params);
            inactivePossibility = 1 - activePossibility;
        }
        
        // もし片方の組み合わせの確率が1になるならそちらだけ列挙すればよい 一応浮動小数点誤差対策で0<x<1と0<で判定しているが不要かも
        if (activePossibility < 1 && activePossibility > 0) {
            generateEffectCombinations(effects, index + 1, newCombination, combinations, basePossibility * activePossibility, params);
            generateEffectCombinations(effects, index + 1, currentCombination, combinations, basePossibility * inactivePossibility, params);
        } else if (activePossibility > 0) { // つまりactivePossibilityが1の場合
            generateEffectCombinations(effects, index + 1, newCombination, combinations, basePossibility * activePossibility, params);
        } else { // つまりactivePossibilityが0の場合
            generateEffectCombinations(effects, index + 1, currentCombination, combinations, basePossibility * inactivePossibility, params);
        }
        return;
    } else {
        // 前提条件が無い場合はそのスキル・バフをactiveにした組み合わせのみ列挙し、確率はそのまま
        const newCombination = [...currentCombination, effect];
        generateEffectCombinations(effects, index + 1, newCombination, combinations, basePossibility, params);
        return;
    }
}

// 前提条件リストと現在activeにする想定のeffect、全体のparamsから前提条件を満たす確率を計算
function calcEffectPossibility(requirements: string[], currentCombination: Effect[], params: SingleHitParams): number {
    // conditionLabels に含まれる条件をチェック
    for (const requirement of requirements) {
        if (requirement in params.conditionValues) {
            const conditionLabel = CONDITION_LABELS[requirement as keyof typeof CONDITION_LABELS];
            const conditionValue = params.conditionValues[requirement as keyof typeof CONDITION_LABELS];

            // type が 'possibility' の場合、0～1の範囲に変換
            if (conditionLabel.type === 'possibility') {
                return conditionValue / 100;
            }

            return conditionValue;
        }
    }

    // 会心条件 それより前に'critical'のバフが組み合わせに入っている＝activeになっていれば発動、そうでなければ発動しない
    if (requirements.includes('critical')) {
        if (currentCombination.some(effect => { if (effect.type === 'critical') { return true;}})) {
            return 1.0;
        } else {
            return 0.0;
        };
    }

    // 設定できない特殊な前提条件たち ToDo: skill.tsの記述とこちらの条件名を揃えなければいけないのを改善したい
    // というか設定できるものも含めて単一条件しか今判定できないがせっかくrequirementsを配列にしているのでそれも組み合わせ展開すべき
    // 弱特
    if (requirements.includes('weakPart')) {
        const monsters = getCachedMonsterData()
        const monster = monsters.find(monster => monster.name === params.selectedTarget.monsterName);
        const monsterPart = monster?.parts.find(part => part.name === params.selectedTarget.partName);
        if (monsterPart !== undefined && monsterPart.effectiveness[params.motion.damageType] >= 45) {
            return 1.0;
        } else {
            return 0.0;
        }
    }
    // 連撃強化
    if (requirements.includes('skillBurstActive')) {
        // 連撃を武器ごとに分ける必要があるためskillKeyがburstHHなどになっているが、他武器対応するならここに条件追加が必要か
        if (currentCombination.some(effect => effect.type === 'skill' && (effect.data as SelectedSkill).skillKey === 'burstHH')) {
            return 1.0;
        } else {
            return 0.0;
        }
    }
    // 属性攻撃強化
    // 汎用の属性攻撃強化は利便性のためにこれを選べば武器属性に対応した属性攻撃強化として扱われることにしているが、
    // 特殊な攻撃で別属性が使われる場合に無効化したいため上書き属性が武器属性と異なる場合は無効
    if (requirements.includes('elementTypeIsWeapon')) {
        const weaponElementType = params.weaponStats.elementType;
        const motionElementType = params.motion.elementTypeOverride;
        if (motionElementType && motionElementType !== weaponElementType) {
            return 0.0;
        } else {
            return 1.0;
        }
    }

    // 火属性攻撃強化
    // 火属性武器or火属性上書モーションで、汎用の属性攻撃強化と重複して選んでいない場合のみ発動。
    // 灼熱化で武器属性側の属性強化と火属性強化を両方入れた場合に対応するため、火属性強化だけ別途設定できるようにしているが
    // 火属性武器で火属性強化と汎用の属性攻撃強化を両方選ばれたときに2重に計算されると困るため。
    if (requirements.includes('elementTypeIsFire')) {
        const isNormalElementAttackEnabled = currentCombination.some(effect => effect.type === 'skill' && (effect.data as SelectedSkill).skillKey === 'elementAttack');

        const elementType = params.motion.elementTypeOverride ?? params.weaponStats.elementType;
        if (elementType === 'fire' && !isNormalElementAttackEnabled) {
            return 1.0;
        } else {
            return 0.0;
        }
    }

    return 0;
}

// 指定したeffectの中で会心率上昇を含むものがあればそれを全て足した値を返す
function sumEffectAffinities(effects: Effect[], params:SingleHitParams): number {
    const monsters = getCachedMonsterData()

    let sum = 0;
    for (const effect of effects) {
        if (effect.type === 'skill') {
            const skill = SKILL_DATA[(effect.data as SelectedSkill).skillKey as SkillKey];
            const skillLevel = skill.levels[(effect.data as SelectedSkill).level - 1];
            if (skillLevel.effects.addAffinity !== undefined) {
                sum += skillLevel.effects.addAffinity;
            }
            // 弱点特効の傷で更に追加分専用処理  後で作った付随スキルの形式で表現するようにリファクタできそう
            if ((effect.data as SelectedSkill).skillKey === 'weaknessExploit') {
                const monster = monsters.find(monster => monster.name === params.selectedTarget.monsterName);
                if (monster !== undefined && monster.parts.some(part => part.name === params.selectedTarget.partName && part.wounded)) {
                    if (skillLevel.effects.addAffinity2 !== undefined) {
                        sum += skillLevel.effects.addAffinity2;
                    } else {
                        alert('弱点特効の傷追加分会心率が設定されていません');
                    }
                }
            }
        } else if (effect.type === 'buff') {
            const buff = BUFF_DATA[effect.data as BuffKey];
            if (buff.addAffinity !== undefined) {
                sum += buff.addAffinity;
            }
        }
    }
    return sum;
}