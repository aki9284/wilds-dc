export type Sharpness = {
    label: string;
    physical: number;
    elemental: number;
};

export const SHARPNESS_DATA = {
    red: {
      label: "赤",
      physical: 0.5,
      elemental: 0.25
    },
    orange: {
      label: "橙",
      physical: 0.75,
      elemental: 0.5
    },
    yellow: {
      label: "黄",
      physical: 1.0,
      elemental: 0.75
    },
    green: {
      label: "緑",
      physical: 1.05,
      elemental: 1.0
    },
    blue: {
      label: "青",
      physical: 1.2,
      elemental: 1.0625
    },
    white: {
      label: "白",
      physical: 1.32,
      elemental: 1.15
    },
    purple: {
      label: "紫",
      physical: 1.45,
      elemental: 1.2
    }
} as const;

export type SharpnessKey = keyof typeof SHARPNESS_DATA;
export type SharpnessLabel = typeof SHARPNESS_DATA[SharpnessKey]['label'];
