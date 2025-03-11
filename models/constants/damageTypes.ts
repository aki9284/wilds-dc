export type ElementType = {
  label: string;
  abnormal: boolean;
};

export const ELEMENT_TYPES = {
  none: {
    label: "無",
    abnormal: false
  },
  fire: {
    label: "火",
    abnormal: false
  },
  water: {
    label: "水",
    abnormal: false
  },
  thunder: {
    label: "雷",
    abnormal: false
  },
  ice: {
    label: "氷",
    abnormal: false
  },
  dragon: {
    label: "龍",
    abnormal: false
  },
  poison: {
    label: "毒",
    abnormal: true
  },
  sleep: {
    label: "睡眠",
    abnormal: true
  },
  paralysis: {
    label: "麻痺",
    abnormal: true
  },
  blast: {
    label: "爆破",
    abnormal: true
  }
} as const;

export type ElementTypeKey = keyof typeof ELEMENT_TYPES;
export type ElementTypeLabel = typeof ELEMENT_TYPES[ElementTypeKey]['label'];

export type DamageElemntTypeKey = Exclude<ElementTypeKey, 'none' | 'poison' | 'sleep' | 'paralysis' | 'blast'>;
export function isDamageElementType(type: ElementTypeKey): type is DamageElemntTypeKey {
  return !ELEMENT_TYPES[type].abnormal && type !== 'none';
}

export type PhysicalType = {
  label: string;
};

export const PHYSICAL_TYPES = {
  slash: {
    label: "斬"
  },
  impact: {
    label: "打"
  },
  shot: {
    label: "弾"
  }
}

export type PhysicalTypeKey = keyof typeof PHYSICAL_TYPES;
export type PhysicalTypeLabel = typeof PHYSICAL_TYPES[PhysicalTypeKey]['label'];