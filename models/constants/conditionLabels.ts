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
    skillTozyuEnabled: {
        label: '闘獣の力発動割合',
        type: 'possibility',
    }
} as const;