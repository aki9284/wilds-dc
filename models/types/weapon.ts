import { SharpnessKey } from '../constants/sharpness';
import { ElementTypeKey } from '../constants/elementTypes';

export type WeaponType = 'GreatSword' | 'LongSword' | 'SwordAndShield' | 'DualBlades' | 'Hammer' | 'HuntingHorn' | 'Lance' | 'Gunlance' | 'SwitchAxe' | 'ChargeBlade' | 'InsectGlaive' | 'LightBowgun' | 'HeavyBowgun' | 'Bow';

export type WeaponStats = {
  attack: number;
  affinity: number;
  elementType: ElementTypeKey;
  elementValue: number;
  sharpness: SharpnessKey;
};