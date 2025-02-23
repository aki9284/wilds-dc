export type WeaponType = 'GreatSword' | 'LongSword' | 'SwordAndShield' | 'DualBlades' | 'Hammer' | 'HuntingHorn' | 'Lance' | 'Gunlance' | 'SwitchAxe' | 'ChargeBlade' | 'InsectGlaive' | 'LightBowgun' | 'HeavyBowgun' | 'Bow';
export type WeaponStats = {
  attack: number;
  affinity: number;
  elementType: '無' | '火' | '水' | '雷' | '氷' | '龍';
  elementValue: number;
  // その他の武器ステータス
};
