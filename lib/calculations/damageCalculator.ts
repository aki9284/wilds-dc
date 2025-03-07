import { WeaponStats } from '@/models/types/weapon';
import { SelectedTarget } from '@/models/types/target';
import { Motion, SelectedMotion } from '@/models/types/motion';
import { SelectedSkill } from '@/models/constants/skill';
import { ConditionValues } from '@/models/atoms/conditionAtoms';
import { calculatePhysicalDamage } from './physicalDamageCalculator';
import { calculateElementalDamage } from './elementalDamageCalculator';
import { enumeratePossibleParamPatterns } from './enumaratePossibleParamPatterns';

interface DamageBreakdown {
  total: number;
  physical: number;
  elemental: number;
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

export interface SingleHitParams {
  weaponStats: WeaponStats;
  selectedSkills: SelectedSkill[];
  selectedBuffs: string[];
  selectedTarget: SelectedTarget;
  motion: Motion;
  conditionValues: ConditionValues;
  critical: number; // 0:通常 正:会心 負:マイナス会心 
}

// ダメージ計算 UIからの呼び出し口
export function calculateDamage(params: CalculationParams): CalculationResults {
  const totalPercentage = params.selectedTargets.reduce((sum, target) => sum + target.percentage, 0);

  // モーションごとにダメージ計算
  const motionDamages: MotionDamage[] = params.selectedMotions.map(selectedMotion => {
    if (!selectedMotion.motion) {
      return {
        motion: selectedMotion.motion!,
        minDamage: { total: 0, physical: 0, elemental: 0 },
        maxDamage: { total: 0, physical: 0, elemental: 0 },
        expectedDamage: { total: 0, physical: 0, elemental: 0 }
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
        critical: 0
      };

      // 実際にありうる会心・スキル等発動パターンとその確率を列挙しそれを加重平均
      const paramPatterns = enumeratePossibleParamPatterns(singleHitParams);

      let minTotal = Infinity;
      let maxTotal = -Infinity;
      let minPhysical = 0;
      let minElemental = 0;
      let maxPhysical = 0;
      let maxElemental = 0;
      let expectedPhysical = 0;
      let expectedElemental = 0;

      paramPatterns.forEach(pattern => {
        const physical = calculatePhysicalDamage(pattern.params);
        const elemental = calculateElementalDamage(pattern.params);
        const total = physical + elemental;

        if (total < minTotal && pattern.possibility > 0) {
          minTotal = total;
          minPhysical = physical;
          minElemental = elemental;
        }

        if (total > maxTotal && pattern.possibility > 0) {
          maxTotal = total;
          maxPhysical = physical;
          maxElemental = elemental;
        }

        expectedPhysical += physical * pattern.possibility;
        expectedElemental += elemental * pattern.possibility;
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
      }
    }), {
      physical: { min: 0, max: 0, expected: 0 },
      elemental: { min: 0, max: 0, expected: 0 }
    });

    return {
      motion: selectedMotion.motion!,
      minDamage: {
        total: Math.round((motionDamage.physical.min + motionDamage.elemental.min) * 10) / 10,
        physical: motionDamage.physical.min,
        elemental: motionDamage.elemental.min
      },
      maxDamage: {
        total: Math.round((motionDamage.physical.max + motionDamage.elemental.max) * 10) / 10,
        physical: motionDamage.physical.max,
        elemental: motionDamage.elemental.max
      },
      expectedDamage: {
        total: Math.round((motionDamage.physical.expected + motionDamage.elemental.expected) * 10) / 10,
        physical: motionDamage.physical.expected,
        elemental: motionDamage.elemental.expected
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
    }
  }), {
    physical: { min: 0, max: 0, expected: 0 },
    elemental: { min: 0, max: 0, expected: 0 }
  });

  console.log(params, motionDamages);

  return {
    minDamage: {      
      total: Math.round((totalDamages.physical.min + totalDamages.elemental.min) * 10) / 10,
      physical: Math.round(totalDamages.physical.min * 10) / 10,
      elemental: Math.round(totalDamages.elemental.min * 10) / 10
    },
    maxDamage: {
      total: Math.round((totalDamages.physical.max + totalDamages.elemental.max) * 10) / 10,
      physical: Math.round(totalDamages.physical.max * 10) / 10,
      elemental: Math.round(totalDamages.elemental.max * 10) / 10
    },
    expectedDamage: {
      total: Math.round((totalDamages.physical.expected + totalDamages.elemental.expected) * 10) / 10,
      physical: Math.round(totalDamages.physical.expected * 10) / 10,
      elemental: Math.round(totalDamages.elemental.expected * 10) / 10
    },
    dps: calculateDPS(totalDamages.physical.expected + totalDamages.elemental.expected, params.selectedMotions),
    motionDamages
  };
}

// DPS
function calculateDPS(expectedDamage: number, selectedMotions: SelectedMotion[]): number {
    return 0;
}