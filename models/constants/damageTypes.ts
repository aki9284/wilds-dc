export type ElementType = {
  label: string;
};

export const ELEMENT_TYPES = {
  none: {
    label: "無"
  },
  fire: {
    label: "火"
  },
  water: {
    label: "水"
  },
  thunder: {
    label: "雷"
  },
  ice: {
    label: "氷"
  },
  dragon: {
    label: "龍"
  }
} as const;

export type ElementTypeKey = keyof typeof ELEMENT_TYPES;
export type ElementTypeLabel = typeof ELEMENT_TYPES[ElementTypeKey]['label'];

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