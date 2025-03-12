export const WEAPON_STATS_LABELS = {
  attack: {
    label: '攻撃力',
    note: '武器の基礎攻撃力（係数表示OFF、スキルやバフ補正前）'
  },
  affinity: {
    label: '会心率',
    note: '武器の会心率（スキルやバフ補正前）'
  },
  elementType: {
    label: '属性',
    note: '武器の属性種類、異常属性は現状選んでも選ばなくても影響なし'
  },
  elementValue: {
    label: '属性値',
    note: '武器の属性値（ステータス画面で表示される10倍表記でOK、スキルやバフ補正前）'
  },
  sharpness: {
    label: '斬れ味',
    note: '匠はスキル設定で未対応のため色を上げる場合はここで設定'
  }
} as const
