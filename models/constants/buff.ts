export const BUFF_DATA = {
    melodyAttackLarge: {
        "label": "攻撃力UP【大】",
        "multiplyAttack": 1.15
    },
    melodyAttackSmall: {
        "label": "攻撃力UP【小】",
        "multiplyAttack": 1.1
    },
    potionAttackLarge: {
        "label": "鬼人薬G",
        "addAttack": 15
    },
    potionAttackSmall:{
        "label": "鬼人薬",
        "addAttack": 10
    }
} as const;

export type BuffKey = keyof typeof BUFF_DATA