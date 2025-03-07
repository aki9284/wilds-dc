export interface Buff {
    label: string;
    multiplyAttack?: number;
    multiplyElement?: number;
    addAttack?: number;
    addElement?: number;
    addAffinity?: number;
    requirements?: string[];
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
    powercharm: {
        "label": "力の護符",
        "addAttack": 6,
        "order": 501
    },
    itemMegaDemonDrug: {
        "label": "鬼人薬G",
        "addAttack": 7,
        "order": 502
    },
    itemDemonDrug: {
        "label": "鬼人薬",
        "addAttack": 5,
        "order": 503
    }
} as const;

// そのままだとstringはnumberに自動変換しうるため&stringを付けないとtypescriptのエラーが出る
export type BuffKey = keyof typeof BUFF_DATA & string;