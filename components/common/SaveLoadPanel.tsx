'use client'

import { useState, useEffect } from 'react'

interface SaveLoadPanelProps {
  storageKey: string;
  presetFilePath: string;
  onSave: (name: string) => any;
  onLoad: (data: any) => void;
}

interface SavedItem {
  version: string;
  key: string;
  name: string;
  description: string;
  data: any;
}

const CURRENT_DATA_VERSION = '1.0.0';

const loadPresetData = async (filePath: string): Promise<SavedItem[]> => {
  const response = await fetch(filePath);
  const presets = await response.json();
  return presets.map((preset: any) => ({
      version: CURRENT_DATA_VERSION,
      key: preset.name,
      name: preset.name,
      description: preset.description,
      data: preset.data,
  }));
}

function validateAndMigrateData(items: SavedItem[]): SavedItem[] {
  return items.filter(item => {
  if (!item.version) return false;

  switch (item.version) {
      case '1.0.0':
          return true;
      default:
          return false;
      }
  });
}

export function SaveLoadPanel({ storageKey, presetFilePath, onSave, onLoad }: SaveLoadPanelProps) {
  const [saveName, setSaveName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [presetItems, setPresetItems] = useState<SavedItem[]>([]);
  const [showPresets, setShowPresets] = useState(true);

  useEffect(() => {
      const loadSavedItems = () => {
          const saved = localStorage.getItem(storageKey);
          const items = saved ? JSON.parse(saved) : [];
          setSavedItems(validateAndMigrateData(items));
      };

      const loadPresets = async () => {
          const presets = await loadPresetData(presetFilePath);
          setPresetItems(presets);
      };

      loadSavedItems();
      loadPresets();
  }, [storageKey, presetFilePath]);

  const handleSave = (name: string) => {
      const data = onSave(name);
      const newItem: SavedItem = {
          version: CURRENT_DATA_VERSION,
          key: Date.now().toString(),
          name,
          description: 'ユーザー定義',
          data
      };
      const newItems = [newItem, ...savedItems];
      localStorage.setItem(storageKey, JSON.stringify(newItems));
      setSavedItems(newItems);
      setSaveName('');
  };

  const handleRename = (index: number, newName: string) => {
      const newItems = savedItems.map((item, i) => 
      i === index ? { ...item, name: newName } : item
      )
      localStorage.setItem(storageKey, JSON.stringify(newItems))
      setSavedItems(newItems)
      setIsRenaming(false)
      setSelectedIndex(null)
  }

  const handleDelete = (index: number) => {
      const newItems = savedItems.filter((_, i) => i !== index)
      localStorage.setItem(storageKey, JSON.stringify(newItems))
      setSavedItems(newItems)
      setSelectedIndex(null)
  }
    return (
        <div className="space-y-4 p-4 border-l">
            <div className="space-y-2">
                <h3 className="font-bold">設定を保存</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={saveName}
                        onChange={(e) => setSaveName(e.target.value)}
                        placeholder="保存名を入力"
                        className="border rounded p-2"
                    />
                    <button
                        onClick={() => handleSave(saveName)}
                        disabled={!saveName}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
                    >
                        保存
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="font-bold">保存済み設定とプリセット</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showPresets}
                        onChange={() => setShowPresets(!showPresets)}
                    />
                    <label>プリセットを表示</label>
                </div>
                <select
                    size={5}
                    className="w-full border rounded p-2"
                    onChange={(e) => {
                        const index = Number(e.target.value);
                        setSelectedIndex(index);
                        onLoad([...presetItems, ...savedItems][index].data);
                    }}
                >
                    {[
                        ...(showPresets ? presetItems : []), // プリセットの表示/非表示を切り替える
                        ...savedItems
                    ].map((item, index) => (
                        <option
                            key={item.key}
                            value={index}
                        >
                            {item.name} - {item.description}
                        </option>
                    ))}
                </select>
                {selectedIndex !== null && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onLoad([...presetItems, ...savedItems][selectedIndex].data)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            読み込み
                        </button>
                        {selectedIndex >= (showPresets ? presetItems.length : 0) && (
                            <>
                                {isRenaming ? (
                                    <>
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="border rounded p-2"
                                        />
                                        <button
                                            onClick={() => handleRename(selectedIndex - (showPresets ? presetItems.length : 0), newName)}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                        >
                                            確定
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsRenaming(true);
                                            setNewName(savedItems[selectedIndex - (showPresets ? presetItems.length : 0)].name);
                                        }}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                    >
                                        名前変更
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(selectedIndex - (showPresets ? presetItems.length : 0))}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    削除
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
  }
