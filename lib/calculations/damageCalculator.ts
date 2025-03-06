import { WeaponStats } from '@/models/types/weapon';
import { SelectedTarget } from '@/models/types/target';
import { Motion, SelectedMotion } from '@/models/types/motion';
import { SelectedSkill } from '@/models/constants/skill';
import { ConditionValues } from '@/models/atoms/conditionAtoms';
import { calculatePhysicalDamages } from './physicalDamageCalculator';
import { calculateElementalDamages } from './elementalDamageCalculator';

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

export interface SingleMotionAndTargetParams {
  weaponStats: WeaponStats;
  selectedSkills: SelectedSkill[];
  selectedBuffs: string[];
  selectedTarget: SelectedTarget;
  motion: Motion;
  conditionValues: ConditionValues;
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
      const singleMotionAndTargetParams: SingleMotionAndTargetParams = {
        weaponStats: params.weaponStats,
        selectedSkills: params.selectedSkills,
        selectedBuffs: params.selectedBuffs,
        selectedTarget: target,
        motion: selectedMotion.motion!, //モーションは1つ上のmapでnullチェック済み
        conditionValues: params.conditionValues
      };
      const physical = calculatePhysicalDamages(singleMotionAndTargetParams);
      const elemental = calculateElementalDamages(singleMotionAndTargetParams);

      return {
        physical: {
          min: physical.min * (target.percentage / totalPercentage),
          max: physical.max * (target.percentage / totalPercentage),
          expected: physical.expected * (target.percentage / totalPercentage)
        },
        elemental: {
          min: elemental.min * (target.percentage / totalPercentage),
          max: elemental.max * (target.percentage / totalPercentage),
          expected: elemental.expected * (target.percentage / totalPercentage)
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