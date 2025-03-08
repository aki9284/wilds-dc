'use client'

import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { calculateDamage, CalculationResults } from '@/lib/calculations/damageCalculator'
import { getCachedMotionData } from '@/utils/dataFetch'

// SaveLoadPanelと同じロジックを使用
const loadSavedItems = (storageKey: string) => {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return []
    return JSON.parse(saved)
}

const loadPresetData = async (filePath: string) => {
    const response = await fetch(filePath)
    const presets = await response.json()
    return presets
}

interface ComparisonRow {
    id: string
    equipmentPresetName: string
    targetPresetName: string
    motionPresetName: string
    conditionPresetName: string
    results: CalculationResults | null
    isCalculating: boolean
}

export function ComparePanel() {
    const motions = getCachedMotionData();
    const [rows, setRows] = useState<ComparisonRow[]>([])
    const [equipmentPresets, setEquipmentPresets] = useState<any[]>([])
    const [targetPresets, setTargetPresets] = useState<any[]>([])
    const [motionPresets, setMotionPresets] = useState<any[]>([])
    const [conditionPresets, setConditionPresets] = useState<any[]>([])

    // 各種プリセット読み込み
    useEffect(() => {
        const loadAllPresets = async () => {
            // ローカルストレージから項目を読み込み
            const savedEquipment = loadSavedItems('equipment-settings')
            const savedTargets = loadSavedItems('target-settings')
            const savedMotions = loadSavedItems('motion-settings')
            const savedConditions = loadSavedItems('condition-settings')
            
            // JSONファイルからプリセットを読み込み
            const equipmentJsonPresets = await loadPresetData('/data/equipmentPresets.json')
            const targetJsonPresets = await loadPresetData('/data/targetPresets.json')
            const motionJsonPresets = await loadPresetData('/data/motionPresets.json')
            const conditionJsonPresets = await loadPresetData('/data/conditionPresets.json')
            
            // 両方を結合して設定
            setEquipmentPresets([...savedEquipment, ...equipmentJsonPresets])
            setTargetPresets([...savedTargets, ...targetJsonPresets])
            setMotionPresets([...savedMotions, ...motionJsonPresets])
            setConditionPresets([...savedConditions, ...conditionJsonPresets])
        }

        loadAllPresets()
    }, [])

    // 新しい行を追加
    const addRow = () => {
        const newRow: ComparisonRow = {
            id: nanoid(),
            equipmentPresetName: equipmentPresets.length > 0 ? equipmentPresets[0].name : '',
            targetPresetName: targetPresets.length > 0 ? targetPresets[0].name : '',
            motionPresetName: motionPresets.length > 0 ? motionPresets[0].name : '',
            conditionPresetName: conditionPresets.length > 0 ? conditionPresets[0].name : '',
            results: null,
            isCalculating: false
        }
        setRows([...rows, newRow])
    }

    // 行を削除
    const removeRow = (id: string) => {
        setRows(rows.filter(row => row.id !== id))
    }

    // プリセット選択を更新
    const updateRowPreset = (id: string, field: keyof ComparisonRow, value: string) => {
        setRows(rows.map(row => 
            row.id === id ? { ...row, [field]: value, results: null } : row
        ))
    }

    // 特定の行の計算を実行
    const calculateRow = async (row: ComparisonRow) => {
        // 既に計算済みの場合はスキップ
        if (row.results !== null) return

        // プリセットが選択されているか確認
        if (!row.equipmentPresetName || !row.targetPresetName || 
            !row.motionPresetName || !row.conditionPresetName) {
            return
        }

        // 計算中フラグを設定
        setRows(rows.map(r => 
            r.id === row.id ? { ...r, isCalculating: true } : r
        ))

        // 各プリセットのデータを取得
        const equipmentPreset = equipmentPresets.find(p => p.name === row.equipmentPresetName)
        const targetPreset = targetPresets.find(p => p.name === row.targetPresetName)
        const motionPreset = motionPresets.find(p => p.name === row.motionPresetName)
        const conditionPreset = conditionPresets.find(p => p.name === row.conditionPresetName)

        if (!equipmentPreset || !targetPreset || !motionPreset || !conditionPreset) {
            setRows(rows.map(r => 
                r.id === row.id ? { ...r, isCalculating: false } : r
            ))
            return
        }

        // 計算に必要な値をプリセットから取得
        const weaponStats = equipmentPreset.data.weaponStats
        const selectedSkills = equipmentPreset.data.selectedSkills
        const selectedBuffs = equipmentPreset.data.selectedBuffs
        const selectedTargets = targetPreset.data.targets
        const selectedMotions = motionPreset.data.selectedMotions.map((name: string) => {
            const motion = motions.find(m => m.name === name) || null;
            return { id: nanoid(), motion };
        });
        const conditionValues = conditionPreset.data

        // ダメージ計算
        try {
            const results = calculateDamage({
                weaponStats,
                selectedSkills,
                selectedBuffs,
                selectedTargets,
                selectedMotions,
                conditionValues
            })

            // 結果を更新
            setRows(rows.map(r => 
                r.id === row.id ? { ...r, results, isCalculating: false } : r
            ))
        } catch (error) {
            console.error("計算エラー:", error)
            setRows(rows.map(r => 
                r.id === row.id ? { ...r, isCalculating: false } : r
            ))
        }
    }

    // すべての行の計算を実行
    const calculateAllRows = () => {
        rows.forEach(row => calculateRow(row))
    }

    // 初回レンダリング時に空の行を追加
    useEffect(() => {
        if (rows.length === 0 && 
            equipmentPresets.length > 0 && 
            targetPresets.length > 0 && 
            motionPresets.length > 0 && 
            conditionPresets.length > 0) {
            addRow()
        }
    }, [equipmentPresets, targetPresets, motionPresets, conditionPresets])

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">装備・条件の複数比較</h2>
            
            <div className="flex justify-between mb-4">
                <button 
                    onClick={addRow}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    行を追加
                </button>
                <button 
                    onClick={calculateAllRows}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    すべて計算
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-3 border text-left">装備</th>
                            <th className="py-2 px-3 border text-left">攻撃対象</th>
                            <th className="py-2 px-3 border text-left">モーション</th>
                            <th className="py-2 px-3 border text-left">計算条件</th>
                            <th className="py-2 px-3 border text-right">最小ダメージ</th>
                            <th className="py-2 px-3 border text-right">期待ダメージ</th>
                            <th className="py-2 px-3 border text-right">最大ダメージ</th>
                            <th className="py-2 px-3 border text-right">DPS</th>
                            <th className="py-2 px-3 border text-center">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                <td className="py-2 px-3 border">
                                    <select
                                        value={row.equipmentPresetName}
                                        onChange={(e) => updateRowPreset(row.id, 'equipmentPresetName', e.target.value)}
                                        className="w-full p-1 border rounded"
                                    >
                                        <option value="">選択してください</option>
                                        {equipmentPresets.map(preset => (
                                            <option key={preset.name} value={preset.name}>
                                                {preset.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="py-2 px-3 border">
                                    <select
                                        value={row.targetPresetName}
                                        onChange={(e) => updateRowPreset(row.id, 'targetPresetName', e.target.value)}
                                        className="w-full p-1 border rounded"
                                    >
                                        <option value="">選択してください</option>
                                        {targetPresets.map(preset => (
                                            <option key={preset.name} value={preset.name}>
                                                {preset.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="py-2 px-3 border">
                                    <select
                                        value={row.motionPresetName}
                                        onChange={(e) => updateRowPreset(row.id, 'motionPresetName', e.target.value)}
                                        className="w-full p-1 border rounded"
                                    >
                                        <option value="">選択してください</option>
                                        {motionPresets.map(preset => (
                                            <option key={preset.name} value={preset.name}>
                                                {preset.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="py-2 px-3 border">
                                    <select
                                        value={row.conditionPresetName}
                                        onChange={(e) => updateRowPreset(row.id, 'conditionPresetName', e.target.value)}
                                        className="w-full p-1 border rounded"
                                    >
                                        <option value="">選択してください</option>
                                        {conditionPresets.map(preset => (
                                            <option key={preset.name} value={preset.name}>
                                                {preset.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="py-2 px-3 border text-right font-mono">
                                    {row.isCalculating ? (
                                        <span className="text-gray-400">計算中...</span>
                                    ) : row.results ? (
                                        row.results.minDamage.total
                                    ) : (
                                        <button 
                                            onClick={() => calculateRow(row)}
                                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                        >
                                            計算
                                        </button>
                                    )}
                                </td>
                                <td className="py-2 px-3 border text-right font-mono">
                                    {row.results && !row.isCalculating ? row.results.expectedDamage.total : '-'}
                                </td>
                                <td className="py-2 px-3 border text-right font-mono">
                                    {row.results && !row.isCalculating ? row.results.maxDamage.total : '-'}
                                </td>
                                <td className="py-2 px-3 border text-right font-mono">
                                    {row.results && !row.isCalculating ? row.results.dps : '-'}
                                </td>
                                <td className="py-2 px-3 border text-center">
                                    <button 
                                        onClick={() => removeRow(row.id)}
                                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    >
                                        削除
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={9} className="py-4 text-center text-gray-500">
                                    データがありません。「行を追加」ボタンをクリックして比較を開始してください。
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
