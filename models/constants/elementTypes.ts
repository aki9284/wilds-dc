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
