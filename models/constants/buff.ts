export const BUFF_DATA = {
    melodySelfBoost: {
        "label": "自分強化",
        "multiplyAttack": 1.2
    },
    melodyAttackLarge: {
        "label": "攻撃力UP【大】",
        "multiplyAttack": 1.1
    },
    melodyAttackSmall: {
        "label": "攻撃力UP【小】",
        "multiplyAttack": 1.05
    },
    melodyElementBoost: {
        "label": "属性攻撃力UP",
        "multiplyElement": 1.1
    },
    powercharm: {
        "label": "力の護符",
        "addAttack": 6
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