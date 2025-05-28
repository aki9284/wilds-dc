export const CONDITION_LABELS = {
    damageCut: {
        label: '全体防御率',
        type: 'percentage',
    },
    enraged: {
        label: '怒り状態割合',
        type: 'possibility',
    },
    skillPeakPerformanceEnabled: {
        label: 'フルチャージ発動割合',
        type: 'possibility',
    },
    skillBurstEnabled: {
        label: '連撃発動割合',
        type: 'possibility',
    },
    skillAdrenalineRushEnabled: {
        label: '巧撃発動割合',
        type: 'possibility',
    },
    skillCounterstrikeEnabled: {
        label: '逆襲発動割合',
        type: 'possibility',
    },
    skillMaximumMightEnabled: {
        label: '渾身発動割合',
        type: 'possibility',
    },
    frenzyRecovered: {
        label: '狂竜症克服状態割合',
        type: 'possibility',
    },
    coalescenceEnabled: {
        label: '災禍転福発動割合',
        type: 'possibility',
    },
    skillLordsSoulEnabled: {
        label: '根性【果敢】攻撃力UP状態割合',
        type: 'possibility',
    }
} as const;