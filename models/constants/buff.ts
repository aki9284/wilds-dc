export interface Buff {
    label: string;
    multiplyAttack?: number;
    multiplyElement?: number;
    addAttack?: number;
    addElement?: number;
    addAffinity?: number;
    requirements?: string[];
    disables?: BuffKey[];
    order: number;
}


export const BUFF_DATA: { [key: string]: Buff } = {
    melodySelfBoost: {
        "label": "自分強化",
        "multiplyAttack": 1.2,
        "order": 101
    },
    melodyAttackLarge: {
        "label": "攻撃力UP【大】",
        "multiplyAttack": 1.1,
        "order": 103
    },
    melodyAttackSmall: {
        "label": "攻撃力UP【小】",
        "multiplyAttack": 1.05,
        "order": 102
    },
    melodyElementBoost: {
        "label": "属性攻撃力UP",
        "multiplyElement": 1.1,
        "order": 104
    },
    melodyAffinityBoost: {
        "label": "会心率UP",
        "addAffinity": 15,
        "order": 105
    },
    echoBubbleAttackAndAffinity: {
        "label": "響玉: 攻撃力＆会心率UP",
        "multiplyAttack": 1.1,
        "addAffinity": 25,
        "order": 106
    },
    powercharm: {
        "label": "力の護符",
        "addAttack": 6,
        "order": 501
    },
    itemMegaDemonDrug: {
        "label": "鬼人薬G",
        "addAttack": 7,
        "order": 502,
        "disables": ["itemDemonDrug"]
    },
    itemDemonDrug: {
        "label": "鬼人薬",
        "addAttack": 5,
        "order": 503
    },
    itemMightSeed: {
        "label": "力の種",
        "addAttack": 10,
        "order": 506,
    },
    itemMightPill: {
        "label": "怪力の丸薬",
        "addAttack": 25,
        "order": 508,
        "disables": ["itemMightSeed"]
    },
    itemDemonPowder : {
        "label": "鬼人の粉塵",
        "addAttack": 10,
        "order": 507
    },
    mealNative: {
        "label": "食事：振る舞い",
        "addAttack": 5,
        "order": 504,
        "disables": ["mealMobile"]
    },
    mealMobile: {
        "label": "食事：携帯肉",
        "addAttack": 2,
        "order": 505
    }
} as const;

// そのままだとstringはnumberに自動変換しうるため&stringを付けないとtypescriptのエラーが出る
export type BuffKey = keyof typeof BUFF_DATA & string;