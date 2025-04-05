import { WeaponStats } from '@/models/types/weapon';
import { SelectedTarget } from '@/models/types/target';
import { Motion, SelectedMotion } from '@/models/types/motion';
import { AddDamageParams, SelectedSkill, SKILL_DATA } from '@/models/constants/skill';
import { ConditionValues } from '@/models/atoms/conditionAtoms';
import { calculatePhysicalDamage } from './physicalDamageCalculator';
import { calculateElementalDamage } from './elementalDamageCalculator';
import { enumeratePossibleParamPatterns } from './enumaratePossibleParamPatterns';
import { calculateAdditionalDamage } from './additionalDamageCalculator';

interface DamageBreakdown {
  total: number;
  physical: number;
  elemental: number;
  additional: number;
}

export interface MotionDamage {
  motion: Motion;
  minDamage: DamageBreakdown;
  maxDamage: DamageBreakdown;
  expectedDamage: DamageBreakdown;
}

export interface CalculationResults {
  minDamage: DamageBreakdown;
  maxDamage: DamageBreakdown;
  expectedDamage: DamageBreakdown;
  dps: number;
  motionDamages: MotionDamage[];
}

export interface CalculationParams {
  weaponStats: WeaponStats;
  selectedSkills: SelectedSkill[];
  selectedBuffs: string[];
  selectedTargets: SelectedTarget[];
  selectedMotions: SelectedMotion[];
  conditionValues: ConditionValues;
}

export interface Effect {
  type: string, 
  data: SelectedSkill | string | undefined, 
  order: number
}

export interface SingleHitParams {
  weaponStats: WeaponStats;
  selectedSkills: SelectedSkill[];
  selectedBuffs: string[];
  selectedTarget: SelectedTarget;
  motion: Motion;
  conditionValues: ConditionValues;
  activeEffects: Effect[];
}

// ダメージ計算 UIからの呼び出し口
export function calculateDamage(params: CalculationParams): CalculationResults {
  const totalPercentage = params.selectedTargets.reduce((sum, target) => sum + target.percentage, 0);

  // モーションごとにダメージ計算
  const motionDamages: MotionDamage[] = params.selectedMotions.map(selectedMotion => {
    if (!selectedMotion.motion) {
      return {
        motion: selectedMotion.motion!,
        minDamage: { total: 0, physical: 0, elemental: 0, additional: 0 },
        maxDamage: { total: 0, physical: 0, elemental: 0, additional: 0 },
        expectedDamage: { total: 0, physical: 0, elemental: 0, additional: 0 }
      };
    }

    // ターゲット部位の割合に応じた加重平均
    const motionDamage = params.selectedTargets.map(target => {
      const singleHitParams: SingleHitParams = {
        weaponStats: params.weaponStats,
        selectedSkills: params.selectedSkills,
        selectedBuffs: params.selectedBuffs,
        selectedTarget: target,
        motion: selectedMotion.motion!, //モーションは1つ上のmapでnullチェック済み
        conditionValues: params.conditionValues,
        activeEffects: [] // この配列は後で組み合わせ列挙したときに埋まる
      };

      // 実際にありうる会心・スキル等発動パターンとその確率を列挙しそれを加重平均
      const paramPatterns = enumeratePossibleParamPatterns(singleHitParams);
      console.log(paramPatterns);

      let minTotal = Infinity;
      let maxTotal = -Infinity;
      let minPhysical = 0;
      let minElemental = 0;
      let minAdditional = 0;
      let maxPhysical = 0;
      let maxElemental = 0;
      let maxAdditional = 0;
      let expectedPhysical = 0;
      let expectedElemental = 0;
      let expectedAdditional = 0;

      paramPatterns.forEach(pattern => {
        const physical = calculatePhysicalDamage(pattern.params);
        const elemental = calculateElementalDamage(pattern.params);
        const additional = calculateAdditionalDamage(pattern.params);
        const total = physical + elemental + additional;

        if (total < minTotal && pattern.possibility > 0) {
          minTotal = total;
          minPhysical = physical;
          minElemental = elemental;
          minAdditional = additional;
        }

        if (total > maxTotal && pattern.possibility > 0) {
          maxTotal = total;
          maxPhysical = physical;
          maxElemental = elemental;
          maxAdditional = additional;
        }

        expectedPhysical += physical * pattern.possibility;
        expectedElemental += elemental * pattern.possibility;
        expectedAdditional += additional * pattern.possibility;
      });

      return {
        physical: {
          min: minPhysical * (target.percentage / totalPercentage),
          max: maxPhysical * (target.percentage / totalPercentage),
          expected: expectedPhysical * (target.percentage / totalPercentage)
        },
        elemental: {
          min: minElemental * (target.percentage / totalPercentage),
          max: maxElemental * (target.percentage / totalPercentage),
          expected: expectedElemental * (target.percentage / totalPercentage)
        },
        additional: {
          min: minAdditional * (target.percentage / totalPercentage),
          max: maxAdditional * (target.percentage / totalPercentage),
          expected: expectedAdditional * (target.percentage / totalPercentage)
        }
      };
    }).reduce((acc, curr) => ({
      physical: {
        min: acc.physical.min + curr.physical.min,
        max: acc.physical.max + curr.physical.max,
        expected: acc.physical.expected + curr.physical.expected
      },
      elemental: {
        min: acc.elemental.min + curr.elemental.min,
        max: acc.elemental.max + curr.elemental.max,
        expected: acc.elemental.expected + curr.elemental.expected
      },
      additional: {
        min: acc.additional.min + curr.additional.min,
        max: acc.additional.max + curr.additional.max,
        expected: acc.additional.expected + curr.additional.expected
      }
    }), {
      physical: { min: 0, max: 0, expected: 0 },
      elemental: { min: 0, max: 0, expected: 0 },
      additional: { min: 0, max: 0, expected: 0 }
    });

    return {
      motion: selectedMotion.motion!,
      minDamage: {
        total: Math.round((motionDamage.physical.min + motionDamage.elemental.min + motionDamage.additional.min) * 10) / 10,
        physical: motionDamage.physical.min,
        elemental: motionDamage.elemental.min,
        additional: motionDamage.additional.min
      },
      maxDamage: {
        total: Math.round((motionDamage.physical.max + motionDamage.elemental.max + motionDamage.additional.max) * 10) / 10,
        physical: motionDamage.physical.max,
        elemental: motionDamage.elemental.max,
        additional: motionDamage.additional.max
      },
      expectedDamage: {
        total: Math.round((motionDamage.physical.expected + motionDamage.elemental.expected + motionDamage.additional.expected) * 10) / 10,
        physical: motionDamage.physical.expected,
        elemental: motionDamage.elemental.expected,
        additional: motionDamage.additional.expected
      }
    };
  });

  const totalDamages = motionDamages.reduce((acc, curr) => ({
    physical: {
      min: acc.physical.min + curr.minDamage.physical,
      max: acc.physical.max + curr.maxDamage.physical,
      expected: acc.physical.expected + curr.expectedDamage.physical
    },
    elemental: {
      min: acc.elemental.min + curr.minDamage.elemental,
      max: acc.elemental.max + curr.maxDamage.elemental,
      expected: acc.elemental.expected + curr.expectedDamage.elemental
    },
    additional: {
      min: acc.additional.min + curr.minDamage.additional,
      max: acc.additional.max + curr.maxDamage.additional,
      expected: acc.additional.expected + curr.expectedDamage.additional
    }
  }), {
    physical: { min: 0, max: 0, expected: 0 },
    elemental: { min: 0, max: 0, expected: 0 },
    additional: { min: 0, max: 0, expected: 0 }
  });

  console.log(params, motionDamages);

  return {
    minDamage: {      
      total: Math.round((totalDamages.physical.min + totalDamages.elemental.min + totalDamages.additional.min) * 10) / 10,
      physical: Math.round(totalDamages.physical.min * 10) / 10,
      elemental: Math.round(totalDamages.elemental.min * 10) / 10,
      additional: Math.round(totalDamages.additional.min * 10) / 10
    },
    maxDamage: {
      total: Math.round((totalDamages.physical.max + totalDamages.elemental.max + totalDamages.additional.max) * 10) / 10,
      physical: Math.round(totalDamages.physical.max * 10) / 10,
      elemental: Math.round(totalDamages.elemental.max * 10) / 10,
      additional: Math.round(totalDamages.additional.max * 10) / 10
    },
    expectedDamage: {
      total: Math.round((totalDamages.physical.expected + totalDamages.elemental.expected + totalDamages.additional.expected) * 10) / 10,
      physical: Math.round(totalDamages.physical.expected * 10) / 10,
      elemental: Math.round(totalDamages.elemental.expected * 10) / 10,
      additional: Math.round(totalDamages.additional.expected * 10) / 10
    },
    dps: calculateDPS(totalDamages.physical.expected + totalDamages.elemental.expected + totalDamages.additional.expected, params.selectedMotions),
    motionDamages
  };
}

// DPS
function calculateDPS(expectedDamage: number, selectedMotions: SelectedMotion[]): number {
    return 0;
}