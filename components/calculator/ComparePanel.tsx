'use client'

import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { calculateDamage, CalculationResults } from '@/lib/calculations/damageCalculator'
import { getCachedMotionData } from '@/utils/dataFetch'
import { ComparisonRow, comparisonRowsAtom } from '@/models/atoms/comparePanelAtom' // Import the new atom
import { SavedItem } from '../common/SaveLoadPanel'

// SaveLoadPanelと同じロジックを使用 (変更なし)
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

export function ComparePanel() {
    const motions = getCachedMotionData();
    const [rows, setRows] = useAtom(comparisonRowsAtom); // Use the atom
    const [equipmentPresets, setEquipmentPresets] = useState<SavedItem[]>([])
    const [targetPresets, setTargetPresets] = useState<SavedItem[]>([])
    const [motionPresets, setMotionPresets] = useState<SavedItem[]>([])
    const [conditionPresets, setConditionPresets] = useState<SavedItem[]>([])

    // 各種プリセット読み込み (変更なし)
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

    // タブ切り替え時などに全行再計算
    useEffect(() => {
        // 全ての行に対して計算を試みる
        rows.forEach(row => {
          const hasAllPresets = 
            equipmentPresets.find(p => p.name === row.equipmentPresetName) &&
            targetPresets.find(p => p.name === row.targetPresetName) &&
            motionPresets.find(p => p.name === row.motionPresetName) &&
            conditionPresets.find(p => p.name === row.conditionPresetName);
      
          if (hasAllPresets) {
            calculateRow(row);
          } else {
            // プリセットが見つからない場合は結果をクリア
            setRows(prevRows => 
              prevRows.map(r => 
                r.id === row.id ? { ...r, results: null } : r
              )
            );
          }
        });
      }, [equipmentPresets, targetPresets, motionPresets, conditionPresets]);
      
    // 新しい行を追加 (atom を更新)
    const addRow = () => {
        const newRow = {
            id: nanoid(),
            equipmentPresetName: equipmentPresets.length > 0 ? equipmentPresets[0].name : '',
            targetPresetName: targetPresets.length > 0 ? targetPresets[0].name : '',
            motionPresetName: motionPresets.length > 0 ? motionPresets[0].name : '',
            conditionPresetName: conditionPresets.length > 0 ? conditionPresets[0].name : '',
        }
        setRows([...rows, newRow])
    }

    // 行を削除 (atom を更新)
    const removeRow = (id: string) => {
        setRows(rows.filter(row => row.id !== id))
    }

    const removeAllRows = () => {
        setRows([]);  // これにより全行が削除され、useEffect により自動的に1行が追加されます
    };

    // プリセット選択を更新 (atom を更新)
    const updateRowPreset = (id: string, field: keyof ComparisonRow, value: string) => {
        setRows(
            rows.map((row) => 
                row.id === id 
                ? { ...row, [field]: value, results: null } // resultsをnullにリセット
                : row
            )
        );
    };

    // 特定の行の計算を実行
    const calculateRow = async (row: ComparisonRow) => {

        // 計算前に results を null に設定
        setRows(prevRows => prevRows.map(r => r.id === row.id ? { ...r, results: null } : r));

        // 各プリセットのデータを取得 (null チェックを追加)
        const equipmentPreset = equipmentPresets.find(p => p.name === row.equipmentPresetName) ?? null;
        const targetPreset = targetPresets.find(p => p.name === row.targetPresetName) ?? null;
        const motionPreset = motionPresets.find(p => p.name === row.motionPresetName) ?? null;
        const conditionPreset = conditionPresets.find(p => p.name === row.conditionPresetName) ?? null;

        if (!equipmentPreset || !targetPreset || !motionPreset || !conditionPreset) {
            console.error("Preset not found for:", row);
            // 必要に応じてエラーメッセージを表示するなどの処理
            return;
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

            // 結果をローカルステートに反映 (atomはプリセット名のみ保持)
            setRows(prevRows => prevRows.map(r => {
                if (r.id === row.id) {
                    return { ...r, results }; // results を保持
                }
                return r;
            }));

        } catch (error) {
            console.error("計算エラー:", error)
            // 必要に応じてエラーメッセージを表示
        }
    }
    // 計算結果表示用のstate
    const [resultsMap, setResultsMap] = useState<Record<string, CalculationResults | null>>({});

    useEffect(() => {
        const newResultsMap: Record<string, CalculationResults | null> = {};
        rows.forEach(row => {
          if (row.results) {
            newResultsMap[row.id] = row.results;
          } else {
            newResultsMap[row.id] = null;
          }
        });
        setResultsMap(newResultsMap);
      }, [rows]);

    // すべての行の計算を実行
    const calculateAllRows = () => {
      const promises = rows.map(row => calculateRow(row));
      Promise.all(promises).then(() => {
          // 全ての計算が終了した後の処理（必要であれば）
      });
    };

    // 初回レンダリング時に空の行を追加 (atom が空の場合のみ)
    useEffect(() => {
        if (rows.length === 0 &&
            equipmentPresets.length > 0 &&
            targetPresets.length > 0 &&
            motionPresets.length > 0 &&
            conditionPresets.length > 0) {
            addRow()
        }
    }, [equipmentPresets, targetPresets, motionPresets, conditionPresets, rows.length]) // rows.length を依存配列に追加


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
                <div className="flex gap-2">
                    <button
                        onClick={calculateAllRows}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        すべて計算
                    </button>
                    <button
                        onClick={removeAllRows}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        すべて削除
                    </button>
                </div>
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
                                <td className="py-2 px-3 border text-right font-mono" colSpan={resultsMap[row.id] ? 1 : 4}>
                                    {resultsMap[row.id] ? (
                                        resultsMap[row.id]?.minDamage.total
                                    ) : (
                                        <button
                                        onClick={() => calculateRow(row)}
                                        className="w-full h-[28px] leading-[28px] px-4 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
                                        >
                                        計算
                                        </button>
                                    )}
                                </td>
                                {resultsMap[row.id] && (
                                    <>
                                        <td className="py-2 px-3 border text-right font-mono">
                                        {resultsMap[row.id]?.expectedDamage.total}
                                        </td>
                                        <td className="py-2 px-3 border text-right font-mono">
                                        {resultsMap[row.id]?.maxDamage.total}
                                        </td>
                                        <td className="py-2 px-3 border text-right font-mono">
                                        {resultsMap[row.id]?.dps}
                                        </td>
                                    </>
                                )}
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
