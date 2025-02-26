import { WeaponStats } from '@/models/types/weapon';
import { SelectedTarget } from '@/models/types/target';
import { Motion, SelectedMotion } from '@/models/types/motion';
import { SelectedSkill } from '@/models/constants/skill';
import { ConditionValues } from '@/atoms/conditionAtoms';
import { calculatePhysicalDamages } from './physicalDamageCalculator';
import { calculateElementalDamages } from './elementalDamageCalculator';

interface DamageBreakdown {
  total: number;
  physical: number;
  elemental: number;
}

export interface CalculationResults {
  minDamage: DamageBreakdown;
  maxDamage: DamageBreakdown;
  expectedDamage: DamageBreakdown;
  dps: number;
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

  // モーションとターゲットの組み合わせごとのダメージを計算してターゲットの割合で加重平均＆合算
  const damages = params.selectedMotions.flatMap(selectedMotion => {
    if (!selectedMotion.motion) {
      return [{
        physical: { min: 0, max: 0, expected: 0 },
        elemental: { min: 0, max: 0, expected: 0 }
      }];
    }
    return params.selectedTargets.map(target => {
      const singleMotionAndTargetParams: SingleMotionAndTargetParams = {
        weaponStats: params.weaponStats,
        selectedSkills: params.selectedSkills,
        selectedBuffs: params.selectedBuffs,
        selectedTarget: target,
        motion: selectedMotion.motion!, // motionは1つ上のmap時点でnullチェック済み
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
    });
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
    minDamage: {
      total: damages.physical.min + damages.elemental.min,
      physical: damages.physical.min,
      elemental: damages.elemental.min
    },
    maxDamage: {
      total: damages.physical.max + damages.elemental.max,
      physical: damages.physical.max,
      elemental: damages.elemental.max
    },
    expectedDamage: {
      total: damages.physical.expected + damages.elemental.expected,
      physical: damages.physical.expected,
      elemental: damages.elemental.expected
    },
    dps: calculateDPS(damages.physical.expected + damages.elemental.expected, params.selectedMotions)
  };
}

// DPS
function calculateDPS(expectedDamage: number, selectedMotions: SelectedMotion[]): number {
    return 80;
}