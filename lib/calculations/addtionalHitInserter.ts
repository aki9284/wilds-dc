import { SKILL_DATA } from "@/models/constants/skill";
import { CalculationParams } from "./damageCalculator";

// 選択されたモーションリストにスキルなどを加味して追加ヒットを挿入する
export function insertAdditionalHits(params: CalculationParams): CalculationParams {
    const newSelectedMotions = [...params.selectedMotions];
    const additionalHitMotions: CalculationParams[] = [];

    // 白熾の奔流
    const whiteflameSkill = params.selectedSkills.find(skill => skill.skillKey === "whiteflameFlare") ||
                            params.selectedSkills.find(skill => skill.skillKey === "whiteflame");
                            
    if (whiteflameSkill) {
        let whiteflameCoolTime = 0;
        const additionalHitStats = SKILL_DATA[whiteflameSkill?.skillKey].levels[whiteflameSkill?.level - 1].effects.additionalHit;
        if (!additionalHitStats) {
            throw new Error("白熾の奔流スキルに追加ヒットのパラメータが設定されていません。");
        };

        // 追加ヒットの条件を満たすモーションを探す
        for (const selectedMotion of params.selectedMotions) {
            if (!selectedMotion.motion) continue;
            const motion = selectedMotion.motion;
    
            if (motion.cannotTriggerWhiteflame !== true && whiteflameCoolTime <= 0) {
                additionalHitMotions.push({
                    ...params,
                    selectedMotions: [{
                        ...selectedMotion,
                        motion: { 
                            "weaponType": motion.weaponType, 
                            "name": "白熾の奔流", 
                            "value": 0,
                            "damageType": motion.damageType, // 使わないと思うが一旦元のmotionから引き継ぎにしておく
                            "motionTime": 0,
                            "ignoreSharpness": true, // 追加ヒットは斬れ味無視
                            "cannotCrit": true, // 追加ヒットは会心無効
                            "fixedPhysicalDamage": additionalHitStats.fixedDamage,
                            "fixedElementalDamage": additionalHitStats.elementType === undefined ? 0 : undefined, // 属性設定が無ければ固定0、あればOverride設定で計算させる
                            "elementTypeOverride": additionalHitStats.elementType,
                            "elementValueOverride": additionalHitStats.elementValue,
                            "skipRate": 0.5 // 判定があっても1/2で発生しない
                        }
                    }]
                });
                // 追加ヒットを入れたらクールタイムに入る
                // クールタイムは約3秒だがこのモーション自体の時間も減った状態で次のモーションに移る
                // （厳密にはモーション全体時間-モーション中の最初のhitまでの時間を差し引くのが正しいが一旦簡略化）
                whiteflameCoolTime = 3 - selectedMotion.motion.motionTime;
            } else {
                // 追加ヒットを入れられないときはクールタイムだけ減らす
                whiteflameCoolTime = Math.max(0, whiteflameCoolTime - selectedMotion.motion.motionTime);
            }
            console.log("whiteflameCoolTime:", whiteflameCoolTime);
        }
    }
        

    // 追加ヒットのモーションを挿入
    newSelectedMotions.push(...additionalHitMotions.map(hit => hit.selectedMotions[0]));

    return {
        ...params,
        selectedMotions: newSelectedMotions
    };
}